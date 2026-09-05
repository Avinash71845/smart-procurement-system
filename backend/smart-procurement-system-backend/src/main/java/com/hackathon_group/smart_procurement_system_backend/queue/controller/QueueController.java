package com.hackathon_group.smart_procurement_system_backend.queue.controller;

import com.hackathon_group.smart_procurement_system_backend.queue.dto.CheckInRequest;
import com.hackathon_group.smart_procurement_system_backend.queue.dto.QueueTokenResponse;
import com.hackathon_group.smart_procurement_system_backend.queue.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/queue")
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
}