package com.hackathon_group.smart_procurement_system_backend.notification.dto;

import com.hackathon_group.smart_procurement_system_backend.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private NotificationType type;

    private boolean isRead;

    private LocalDateTime createdAt;
}