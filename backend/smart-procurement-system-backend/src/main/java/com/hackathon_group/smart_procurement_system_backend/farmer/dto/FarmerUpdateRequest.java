package com.hackathon_group.smart_procurement_system_backend.farmer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmerUpdateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String adhaar;

    @NotBlank
    private String village;

    @NotBlank
    private String block;

    @NotBlank
    private String district;

    @NotBlank
    private String state;

    private String preferredLanguage;

//    private Double latitude;
//
//    private Double longitude;
}
