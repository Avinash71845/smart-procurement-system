package com.hackathon_group.smart_procurement_system_backend.farmer.controller;

import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerResponse;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.service.FarmerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {
    @Autowired
    private FarmerService farmerService;

    //create the farmer profile
    @PostMapping
    public ResponseEntity<FarmerResponse> createFarmer(@Valid @RequestBody FarmerCreateRequest request){
        // Temporary until JWT/Spring Security is integrated
        Long temporaryUserId = 101L;

        FarmerResponse response = farmerService.createFarmer(request,temporaryUserId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    //get the farmer profile
    @GetMapping("/{id}")
    public ResponseEntity<FarmerResponse> getFarmer( @PathVariable Long id){
        FarmerResponse response =
                farmerService.getFarmer(id);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmerResponse> updateFarmer(@PathVariable Long id, @RequestBody FarmerUpdateRequest request){

        FarmerResponse response = farmerService.updateFarmer(id,request);
        return ResponseEntity.ok(response);
    }

}
