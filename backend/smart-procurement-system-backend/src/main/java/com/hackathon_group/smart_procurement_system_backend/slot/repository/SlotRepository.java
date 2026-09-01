package com.hackathon_group.smart_procurement_system_backend.slot.repository;

import com.hackathon_group.smart_procurement_system_backend.slot.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByProcurementCentreId(Long procurementCentreId);

    List<Slot> findByProcurementCentreIdAndDate(
            Long procurementCentreId,
            LocalDate date
    );
}