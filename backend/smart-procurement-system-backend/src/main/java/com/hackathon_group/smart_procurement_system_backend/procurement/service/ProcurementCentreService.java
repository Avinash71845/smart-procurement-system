package com.hackathon_group.smart_procurement_system_backend.procurement.service;

import com.hackathon_group.smart_procurement_system_backend.exception.ResourceNotFoundException;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.NearbyCentreResponse;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.OsrmResponse;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreResponse;
import com.hackathon_group.smart_procurement_system_backend.procurement.dto.ProcurementCentreUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.procurement.entity.ProcurementCentre;
import com.hackathon_group.smart_procurement_system_backend.procurement.repository.ProcurementCentreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ProcurementCentreService {

    @Autowired
    private ProcurementCentreRepository repository;

    @Autowired
    private RestTemplate restTemplate;


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
        centre.setLatitude(request.getLatitude());
        centre.setLongitude(request.getLongitude());

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
        centre.setLatitude(request.getLatitude());
        centre.setLongitude(request.getLongitude());

        if (request.getActive() != null) {
            centre.setActive(request.getActive());
        }

        ProcurementCentre updatedCentre =
                repository.save(centre);

        return mapToResponse(updatedCentre);
    }


    // GET NEARBY CENTRES
    public List<NearbyCentreResponse> getNearbyCentres(
            Double farmerLatitude,
            Double farmerLongitude) {

        List<ProcurementCentre> centres =
                repository.findByActiveTrue();

        List<NearbyCentreResponse> nearbyCentres =
                new ArrayList<>();

        for (ProcurementCentre centre : centres) {

            // Skip centres without coordinates
            if (centre.getLatitude() == null ||
                    centre.getLongitude() == null) {
                continue;
            }

            // Calculate actual road distance using OSRM
            Double distance = getRoadDistance(
                    farmerLatitude,
                    farmerLongitude,
                    centre.getLatitude(),
                    centre.getLongitude()
            );

            // Skip if OSRM could not calculate distance
            if (distance == null) {
                continue;
            }

            NearbyCentreResponse response =
                    new NearbyCentreResponse(
                            centre.getId(),
                            centre.getName(),
                            centre.getCode(),
                            centre.getAddress(),
                            centre.getVillage(),
                            centre.getBlock(),
                            centre.getDistrict(),
                            centre.getState(),
                            centre.getActive(),
                            centre.getLatitude(),
                            centre.getLongitude(),
                            Math.round(distance * 100.0) / 100.0
                    );

            nearbyCentres.add(response);
        }


        // Sort nearest centre first
        nearbyCentres.sort(
                Comparator.comparing(
                        NearbyCentreResponse::getDistanceKm
                )
        );

        return nearbyCentres;
    }


    // GET ROAD DISTANCE USING OSRM
    private Double getRoadDistance(
            Double farmerLatitude,
            Double farmerLongitude,
            Double centreLatitude,
            Double centreLongitude) {

        String url =
                "https://router.project-osrm.org/route/v1/driving/"
                        + farmerLongitude + "," + farmerLatitude
                        + ";"
                        + centreLongitude + "," + centreLatitude
                        + "?overview=false";

        try {

            OsrmResponse response =
                    restTemplate.getForObject(
                            url,
                            OsrmResponse.class
                    );

            if (response == null) {
                return null;
            }

            if (!"Ok".equals(response.getCode())) {
                return null;
            }

            if (response.getRoutes() == null ||
                    response.getRoutes().isEmpty()) {
                return null;
            }

            Double distanceMeters =
                    response.getRoutes()
                            .get(0)
                            .getDistance();

            if (distanceMeters == null) {
                return null;
            }

            // Convert meters to kilometers
            return distanceMeters / 1000.0;

        } catch (Exception e) {

            return null;
        }
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
        response.setLatitude(centre.getLatitude());
        response.setLongitude(centre.getLongitude());
        response.setActive(centre.getActive());

        return response;
    }
}