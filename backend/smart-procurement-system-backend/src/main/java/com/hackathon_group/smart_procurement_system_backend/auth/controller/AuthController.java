package com.hackathon_group.smart_procurement_system_backend.auth.controller;

import com.hackathon_group.smart_procurement_system_backend.auth.dto.LoginRequest;
import com.hackathon_group.smart_procurement_system_backend.auth.dto.RegisterRequest;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.Role;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import com.hackathon_group.smart_procurement_system_backend.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setMobile(request.getMobile());
        user.setPassword(request.getPassword());
        user.setRole(Role.valueOf(request.getRole()));

        User savedUser = authService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request){

        String token = authService.loginUser(request.getMobile(), request.getPassword());

        return ResponseEntity.ok(token);

    }


}
