package com.hackathon_group.smart_procurement_system_backend.slot.controller;

import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotResponse;
import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.slot.service.SlotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotService slotService;


    @PostMapping
    public ResponseEntity<SlotResponse> createSlot(
            @Valid @RequestBody SlotCreateRequest request
    ) {

        SlotResponse response = slotService.createSlot(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SlotResponse> getSlotById(
            @PathVariable Long id
    ) {

        SlotResponse response = slotService.getSlotById(id);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/centre/{centreId}")
    public ResponseEntity<List<SlotResponse>> getSlotsByCentre(
            @PathVariable Long centreId
    ) {

        List<SlotResponse> responses =
                slotService.getSlotsByCentre(centreId);

        return ResponseEntity.ok(responses);
    }


    @GetMapping("/centre/{centreId}/date")
    public ResponseEntity<List<SlotResponse>> getSlotsByCentreAndDate(
            @PathVariable Long centreId,
            @RequestParam LocalDate date
    ) {

        List<SlotResponse> responses =
                slotService.getSlotsByCentreAndDate(
                        centreId,
                        date
                );

        return ResponseEntity.ok(responses);
    }


    @PutMapping("/{id}")
    public ResponseEntity<SlotResponse> updateSlot(
            @PathVariable Long id,
            @Valid @RequestBody SlotUpdateRequest request
    ) {

        SlotResponse response =
                slotService.updateSlot(id, request);

        return ResponseEntity.ok(response);
    }
}