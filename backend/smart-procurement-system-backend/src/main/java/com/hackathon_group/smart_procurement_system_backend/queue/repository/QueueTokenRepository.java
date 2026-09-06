package com.hackathon_group.smart_procurement_system_backend.queue.repository;

import com.hackathon_group.smart_procurement_system_backend.queue.entity.QueueStatus;
import com.hackathon_group.smart_procurement_system_backend.queue.entity.QueueToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    // Naya token sequence nikalne ke liye (agar koi token nahi hai toh 0 dega)
    @Query("SELECT COALESCE(MAX(q.tokenNumber), 0) FROM QueueToken q")
    Integer findMaxTokenNumber();

    // Duplicate check: Kya is booking ka token pehle se bana hua hai?
    boolean existsByBookingId(Long bookingId);

    // FIFO order: Line me sabse pehle aaya hua WAITING token (Call-Next ke liye)
    Optional<QueueToken> findFirstByStatusOrderByCheckInTimeAsc(QueueStatus status);

    // Polling / TV Display screen: Jo token abhi counter par chal raha hai
    Optional<QueueToken> findFirstByStatusInOrderByCalledTimeDesc(List<QueueStatus> statuses);

    // Waiting list screen ke liye
    List<QueueToken> findByStatusOrderByCheckInTimeAsc(QueueStatus status);
}