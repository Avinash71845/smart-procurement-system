package com.hackathon_group.smart_procurement_system_backend.booking.service;

import com.hackathon_group.smart_procurement_system_backend.booking.dto.BookingCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.booking.dto.BookingResponse;
import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import com.hackathon_group.smart_procurement_system_backend.booking.repository.BookingRepository;
import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import com.hackathon_group.smart_procurement_system_backend.slot.entity.Slot;
import com.hackathon_group.smart_procurement_system_backend.slot.entity.SlotStatus;
import com.hackathon_group.smart_procurement_system_backend.slot.repository.SlotRepository;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;


    public BookingResponse createBooking(
            BookingCreateRequest request,
            String mobile) {

        // 1. Find logged-in user
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // 2. Find farmer profile
        Farmer farmer = farmerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Farmer profile not found"));


        // 3. Find slot
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() ->
                        new RuntimeException("Slot not found"));


        // 4. Check slot status
        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new RuntimeException("Slot is not available");
        }


        // 5. Check farmer's existing bookings
        List<Booking> farmerBookings =
                bookingRepository.findByFarmer_Id(farmer.getId());

        for (Booking booking : farmerBookings) {

            // Active booking exists
            if (booking.getStatus() == BookingStatus.BOOKED ||
                    booking.getStatus() == BookingStatus.CHECKED_IN) {

                throw new RuntimeException(
                        "You already have an active booking");
            }

            // Same date already used
            if (booking.getSlot().getDate()
                    .equals(slot.getDate())
                    &&
                    booking.getStatus() ==
                            BookingStatus.PROCUREMENT_COMPLETED) {

                throw new RuntimeException(
                        "You already have a procurement on this date");
            }
        }


        // 6. Check slot capacity
        double currentBookedCapacity =
                slot.getBookedCapacityKg();

        double requestedWeight =
                request.getGrainWeight();

        double remainingCapacity =
                slot.getCapacityKg() - currentBookedCapacity;

        if (requestedWeight > remainingCapacity) {

            throw new RuntimeException(
                    "Not enough capacity available for this slot");
        }


        // 7. Calculate estimated processing time
        // Processing rate = 500 kg/hour

        int estimatedMinutes =
                (int) Math.ceil(
                        (requestedWeight / 500.0) * 60
                );


        // 8. Generate token
        String tokenNumber =
                "TOKEN-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();


        // 9. Create booking
        Booking booking = new Booking();

        booking.setFarmer(farmer);
        booking.setSlot(slot);
        booking.setGrainWeight(requestedWeight);
        booking.setEstimatedProcessingMinutes(
                estimatedMinutes);
        booking.setTokenNumber(tokenNumber);
        booking.setStatus(BookingStatus.BOOKED);
        booking.setBookingDate(LocalDateTime.now());


        // 10. Update slot booked capacity
        slot.setBookedCapacityKg(
                currentBookedCapacity +
                        requestedWeight);


        // 11. Check if slot is now full
        if (slot.getBookedCapacityKg()
                >= slot.getCapacityKg()) {

            slot.setStatus(SlotStatus.FULL);
        }


        // 12. Save slot
        slotRepository.save(slot);


        // 13. Save booking
        Booking savedBooking =
                bookingRepository.save(booking);


        // 14. Return response
        return mapToResponse(savedBooking);
    }

    public BookingResponse getBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        return mapToResponse(booking);
    }

    public List<BookingResponse> getMyBookings(String mobile) {

        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Farmer farmer = farmerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Farmer profile not found"));

        List<Booking> bookings =
                bookingRepository.findByFarmer_Id(farmer.getId());

        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            responses.add(mapToResponse(booking));
        }

        return responses;
    }

    public BookingResponse getBookingByToken(String tokenNumber) {

        Booking booking =
                bookingRepository.findByTokenNumber(tokenNumber)
                        .orElseThrow(() ->
                                new RuntimeException("Booking not found"));

        return mapToResponse(booking);
    }


    private BookingResponse mapToResponse(
            Booking booking) {

        BookingResponse response =
                new BookingResponse();

        response.setId(booking.getId());
        response.setFarmerId(
                booking.getFarmer().getId());
        response.setSlotId(
                booking.getSlot().getId());
        response.setGrainWeight(
                booking.getGrainWeight());
        response.setEstimatedProcessingMinutes(
                booking.getEstimatedProcessingMinutes());
        response.setTokenNumber(
                booking.getTokenNumber());
        response.setStatus(
                booking.getStatus());
        response.setBookingDate(
                booking.getBookingDate());
        response.setCheckInTime(
                booking.getCheckInTime());

        return response;
    }
}