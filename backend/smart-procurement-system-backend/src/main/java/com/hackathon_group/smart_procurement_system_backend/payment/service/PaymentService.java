package com.hackathon_group.smart_procurement_system_backend.payment.service;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import com.hackathon_group.smart_procurement_system_backend.booking.entity.BookingStatus;
import com.hackathon_group.smart_procurement_system_backend.booking.repository.BookingRepository;
import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.BookedFarmerPaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentResponse;
import com.hackathon_group.smart_procurement_system_backend.payment.dto.PaymentUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.payment.entity.Payment;
import com.hackathon_group.smart_procurement_system_backend.payment.entity.PaymentStatus;
import com.hackathon_group.smart_procurement_system_backend.payment.repository.PaymentRepository;
import com.hackathon_group.smart_procurement_system_backend.procurement.entity.ProcurementCentre;
import com.hackathon_group.smart_procurement_system_backend.slot.entity.Slot;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

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


    // Creates or gives a payment record for a booked farmer.
    // Supports both PENDING and direct PAID disbursement.
    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + request.getBookingId()));

        // If payment already exists for this booking, update it instead of failing
        Optional<Payment> existingOpt = paymentRepository.findByBookingId(booking.getId());
        if (existingOpt.isPresent()) {
            Payment existing = existingOpt.get();
            if (request.getAmount() != null && request.getAmount() > 0) {
                existing.setAmount(request.getAmount());
            }
            if (request.getStatus() != null) {
                existing.setStatus(request.getStatus());
            }
            if (request.getTransactionId() != null && !request.getTransactionId().isBlank()) {
                existing.setTransactionId(request.getTransactionId().trim());
            }
            if (existing.getStatus() == PaymentStatus.PAID) {
                if (existing.getTransactionId() == null || existing.getTransactionId().isBlank()) {
                    existing.setTransactionId("DBT-APMC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                }
                if (existing.getPaymentDate() == null) {
                    existing.setPaymentDate(LocalDateTime.now());
                }
            }
            if (booking.getStatus() != BookingStatus.PROCUREMENT_COMPLETED) {
                booking.setStatus(BookingStatus.PROCUREMENT_COMPLETED);
                bookingRepository.save(booking);
            }
            Payment saved = paymentRepository.save(existing);
            return mapToResponse(saved);
        }

        // Seamlessly ensure booking is marked completed when payment is processed
        if (booking.getStatus() != BookingStatus.PROCUREMENT_COMPLETED) {
            booking.setStatus(BookingStatus.PROCUREMENT_COMPLETED);
            bookingRepository.save(booking);
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getAmount());

        PaymentStatus status = request.getStatus() != null ? request.getStatus() : PaymentStatus.PENDING;
        payment.setStatus(status);

        if (request.getTransactionId() != null && !request.getTransactionId().isBlank()) {
            payment.setTransactionId(request.getTransactionId().trim());
        } else if (status == PaymentStatus.PAID) {
            payment.setTransactionId("DBT-APMC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        if (status == PaymentStatus.PAID) {
            payment.setPaymentDate(LocalDateTime.now());
        }

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }


    // Returns a payment using its ID.
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));
        return mapToResponse(payment);
    }


    // Returns the payment belonging to a particular booking.
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking ID: " + bookingId));
        return mapToResponse(payment);
    }


    // Returns the logged-in farmer's payment for a booking.
    @Transactional(readOnly = true)
    public PaymentResponse getMyPayment(Long bookingId, String mobile) {
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farmer farmer = farmerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You are not allowed to view this payment");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for this booking"));

        return mapToResponse(payment);
    }


    // Farmer endpoint: Returns all bookings and associated payments for the logged-in farmer
    @Transactional(readOnly = true)
    public List<BookedFarmerPaymentResponse> getMyPayments(String mobile) {
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found with mobile: " + mobile));

        Farmer farmer = farmerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Farmer profile not found for user"));

        List<Booking> bookings = bookingRepository.findByFarmer_IdOrderByBookingDateDesc(farmer.getId());

        List<BookedFarmerPaymentResponse> list = new ArrayList<>();
        for (Booking booking : bookings) {
            list.add(mapToBookedFarmerResponse(booking));
        }
        return list;
    }


    // Operator endpoint: Returns all booked farmers with their slot and payment statuses
    @Transactional(readOnly = true)
    public List<BookedFarmerPaymentResponse> getBookedFarmers(Long centreId) {
        List<Booking> bookings;
        if (centreId != null && centreId > 0) {
            bookings = bookingRepository.findBySlot_ProcurementCentre_IdOrderByBookingDateDesc(centreId);
        } else {
            bookings = bookingRepository.findAllByOrderByBookingDateDesc();
        }

        List<BookedFarmerPaymentResponse> list = new ArrayList<>();
        for (Booking booking : bookings) {
            list.add(mapToBookedFarmerResponse(booking));
        }
        return list;
    }


    // Operator endpoint: Returns summary stats of booked farmers and payment disbursements
    @Transactional(readOnly = true)
    public Map<String, Object> getOperatorSummary() {
        List<Booking> allBookings = bookingRepository.findAll();
        List<Payment> allPayments = paymentRepository.findAll();

        long totalBookedFarmers = allBookings.size();
        long procurementCompletedCount = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PROCUREMENT_COMPLETED)
                .count();

        long totalPayments = allPayments.size();
        long paidCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PAID)
                .count();
        long pendingCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING)
                .count();
        long failedCount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                .count();

        double totalPaidAmount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PAID && p.getAmount() != null)
                .mapToDouble(Payment::getAmount)
                .sum();

        double totalPendingAmount = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING && p.getAmount() != null)
                .mapToDouble(Payment::getAmount)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBookedFarmers", totalBookedFarmers);
        summary.put("procurementCompletedCount", procurementCompletedCount);
        summary.put("totalPayments", totalPayments);
        summary.put("paidCount", paidCount);
        summary.put("pendingCount", pendingCount);
        summary.put("failedCount", failedCount);
        summary.put("totalPaidAmount", Math.round(totalPaidAmount * 100.0) / 100.0);
        summary.put("totalPendingAmount", Math.round(totalPendingAmount * 100.0) / 100.0);
        return summary;
    }


    // Updates payment status, transaction ID, and optionally amount
    @Transactional
    public PaymentResponse updatePayment(Long paymentId, PaymentUpdateRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        payment.setStatus(request.getStatus());

        if (request.getAmount() != null && request.getAmount() > 0) {
            payment.setAmount(request.getAmount());
        }

        if (request.getTransactionId() != null && !request.getTransactionId().isBlank()) {
            payment.setTransactionId(request.getTransactionId().trim());
        }

        if (request.getStatus() == PaymentStatus.PAID) {
            if (payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
                payment.setTransactionId("DBT-APMC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
            if (payment.getPaymentDate() == null) {
                payment.setPaymentDate(LocalDateTime.now());
            }
            if (payment.getBooking() != null && payment.getBooking().getStatus() != BookingStatus.PROCUREMENT_COMPLETED) {
                payment.getBooking().setStatus(BookingStatus.PROCUREMENT_COMPLETED);
                bookingRepository.save(payment.getBooking());
            }
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }


    // Converts Booking + Farmer + Centre + Payment into BookedFarmerPaymentResponse
    private BookedFarmerPaymentResponse mapToBookedFarmerResponse(Booking booking) {
        Farmer farmer = booking.getFarmer();
        Slot slot = booking.getSlot();
        ProcurementCentre centre = slot != null ? slot.getProcurementCentre() : null;

        Optional<Payment> paymentOpt = paymentRepository.findByBookingId(booking.getId());

        BookedFarmerPaymentResponse.BookedFarmerPaymentResponseBuilder builder =
                BookedFarmerPaymentResponse.builder()
                        .bookingId(booking.getId())
                        .tokenNumber(booking.getTokenNumber())
                        .bookingStatus(booking.getStatus())
                        .bookingDate(booking.getBookingDate())
                        .checkInTime(booking.getCheckInTime())
                        .grainWeight(booking.getGrainWeight())
                        .estimatedProcessingMinutes(booking.getEstimatedProcessingMinutes());

        if (farmer != null) {
            builder.farmerId(farmer.getId())
                    .farmerName(farmer.getName())
                    .farmerPhone(farmer.getPhone())
                    .farmerVillage(farmer.getVillage())
                    .farmerBlock(farmer.getBlock())
                    .farmerDistrict(farmer.getDistrict())
                    .farmerState(farmer.getState());
        }

        if (slot != null) {
            builder.slotId(slot.getId())
                    .slotDate(slot.getDate())
                    .slotStartTime(slot.getStartTime())
                    .slotEndTime(slot.getEndTime());
        }

        if (centre != null) {
            builder.centreId(centre.getId())
                    .centreName(centre.getName())
                    .centreCode(centre.getCode())
                    .centreAddress(centre.getAddress());
        }

        if (paymentOpt.isPresent()) {
            Payment p = paymentOpt.get();
            builder.paymentId(p.getId())
                    .amount(p.getAmount())
                    .paymentStatus(p.getStatus())
                    .paymentDate(p.getPaymentDate())
                    .transactionId(p.getTransactionId());
        }

        return builder.build();
    }


    // Converts the database Entity into the DTO that we send to the frontend.
    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setBookingId(payment.getBooking().getId());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus());
        response.setPaymentDate(payment.getPaymentDate());
        response.setTransactionId(payment.getTransactionId());
        return response;
    }
}