package com.hackathon_group.smart_procurement_system_backend.booking.repository;

import com.hackathon_group.smart_procurement_system_backend.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByFarmer_Id(Long farmerId);

    List<Booking> findBySlot_Id(Long slotId);

    Optional<Booking> findByTokenNumber(String tokenNumber);
}