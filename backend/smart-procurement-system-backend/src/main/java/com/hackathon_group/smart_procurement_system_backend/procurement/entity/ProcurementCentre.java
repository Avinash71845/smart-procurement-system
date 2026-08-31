package com.hackathon_group.smart_procurement_system_backend.procurement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "procurement_centres")
@Getter
@Setter
public class ProcurementCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String address;

    private String village;

    private String block;

    private String district;

    private String state;

//    private Double latitude;
//
//    private Double longitude;

    @Column(nullable = false)
    private Boolean active = true;
}