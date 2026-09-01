package com.hackathon_group.smart_procurement_system_backend.farmer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FarmerResponse {
    private Long id;
    private String name;
    private String phone;
    private String adhaar;
    private String village;
    private String block;
    private String district;
    private String state;
    private String preferredLanguage;
//    private Double latitude;
//    private Double longitude;
}
