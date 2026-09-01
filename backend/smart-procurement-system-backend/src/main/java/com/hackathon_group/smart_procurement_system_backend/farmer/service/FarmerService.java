package com.hackathon_group.smart_procurement_system_backend.farmer.service;

import com.hackathon_group.smart_procurement_system_backend.exception.ResourceNotFoundException;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerCreateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerResponse;
import com.hackathon_group.smart_procurement_system_backend.farmer.dto.FarmerUpdateRequest;
import com.hackathon_group.smart_procurement_system_backend.farmer.entity.Farmer;
import com.hackathon_group.smart_procurement_system_backend.farmer.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    //create
    public FarmerResponse createFarmer(FarmerCreateRequest request,Long userId){
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
    public FarmerResponse updateFarmer( Long id,
                                        FarmerUpdateRequest request){

       Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Farmer not found"));

        farmer.setName(request.getName());
        farmer.setVillage(request.getVillage());
        farmer.setBlock(request.getBlock());
        farmer.setDistrict(request.getDistrict());
        farmer.setState(request.getState());
        farmer.setPreferredLanguage(request.getPreferredLanguage());
//        farmer.setLatitude(request.getLatitude());
//        farmer.setLongitude(request.getLongitude());

        Farmer updatedFarmer = farmerRepository.save(farmer);

        return mapToResponse(updatedFarmer);

    }

    public FarmerResponse getFarmer(Long id){
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Farmer not found"));

        return mapToResponse(farmer);
    }


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
//                farmer.getLatitude(),
//                farmer.getLongitude()
        );
    }



}
