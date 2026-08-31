package com.hackathon_group.smart_procurement_system_backend.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcurementCentreCreateRequest {

    @NotBlank(message = "Centre name is required")
    @Size(max = 150, message = "Centre name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Centre code is required")
    @Size(max = 50, message = "Centre code cannot exceed 50 characters")
    private String code;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Village is required")
    private String village;

    @NotBlank(message = "Block is required")
    private String block;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

//    @NotNull(message = "Latitude is required")
//    private Double latitude;
//
//    @NotNull(message = "Longitude is required")
//    private Double longitude;
}