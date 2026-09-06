package com.hackathon_group.smart_procurement_system_backend.queue.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckInRequest {
    private Long bookingId;
}