package com.hackathon_group.smart_procurement_system_backend.procurement.service;

import com.hackathon_group.smart_procurement_system_backend.exception.ResourceNotFoundException;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreResponse;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.entity.ProcurementCentre;
import com.hackathon_group.smart_procurement_system_backend.procurement.repository.ProcurementCentreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProcurementCentreService {

    @Autowired
    private  ProcurementCentreRepository repository;



    // CREATE
    public ProcurementCentreResponse createCentre(
            ProcurementCentreCreateRequest request) {

        if (repository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException(
                    "Centre code already exists"
            );
        }

        ProcurementCentre centre = new ProcurementCentre();

        centre.setName(request.getName());
        centre.setCode(request.getCode());
        centre.setAddress(request.getAddress());
        centre.setVillage(request.getVillage());
        centre.setBlock(request.getBlock());
        centre.setDistrict(request.getDistrict());
        centre.setState(request.getState());
//        centre.setLatitude(request.getLatitude());
//        centre.setLongitude(request.getLongitude());

        ProcurementCentre savedCentre = repository.save(centre);

        return mapToResponse(savedCentre);
    }

    // GET BY ID
    public ProcurementCentreResponse getCentre(Long id) {

        ProcurementCentre centre = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Procurement centre not found"
                        ));

        return mapToResponse(centre);
    }

    // GET ALL ACTIVE CENTRES
    public List<ProcurementCentreResponse> getActiveCentres() {

        List<ProcurementCentre> centres =
                repository.findByActiveTrue();

        List<ProcurementCentreResponse> responses =
                new ArrayList<>();

        for (ProcurementCentre centre : centres) {
            responses.add(mapToResponse(centre));
        }

        return responses;
    }

    // UPDATE
    public ProcurementCentreResponse updateCentre(
            Long id,
            ProcurementCentreUpdateRequest request) {

        ProcurementCentre centre = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Procurement centre not found"
                        ));

        centre.setName(request.getName());
        centre.setAddress(request.getAddress());
        centre.setVillage(request.getVillage());
        centre.setBlock(request.getBlock());
        centre.setDistrict(request.getDistrict());
        centre.setState(request.getState());
//        centre.setLatitude(request.getLatitude());
//        centre.setLongitude(request.getLongitude());

        if (request.getActive() != null) {
            centre.setActive(request.getActive());
        }

        ProcurementCentre updatedCentre = repository.save(centre);

        return mapToResponse(updatedCentre);
    }

    // ENTITY → RESPONSE DTO
    private ProcurementCentreResponse mapToResponse(
            ProcurementCentre centre) {

        ProcurementCentreResponse response =
                new ProcurementCentreResponse();

        response.setId(centre.getId());
        response.setName(centre.getName());
        response.setCode(centre.getCode());
        response.setAddress(centre.getAddress());
        response.setVillage(centre.getVillage());
        response.setBlock(centre.getBlock());
        response.setDistrict(centre.getDistrict());
        response.setState(centre.getState());
//        response.setLatitude(centre.getLatitude());
//        response.setLongitude(centre.getLongitude());
        response.setActive(centre.getActive());

        return response;
    }
}