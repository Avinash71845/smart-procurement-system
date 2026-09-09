package com.hackathon_group.smart_procurement_system_backend.procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyCentreResponse {

    private Long id;
    private String name;
    private String code;
    private String address;
    private String village;
    private String block;
    private String district;
    private String state;
    private Boolean active;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
}