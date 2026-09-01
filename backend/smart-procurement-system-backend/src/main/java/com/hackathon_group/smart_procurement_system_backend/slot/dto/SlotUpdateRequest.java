package com.hackathon_group.smart_procurement_system_backend.slot.dto;

import com.hackathon_group.smart_procurement_system_backend.slot.entity.SlotStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class SlotUpdateRequest {

    @NotNull
    @FutureOrPresent
    private LocalDate date;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotNull
    @Positive
    private Double capacityKg;

    @NotNull
    private SlotStatus status;
}