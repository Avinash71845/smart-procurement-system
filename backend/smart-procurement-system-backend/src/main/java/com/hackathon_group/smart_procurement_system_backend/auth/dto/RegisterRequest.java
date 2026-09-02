package com.hackathon_group.smart_procurement_system_backend.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String name;
    private String mobile;
    private String password;
    private String role;

}
