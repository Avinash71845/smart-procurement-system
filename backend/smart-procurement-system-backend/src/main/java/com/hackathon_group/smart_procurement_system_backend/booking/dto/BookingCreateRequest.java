package com.hackathon_group.smart_procurement_system_backend.booking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingCreateRequest {



    @NotNull
    private Long slotId;

    @NotNull
    @Positive
    private Double grainWeight;
}