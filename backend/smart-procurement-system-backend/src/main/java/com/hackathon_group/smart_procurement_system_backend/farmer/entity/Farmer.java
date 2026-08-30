package com.hackathon_group.smart_procurement_system_backend.farmer.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "farmers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Authentication reference
    private Long userId;

    // Personal information
    private String name;
    private String phone;
    private String adhaar;

    // Address
    private String village;
    private String block;
    private String district;
    private String state;

    // Preferences
    private String preferredLanguage;

    // Location
//    private Double latitude;
//    private Double longitude;
}