package com.hackathon_group.smart_procurement_system_backend.payment.service;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import com.hackathon_group.smart_procurement_system_backend.booking.repository.BookingRepository;
import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.entity.Payment;
import com.hackathon_group.smart_procurement_system_backend.payment.entity.PaymentStatus;
import com.hackathon_group.smart_procurement_system_backend.payment.repository.PaymentRepository;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private UserRepository userRepository;


    // Creates a payment record for a completed procurement.
    // The farmer does NOT create the payment himself.
    // The backend/operator side creates it after procurement is completed.
    @Transactional
    public PaymentResponse createPayment(
            PaymentCreateRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // One booking can have only one payment.
        // Prevent duplicate payment records for the same booking.
        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new RuntimeException(
                    "Payment already exists for this booking");
        }

        // Payment should only be created after the farmer's procurement
        // has actually been completed.
        if (booking.getStatus() != BookingStatus.PROCUREMENT_COMPLETED) {
            throw new RuntimeException(
                    "Payment can only be created after procurement is completed");
        }

        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setAmount(request.getAmount());

        // New payment starts as PENDING.
        // It becomes PAID only after the payment is actually processed.
        payment.setStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponse(savedPayment);
    }


    // Returns a payment using its ID.
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        return mapToResponse(payment);
    }


    // Returns the payment belonging to a particular booking.
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for this booking"));

        return mapToResponse(payment);
    }


    // Returns the logged-in farmer's payment for a booking.
    // We use JWT -> mobile -> User -> Farmer to identify the farmer.
    @Transactional(readOnly = true)
    public PaymentResponse getMyPayment(
            Long bookingId,
            String mobile) {

        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Farmer farmer = farmerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Farmer profile not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Security check:
        // A farmer must not be able to see another farmer's payment.
        if (!booking.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException(
                    "You are not allowed to view this payment");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for this booking"));

        return mapToResponse(payment);
    }


    // Updates payment status and transaction ID.
    // Example:
    // PENDING -> PAID
    // PENDING -> FAILED
    @Transactional
    public PaymentResponse updatePayment(
            Long paymentId,
            PaymentUpdateRequest request) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        payment.setStatus(request.getStatus());

        // Transaction ID is normally available when payment succeeds.
        if (request.getTransactionId() != null &&
                !request.getTransactionId().isBlank()) {

            payment.setTransactionId(
                    request.getTransactionId());
        }

        // Store the time when payment becomes PAID.
        if (request.getStatus() == PaymentStatus.PAID) {
            payment.setPaymentDate(
                    java.time.LocalDateTime.now());
        }

        Payment updatedPayment =
                paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }


    // Converts the database Entity into the DTO
    // that we send to the frontend.
    private PaymentResponse mapToResponse(
            Payment payment) {

        PaymentResponse response =
                new PaymentResponse();

        response.setId(payment.getId());

        response.setBookingId(
                payment.getBooking().getId());

        response.setAmount(
                payment.getAmount());

        response.setStatus(
                payment.getStatus());

        response.setPaymentDate(
                payment.getPaymentDate());

        response.setTransactionId(
                payment.getTransactionId());

        return response;
    }
}