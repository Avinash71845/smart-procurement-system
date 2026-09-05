package com.hackathon_group.smart_procurement_system_backend.queue.dto;

import com.hackathon_group.smart_procurement_system_backend.queue.entity.QueueStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QueueTokenResponse {
    private Long id;
    private Integer tokenNumber;
    private Long bookingId;
    private String farmerName;
    private String farmerPhone;
    private Double grainWeight;
    private QueueStatus status;
    private LocalDateTime checkInTime;
    private LocalDateTime calledTime;
}
