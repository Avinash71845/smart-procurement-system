package com.hackathon_group.smart_procurement_system_backend.farmer.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

    @Getter
    @Setter
    public class FarmerCreateRequest {

        @NotBlank (message = "name is required")
        private String name;

        @NotBlank(message = "phone number is required")
        @Pattern(regexp = "^[0-9]{10}$",
        message = "phone number must contain exactly 10 digits")
        private String phone;

        @NotBlank(message = "Aadhaar number is required")
        @Pattern(
                regexp = "^[0-9]{12}$",
                message = "Aadhaar number must contain exactly 12 digits"
        )
        private String adhaar;

        @NotBlank(message = "village is required")
        private String village;

        @NotBlank(message = "block is required")
        private String block;

        @NotBlank(message = "district is required")
        private String district;

        @NotBlank(message = "state is required")
        private String state;

        private String preferredLanguage;

//        private Double latitude;
//
//        private Double longitude;
}
