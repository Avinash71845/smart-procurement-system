package com.hackathon_group.smart_procurement_system_backend.commodity.dto;

import java.util.List;

public class IntakeBoardResponse {
    private Double totalTargetTonnageQtl;
    private Double totalIntakeTonnageQtl;
    private Integer overallTargetPercentage;
    private Integer activeBaysCount;
    private String lastUpdated;
    private List<CropPriceDto> crops;

    public IntakeBoardResponse() {}

    public IntakeBoardResponse(Double totalTargetTonnageQtl, Double totalIntakeTonnageQtl,
                               Integer overallTargetPercentage, Integer activeBaysCount,
                               String lastUpdated, List<CropPriceDto> crops) {
        this.totalTargetTonnageQtl = totalTargetTonnageQtl;
        this.totalIntakeTonnageQtl = totalIntakeTonnageQtl;
        this.overallTargetPercentage = overallTargetPercentage;
        this.activeBaysCount = activeBaysCount;
        this.lastUpdated = lastUpdated;
        this.crops = crops;
    }

    public Double getTotalTargetTonnageQtl() { return totalTargetTonnageQtl; }
    public void setTotalTargetTonnageQtl(Double totalTargetTonnageQtl) { this.totalTargetTonnageQtl = totalTargetTonnageQtl; }

    public Double getTotalIntakeTonnageQtl() { return totalIntakeTonnageQtl; }
    public void setTotalIntakeTonnageQtl(Double totalIntakeTonnageQtl) { this.totalIntakeTonnageQtl = totalIntakeTonnageQtl; }

    public Integer getOverallTargetPercentage() { return overallTargetPercentage; }
    public void setOverallTargetPercentage(Integer overallTargetPercentage) { this.overallTargetPercentage = overallTargetPercentage; }

    public Integer getActiveBaysCount() { return activeBaysCount; }
    public void setActiveBaysCount(Integer activeBaysCount) { this.activeBaysCount = activeBaysCount; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public List<CropPriceDto> getCrops() { return crops; }
    public void setCrops(List<CropPriceDto> crops) { this.crops = crops; }
}
