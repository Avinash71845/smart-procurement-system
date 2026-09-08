package com.hackathon_group.smart_procurement_system_backend.payment.dto;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import com.hackathon_group.smart_procurement_system_backend.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookedFarmerPaymentResponse {

    // Booking Details
    private Long bookingId;
    private String tokenNumber;
    private BookingStatus bookingStatus;
    private LocalDateTime bookingDate;
    private LocalDateTime checkInTime;
    private Double grainWeight;
    private Integer estimatedProcessingMinutes;

    // Farmer Details
    private Long farmerId;
    private String farmerName;
    private String farmerPhone;
    private String farmerVillage;
    private String farmerBlock;
    private String farmerDistrict;
    private String farmerState;

    // Slot & Procurement Centre Details
    private Long slotId;
    private LocalDate slotDate;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;
    private Long centreId;
    private String centreName;
    private String centreCode;
    private String centreAddress;

    // Payment Details (null if payment has not been initiated)
    private Long paymentId;
    private Double amount;
    private PaymentStatus paymentStatus; // PENDING, PAID, FAILED, or null
    private LocalDateTime paymentDate;
    private String transactionId;
}
