package com.hackathon_group.smart_procurement_system_backend.farmer.service;

import com.hackathon_group.smart_procurement_system_backend.exception.ResourceNotFoundException;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerResponse;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import com.hackathon_group.smart_procurement_system_backend.auth.entity.User;
import com.hackathon_group.smart_procurement_system_backend.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private UserRepository userRepository;


    // create
    public FarmerResponse createFarmer(
            FarmerCreateRequest request,
            String mobile) {

        // Find logged-in user using mobile from JWT
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Optional<Farmer> existingFarmer =
                farmerRepository.findByUserId(user.getId());

        if (existingFarmer.isPresent()) {
            throw new IllegalArgumentException("Farmer profile already exists");
        }

        // Get actual user ID
        Long userId = user.getId();

        Farmer farmer = new Farmer();

        farmer.setUserId(userId);
        farmer.setName(request.getName());
        farmer.setAdhaar(request.getAdhaar());
        farmer.setPhone(request.getPhone());
        farmer.setVillage(request.getVillage());
        farmer.setBlock(request.getBlock());
        farmer.setDistrict(request.getDistrict());
        farmer.setState(request.getState());
        farmer.setPreferredLanguage(request.getPreferredLanguage());

        Farmer savedFarmer = farmerRepository.save(farmer);

        return mapToResponse(savedFarmer);
    }


    // update
    public FarmerResponse updateFarmer(
            Long id,
            FarmerUpdateRequest request) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Farmer not found"));

        farmer.setName(request.getName());
        farmer.setVillage(request.getVillage());
        farmer.setBlock(request.getBlock());
        farmer.setDistrict(request.getDistrict());
        farmer.setState(request.getState());
        farmer.setPreferredLanguage(request.getPreferredLanguage());

        Farmer updatedFarmer = farmerRepository.save(farmer);

        return mapToResponse(updatedFarmer);
    }


    // get
    public FarmerResponse getFarmer(Long id) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Farmer not found"));

        return mapToResponse(farmer);
    }


    // map entity to response
    public FarmerResponse mapToResponse(Farmer farmer) {

        return new FarmerResponse(
                farmer.getId(),
                farmer.getName(),
                farmer.getPhone(),
                farmer.getAdhaar(),
                farmer.getVillage(),
                farmer.getBlock(),
                farmer.getDistrict(),
                farmer.getState(),
                farmer.getPreferredLanguage()
        );
    }
}