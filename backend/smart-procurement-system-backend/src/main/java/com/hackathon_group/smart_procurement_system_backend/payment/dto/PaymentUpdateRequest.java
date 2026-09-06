package com.hackathon_group.smart_procurement_system_backend.payment.dto;

import com.hackathon_group.smart_procurement_system_backend.payment.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentUpdateRequest {

    @NotNull
    private PaymentStatus status;

    private String transactionId;
}