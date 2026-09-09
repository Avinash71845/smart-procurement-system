package com.hackathon_group.smart_procurement_system_backend.notification.service;

import com.hackathon_group.smart_procurement_system_backend.notification.dto.NotificationResponse;
import com.hackathon_group.smart_procurement_system_backend.notification.entity.Notification;
import com.hackathon_group.smart_procurement_system_backend.notification.entity.NotificationType;
import com.hackathon_group.smart_procurement_system_backend.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Create a new notification
    public NotificationResponse createNotification(
            Long farmerId,
            String title,
            String message,
            NotificationType type
    ) {

        Notification notification = Notification.builder()
                .farmerId(farmerId)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        Notification savedNotification =
                notificationRepository.save(notification);

        return convertToResponse(savedNotification);
    }

    // Get all notifications of a farmer
    public List<NotificationResponse> getFarmerNotifications(Long farmerId) {

        return notificationRepository
                .findByFarmerIdOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get unread notifications
    public List<NotificationResponse> getUnreadNotifications(Long farmerId) {

        return notificationRepository
                .findByFarmerIdAndIsReadFalseOrderByCreatedAtDesc(farmerId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Mark notification as read
    public NotificationResponse markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);

        Notification updatedNotification =
                notificationRepository.save(notification);

        return convertToResponse(updatedNotification);
    }

    // Delete notification
    public void deleteNotification(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notificationRepository.delete(notification);
    }

    // Convert Entity → DTO
    private NotificationResponse convertToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}