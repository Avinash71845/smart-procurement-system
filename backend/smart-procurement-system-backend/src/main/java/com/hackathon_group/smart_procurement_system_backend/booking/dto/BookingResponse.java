package com.hackathon_group.smart_procurement_system_backend.booking.dto;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingResponse {

    private Long id;

    private Long farmerId;

    private Long slotId;

    private Double grainWeight;

    private Integer estimatedProcessingMinutes;

    private String tokenNumber;

    private BookingStatus status;

    private LocalDateTime bookingDate;

    private LocalDateTime checkInTime;
}