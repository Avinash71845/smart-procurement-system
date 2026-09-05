package com.hackathon_group.smart_procurement_system_backend.queue.service;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import com.hackathon_group.smart_procurement_system_backend.booking.repository.BookingRepository;
import com.hackathon_group.smart_procurement_system_backend.queue.dto.QueueTokenResponse;
import com.hackathon_group.smart_procurement_system_backend.queue.entity.QueueStatus;
import com.hackathon_group.smart_procurement_system_backend.queue.entity.QueueToken;
import com.hackathon_group.smart_procurement_system_backend.queue.repository.QueueTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueTokenRepository queueTokenRepository;
    private final BookingRepository bookingRepository;

    // 1. Farmer Gate Check-in
    @Transactional
    public QueueTokenResponse checkIn(Long bookingId) {
        if (queueTokenRepository.existsByBookingId(bookingId)) {
            throw new RuntimeException("Token already issued for this booking!");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setCheckInTime(LocalDateTime.now());
        bookingRepository.save(booking);

        Integer nextTokenNumber = queueTokenRepository.findMaxTokenNumber() + 1;
        QueueToken token = new QueueToken(nextTokenNumber, booking);
        QueueToken savedToken = queueTokenRepository.save(token);

        return mapToResponse(savedToken);
    }

    // 2. Operator Action: Call Next Farmer (FIFO)
    @Transactional
    public QueueTokenResponse callNext() {
        QueueToken nextToken = queueTokenRepository
                .findFirstByStatusOrderByCheckInTimeAsc(QueueStatus.WAITING)
                .orElseThrow(() -> new RuntimeException("No farmers waiting in the queue!"));

        nextToken.setStatus(QueueStatus.CALLED);
        nextToken.setCalledTime(LocalDateTime.now());

        QueueToken updatedToken = queueTokenRepository.save(nextToken);
        return mapToResponse(updatedToken);
    }

    // 3. Polling for Live Display Screen
    @Transactional(readOnly = true)
    public QueueTokenResponse getCurrentServing() {
        return queueTokenRepository
                .findFirstByStatusInOrderByCalledTimeDesc(List.of(QueueStatus.CALLED, QueueStatus.IN_PROGRESS))
                .map(this::mapToResponse)
                .orElse(null);
    }

    // 4. Operator Dashboard: View entire waiting line
    @Transactional(readOnly = true)
    public List<QueueTokenResponse> getWaitingQueue() {
        return queueTokenRepository.findByStatusOrderByCheckInTimeAsc(QueueStatus.WAITING)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Helper: Convert Entity -> DTO
    private QueueTokenResponse mapToResponse(QueueToken token) {
        Booking b = token.getBooking();
        return new QueueTokenResponse(
                token.getId(),
                token.getTokenNumber(),
                b.getId(),
                b.getFarmer() != null ? b.getFarmer().getName() : "N/A",
                b.getFarmer() != null ? b.getFarmer().getPhone() : "N/A",
                b.getGrainWeight(),
                token.getStatus(),
                token.getCheckInTime(),
                token.getCalledTime()
        );
    }
}
