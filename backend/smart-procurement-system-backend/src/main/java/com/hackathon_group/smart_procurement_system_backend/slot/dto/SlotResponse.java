package com.hackathon_group.smart_procurement_system_backend.slot.dto;

import com.hackathon_group.smart_procurement_system_backend.slot.entity.SlotStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class SlotResponse {

    private Long id;

    private Long procurementCentreId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private SlotStatus status;
}