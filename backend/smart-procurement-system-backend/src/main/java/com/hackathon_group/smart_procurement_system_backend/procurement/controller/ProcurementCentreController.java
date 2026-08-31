package com.hackathon_group.smart_procurement_system_backend.procurement.controller;

import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreResponse;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.service.ProcurementCentreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement-centres")
public class ProcurementCentreController {

    private final ProcurementCentreService service;

    public ProcurementCentreController(
            ProcurementCentreService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ProcurementCentreResponse> createCentre(
            @Valid @RequestBody ProcurementCentreCreateRequest request) {

        ProcurementCentreResponse response =
                service.createCentre(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProcurementCentreResponse> getCentre(
            @PathVariable Long id) {

        ProcurementCentreResponse response =
                service.getCentre(id);

        return ResponseEntity.ok(response);
    }

    // GET ALL ACTIVE CENTRES
    @GetMapping
    public ResponseEntity<List<ProcurementCentreResponse>>
    getActiveCentres() {

        return ResponseEntity.ok(
                service.getActiveCentres()
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ProcurementCentreResponse> updateCentre(
            @PathVariable Long id,
            @Valid @RequestBody ProcurementCentreUpdateRequest request) {

        ProcurementCentreResponse response =
                service.updateCentre(id, request);

        return ResponseEntity.ok(response);
    }
}