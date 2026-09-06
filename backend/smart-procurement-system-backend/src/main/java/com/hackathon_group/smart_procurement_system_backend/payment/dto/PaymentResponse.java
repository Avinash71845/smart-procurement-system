package com.hackathon_group.smart_procurement_system_backend.payment.dto;

import com.hackathon_group.smart_procurement_system_backend.payment.entity.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentResponse {

    private Long id;
    private Long bookingId;
    private Double amount;
    private PaymentStatus status;
    private LocalDateTime paymentDate;
    private String transactionId;
}