package com.hackathon_group.smart_procurement_system_backend.notification.repository;

import com.hackathon_group.smart_procurement_system_backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications of a farmer
    List<Notification> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    // Get only unread notifications of a farmer
    List<Notification> findByFarmerIdAndIsReadFalseOrderByCreatedAtDesc(Long farmerId);
}