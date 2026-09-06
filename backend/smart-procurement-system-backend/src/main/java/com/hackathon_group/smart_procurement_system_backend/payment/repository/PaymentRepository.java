package com.hackathon_group.smart_procurement_system_backend.payment.repository;

import com.hackathon_group.smart_procurement_system_backend.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);
}