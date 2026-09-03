package com.hackathon_group.smart_procurement_system_backend.security;

import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        // 1. Database se mobile number dhoondte hain
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with mobile: " + mobile));

        // 2. Apne database wale User ko Spring Security ke UserDetails me convert karke return karte hain
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getMobile())
                .password(user.getPassword())
                .roles(user.getRole().name()) // FARMER ban jayega ROLE_FARMER
                .build();
    }
}
