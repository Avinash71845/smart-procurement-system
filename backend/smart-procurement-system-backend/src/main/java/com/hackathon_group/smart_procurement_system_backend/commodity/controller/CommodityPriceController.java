package com.hackathon_group.smart_procurement_system_backend.commodity.controller;

import com.hackathon_group.smart_procurement_system_backend.commodity.dto.CropPriceDto;
import com.hackathon_group.smart_procurement_system_backend.commodity.dto.IntakeBoardResponse;
import com.hackathon_group.smart_procurement_system_backend.commodity.service.CommodityPriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/commodities", "/api/crops"})
@CrossOrigin(origins = "*")
public class CommodityPriceController {

    private final CommodityPriceService commodityPriceService;

    public CommodityPriceController(CommodityPriceService commodityPriceService) {
        this.commodityPriceService = commodityPriceService;
    }

    /**
     * Get all commodity MSP and market prices
     */
    @GetMapping("/prices")
    public ResponseEntity<List<CropPriceDto>> getAllPrices() {
        return ResponseEntity.ok(commodityPriceService.getAllCommodities());
    }

    /**
     * Real-time search crops by English name, Hindi name, or category
     * e.g. /api/commodities/prices/search?q=wheat or /api/commodities/prices/search?q=चना&category=Pulses
     */
    @GetMapping("/prices/search")
    public ResponseEntity<List<CropPriceDto>> searchPrices(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "category", required = false) String category) {
        return ResponseEntity.ok(commodityPriceService.searchCommodities(query, category));
    }

    /**
     * Get the Live Yard Intake Board with target vs delivered tonnage & capacity
     */
    @GetMapping("/intake-board")
    public ResponseEntity<IntakeBoardResponse> getLiveYardIntakeBoard() {
        return ResponseEntity.ok(commodityPriceService.getLiveYardIntakeBoard());
    }
}
