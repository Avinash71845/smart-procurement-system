package com.hackathon_group.smart_procurement_system_backend.booking.controller;

import com.hackathon_group.smart_procurement_system_backend.booking.dto.BookingCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.booking.dto.BookingResponse;
import com.hackathon_group.smart_procurement_system_backend.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;


    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            Authentication authentication) {

        String mobile = authentication.getName();

        BookingResponse response =
                bookingService.createBooking(request, mobile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable Long id) {

        BookingResponse response =
                bookingService.getBooking(id);

        return ResponseEntity.ok(response);
    }

    // Get all bookings of logged-in farmer
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication) {

        String mobile = authentication.getName();

        List<BookingResponse> response =
                bookingService.getMyBookings(mobile);

        return ResponseEntity.ok(response);
    }

    // Get booking by token
    @GetMapping("/token/{tokenNumber}")
    public ResponseEntity<BookingResponse> getBookingByToken(
            @PathVariable String tokenNumber) {

        BookingResponse response =
                bookingService.getBookingByToken(tokenNumber);

        return ResponseEntity.ok(response);
    }
}