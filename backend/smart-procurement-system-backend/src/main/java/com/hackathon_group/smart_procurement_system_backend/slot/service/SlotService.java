package com.hackathon_group.smart_procurement_system_backend.slot.service;

import com.hackathon_group.smart_procurement_system_backend.procurement.entity.ProcurementCentre;
import com.hackathon_group.smart_procurement_system_backend.procurement.repository.ProcurementCentreRepository;
import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotResponse;
import com.hackathon_group.smart_procurement_system_backend.slot.dto.SlotUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.slot.entity.Slot;
import com.hackathon_group.smart_procurement_system_backend.slot.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private ProcurementCentreRepository procurementCentreRepository;


    public SlotResponse createSlot(SlotCreateRequest request) {

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException(
                    "Start time must be before end time"
            );
        }

        ProcurementCentre centre = procurementCentreRepository
                .findById(request.getProcurementCentreId())
                .orElseThrow(() ->
                        new RuntimeException("Procurement centre not found")
                );

        if (!centre.getActive()) {
            throw new IllegalArgumentException(
                    "Cannot create slot for inactive procurement centre"
            );
        }

        Slot slot = new Slot();

        slot.setProcurementCentre(centre);
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacityKg(request.getCapacityKg());

        Slot savedSlot = slotRepository.save(slot);

        return mapToResponse(savedSlot);
    }


    public SlotResponse getSlotById(Long id) {

        Slot slot = slotRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Slot not found")
                );

        return mapToResponse(slot);
    }


    public List<SlotResponse> getSlotsByCentre(Long centreId) {

        List<Slot> slots =
                slotRepository.findByProcurementCentreId(centreId);

        List<SlotResponse> responses = new ArrayList<>();

        for (Slot slot : slots) {
            responses.add(mapToResponse(slot));
        }

        return responses;
    }


    public List<SlotResponse> getSlotsByCentreAndDate(
            Long centreId,
            LocalDate date
    ) {

        List<Slot> slots =
                slotRepository.findByProcurementCentreIdAndDate(
                        centreId,
                        date
                );

        List<SlotResponse> responses = new ArrayList<>();

        for (Slot slot : slots) {
            responses.add(mapToResponse(slot));
        }

        return responses;
    }


    public SlotResponse updateSlot(
            Long id,
            SlotUpdateRequest request
    ) {

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException(
                    "Start time must be before end time"
            );
        }

        Slot slot = slotRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Slot not found")
                );

        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacityKg(request.getCapacityKg());
        slot.setStatus(request.getStatus());

        Slot updatedSlot = slotRepository.save(slot);

        return mapToResponse(updatedSlot);
    }


    private SlotResponse mapToResponse(Slot slot) {

        SlotResponse response = new SlotResponse();

        response.setId(slot.getId());
        response.setProcurementCentreId(
                slot.getProcurementCentre().getId()
        );
        response.setDate(slot.getDate());
        response.setStartTime(slot.getStartTime());
        response.setEndTime(slot.getEndTime());
        response.setStatus(slot.getStatus());

        return response;
    }
}