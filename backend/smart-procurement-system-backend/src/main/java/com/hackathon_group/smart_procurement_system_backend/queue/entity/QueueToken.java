package com.hackathon_group.smart_procurement_system_backend.queue.entity;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tokens")
@Getter
@Setter
@NoArgsConstructor
public class QueueToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer tokenNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status = QueueStatus.WAITING;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    private LocalDateTime calledTime;

    private LocalDateTime completedTime;

    public QueueToken(Integer tokenNumber, Booking booking) {
        this.tokenNumber = tokenNumber;
        this.booking = booking;
        this.status = QueueStatus.WAITING;
        this.checkInTime = LocalDateTime.now();
    }
}
