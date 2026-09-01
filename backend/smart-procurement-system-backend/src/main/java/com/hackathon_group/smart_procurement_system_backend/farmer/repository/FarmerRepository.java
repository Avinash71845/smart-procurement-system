package com.hackathon_group.smart_procurement_system_backend.farmer.repository;

import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer,Long> {
   Optional<Farmer> findByUserId(Long userId);
}
