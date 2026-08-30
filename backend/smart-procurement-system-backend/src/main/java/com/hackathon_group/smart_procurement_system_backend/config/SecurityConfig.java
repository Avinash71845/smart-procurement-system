package com.hackathon_group.smart_procurement_system_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Disable CSRF for REST API development
                .csrf(csrf -> csrf.disable())

                // Temporary: allow Farmer APIs without authentication
                // This will be replaced with JWT-based authentication later
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/farmers/**").permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}