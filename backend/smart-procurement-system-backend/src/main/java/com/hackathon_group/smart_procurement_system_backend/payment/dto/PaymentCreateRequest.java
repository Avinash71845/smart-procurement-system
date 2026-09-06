package com.hackathon_group.smart_procurement_system_backend.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCreateRequest {

    @NotNull
    private Long bookingId;

    @NotNull
    @Positive
    private Double amount;
}