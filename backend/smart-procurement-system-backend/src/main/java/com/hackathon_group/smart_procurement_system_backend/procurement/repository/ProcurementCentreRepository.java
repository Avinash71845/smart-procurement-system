package com.hackathon_group.smart_procurement_system_backend.procurement.repository;

import com.hackathon_group.smart_procurement_system_backend.procurement.entity.ProcurementCentre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProcurementCentreRepository
        extends JpaRepository<ProcurementCentre, Long> {

    Optional<ProcurementCentre> findByCode(String code);

    List<ProcurementCentre> findByActiveTrue();
}