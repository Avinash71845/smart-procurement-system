package com.hackathon_group.smart_procurement_system_backend.auth.repository;

import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByMobile(String mobile);
}
