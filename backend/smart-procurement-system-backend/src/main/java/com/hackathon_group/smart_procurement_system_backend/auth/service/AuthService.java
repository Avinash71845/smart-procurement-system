package com.hackathon_group.smart_procurement_system_backend.auth.service;

import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import com.hackathon_group.smart_procurement_system_backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;


    private BCryptPasswordEncoder
            bCryptPasswordEncoder = new BCryptPasswordEncoder();



    public User registerUser(User user){
        String pass = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(pass);

        return userRepository.save(user);
    }


    public String loginUser(String mobile, String rawPassword){
        User user = userRepository.findByMobile(mobile).orElseThrow(() -> new RuntimeException("User not found"));
        boolean matches = bCryptPasswordEncoder.matches(rawPassword,user.getPassword());

        if(!matches){
            throw  new RuntimeException("Invalid Password");
        }

        return jwtService.generateToken(user.getMobile());
    }



}
