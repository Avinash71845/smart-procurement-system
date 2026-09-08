package com.hackathon_group.smart_procurement_system_backend.payment.controller;

import com.hackathon_group.smart_procurement_system_backend.payment.dto.BookedFarmerPaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // Create or disburse a payment record for a booked farmer.
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody PaymentCreateRequest request) {

        PaymentResponse response =
                paymentService.createPayment(request);

        return ResponseEntity.ok(response);
    }


    // Get payment using payment ID.
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long id) {

        PaymentResponse response =
                paymentService.getPayment(id);

        return ResponseEntity.ok(response);
    }


    // Get payment using booking ID.
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(
            @PathVariable Long bookingId) {

        PaymentResponse response =
                paymentService.getPaymentByBooking(bookingId);

        return ResponseEntity.ok(response);
    }


    // Farmer-specific single booking payment endpoint.
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


    // Farmer-specific comprehensive list: All bookings and payment statuses for logged-in farmer.
    @GetMapping("/my-payments")
    public ResponseEntity<List<BookedFarmerPaymentResponse>> getMyPayments(
            Authentication authentication) {

        String mobile = authentication.getName();
        List<BookedFarmerPaymentResponse> response = paymentService.getMyPayments(mobile);
        return ResponseEntity.ok(response);
    }


    // Operator endpoint: View all booked farmers with slot, weighment, and payment records.
    @GetMapping("/operator/booked-farmers")
    public ResponseEntity<List<BookedFarmerPaymentResponse>> getBookedFarmers(
            @RequestParam(required = false) Long centreId) {

        List<BookedFarmerPaymentResponse> response = paymentService.getBookedFarmers(centreId);
        return ResponseEntity.ok(response);
    }


    // Operator endpoint: Summary statistics for payments and booked farmers.
    @GetMapping("/operator/summary")
    public ResponseEntity<Map<String, Object>> getOperatorSummary() {
        Map<String, Object> summary = paymentService.getOperatorSummary();
        return ResponseEntity.ok(summary);
    }


    // Update payment status (PENDING, PAID, FAILED) and transaction ID/amount.
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