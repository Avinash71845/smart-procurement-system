package com.hackathon_group.smart_procurement_system_backend.procurement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcurementCentreResponse {

    private Long id;

    private String name;

    private String code;

    private String address;

    private String village;

    private String block;

    private String district;

    private String state;

//    private Double latitude;
//
//    private Double longitude;

    private Boolean active;
}