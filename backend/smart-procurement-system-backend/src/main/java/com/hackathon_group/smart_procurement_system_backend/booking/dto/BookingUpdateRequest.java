package com.hackathon_group.smart_procurement_system_backend.booking.dto;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingUpdateRequest {

    @NotNull
    private BookingStatus status;
}