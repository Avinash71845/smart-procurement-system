package com.hackathon_group.smart_procurement_system_backend.payment.controller;

import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // Create a payment record after procurement is completed.
    // For now, this endpoint is mainly for the operator/backend side.
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentCreateRequest request) {

        PaymentResponse response =
                paymentService.createPayment(request);

        return ResponseEntity.ok(response);
    }


    // Get payment using payment ID.
    // This endpoint can be restricted by role later if needed.
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long id) {

        PaymentResponse response =
                paymentService.getPayment(id);

        return ResponseEntity.ok(response);
    }


    // Get payment using booking ID.
    // Useful when the frontend already knows the booking ID.
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(
            @PathVariable Long bookingId) {

        PaymentResponse response =
                paymentService.getPaymentByBooking(bookingId);

        return ResponseEntity.ok(response);
    }


    // Farmer-specific endpoint.
    // Authentication.getName() gives the mobile number from the JWT.
    //
    // JWT → mobile → User → Farmer → Booking → Payment
    //
    // PaymentService verifies that the booking actually belongs
    // to the logged-in farmer.
    @GetMapping("/my/{bookingId}")
    public ResponseEntity<PaymentResponse> getMyPayment(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String mobile = authentication.getName();

        PaymentResponse response =
                paymentService.getMyPayment(
                        bookingId,
                        mobile);

        return ResponseEntity.ok(response);
    }


    // Update payment status.
    // Example:
    // PENDING → PAID
    //
    // Later this should ideally be restricted to the operator/payment role.
    @PatchMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentUpdateRequest request) {

        PaymentResponse response =
                paymentService.updatePayment(
                        id,
                        request);

        return ResponseEntity.ok(response);
    }
}