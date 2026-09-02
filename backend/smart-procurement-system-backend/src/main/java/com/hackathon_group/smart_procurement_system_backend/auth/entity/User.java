package com.hackathon_group.smart_procurement_system_backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String mobile;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
