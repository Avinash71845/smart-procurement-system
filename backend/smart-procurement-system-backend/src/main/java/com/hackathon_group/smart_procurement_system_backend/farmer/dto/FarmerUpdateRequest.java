package com.hackathon_group.smart_procurement_system_backend.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerUpdateRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank (message = "aadhaar is required")
    private String adhaar;

    @NotBlank(message = "Village is required")
    private String village;

    @NotBlank(message = "block is required")
    private String block;

    @NotBlank(message = "district is required")
    private String district;

    @NotBlank(message = "state is required")
    private String state;

    private String preferredLanguage;

//    private Double latitude;
//
//    private Double longitude;
}
