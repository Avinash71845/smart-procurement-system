package com.hackathon_group.smart_procurement_system_backend.booking.entity;

import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.slot.entity.Slot;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Column(nullable = false)
    private Double grainWeight;

    @Column(nullable = false)
    private Integer estimatedProcessingMinutes;

    @Column(nullable = false, unique = true)
    private String tokenNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.BOOKED;

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    private LocalDateTime checkInTime;
}