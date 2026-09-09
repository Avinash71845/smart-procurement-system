package com.hackathon_group.smart_procurement_system_backend.notification.controller;

import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import com.hackathon_group.smart_procurement_system_backend.notification.dto.NotificationResponse;
import com.hackathon_group.smart_procurement_system_backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {


    private final NotificationService notificationService;

    @Autowired
    private final FarmerRepository farmerRepository;

    // Get all notifications of a farmer
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<NotificationResponse>> getFarmerNotifications(
            @PathVariable Long farmerId
    ) {
        return ResponseEntity.ok(
                notificationService.getFarmerNotifications(farmerId)
        );
    }

    // Get unread notifications
    @GetMapping("/farmer/{farmerId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable Long farmerId
    ) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(farmerId)
        );
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long notificationId
    ) {
        return ResponseEntity.ok(
                notificationService.markAsRead(notificationId)
        );
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId
    ) {
        notificationService.deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication
    ) {
        String phone = authentication.getName();

        Farmer farmer = farmerRepository.findByPhone(phone)
                .orElseThrow(() ->
                        new RuntimeException("Farmer information not found"));

        return ResponseEntity.ok(
                notificationService.getFarmerNotifications(farmer.getId())
        );
    }
}