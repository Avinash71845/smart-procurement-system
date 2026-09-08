package com.hackathon_group.smart_procurement_system_backend.queue.controller;

import com.hackathon_group.smart_procurement_system_backend.queue.dto.CheckInRequest;
import com.hackathon_group.smart_procurement_system_backend.queue.dto.QueueTokenResponse;
import com.hackathon_group.smart_procurement_system_backend.queue.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping({"/api/queue", "/queue"})
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    // 1. Farmer/Gate Guard Check-in (Token Generate Karega)
    @PostMapping("/check-in")
    public ResponseEntity<QueueTokenResponse> checkIn(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(queueService.checkIn(request.getBookingId()));
    }


    // 2. Operator Screen: "Call Next" Button
    @PostMapping("/call-next")
    public ResponseEntity<QueueTokenResponse> callNext() {
        return ResponseEntity.ok(queueService.callNext());
    }

    // 3. Operator: Start processing the farmer
    @PostMapping("/start")
    public ResponseEntity<QueueTokenResponse> startProcessing(
            @RequestBody CheckInRequest request) {

        QueueTokenResponse response =
                queueService.startProcessing(
                        request.getBookingId());

        return ResponseEntity.ok(response);
    }

    // 3. Mandi TV Screen / Polling Endpoint (Har 3-5 sec me hit hoga)
    @GetMapping("/current")
    public ResponseEntity<QueueTokenResponse> getCurrentServing() {
        QueueTokenResponse current = queueService.getCurrentServing();
        if (current == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(current);
    }

    // 4. Operator Dashboard: Live Waiting List
    @GetMapping("/waiting")
    public ResponseEntity<List<QueueTokenResponse>> getWaitingQueue() {
        return ResponseEntity.ok(queueService.getWaitingQueue());
    }

    @GetMapping("/my/{bookingId}")
    public ResponseEntity<QueueTokenResponse> getMyQueue(
            @PathVariable Long bookingId,
            Principal principal) {
        QueueTokenResponse queue = queueService.getMyQueue(bookingId, principal.getName());
        if (queue == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(queue);
    }

// after completion
    @PostMapping("/complete")
    public ResponseEntity<QueueTokenResponse> completeProcurement(
            @RequestBody CheckInRequest request) {

        QueueTokenResponse response =
                queueService.completeProcurement(
                        request.getBookingId());

        return ResponseEntity.ok(response);
    }
}