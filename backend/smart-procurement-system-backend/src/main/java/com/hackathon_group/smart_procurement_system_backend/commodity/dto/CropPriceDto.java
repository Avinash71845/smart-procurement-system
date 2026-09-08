package com.hackathon_group.smart_procurement_system_backend.commodity.dto;

public class CropPriceDto {
    private String id;
    private String nameEn;
    private String nameHi;
    private String category; // Cereals, Pulses, Oilseeds, Commercial
    private String grade;
    private Double mspRate; // Govt MSP Rate (₹/Qtl)
    private Double marketPrice; // Current Mandi Modal Price (₹/Qtl)
    private Double minPrice; // Today's Mandi Low
    private Double maxPrice; // Today's Mandi High
    private String unit; // ₹/Qtl
    private Double targetTonnageQtl; // Season/Daily Intake Target
    private Double intakeTonnageQtl; // Actual Intake Tonnage
    private Integer targetPercentage; // % of target achieved
    private String trend; // e.g. "+1.4%" or "-0.8%"
    private String status; // "Target 92%", "Active Intake"
    private String lastUpdated;

    public CropPriceDto() {}

    public CropPriceDto(String id, String nameEn, String nameHi, String category, String grade,
                        Double mspRate, Double marketPrice, Double minPrice, Double maxPrice,
                        String unit, Double targetTonnageQtl, Double intakeTonnageQtl,
                        Integer targetPercentage, String trend, String status, String lastUpdated) {
        this.id = id;
        this.nameEn = nameEn;
        this.nameHi = nameHi;
        this.category = category;
        this.grade = grade;
        this.mspRate = mspRate;
        this.marketPrice = marketPrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.unit = unit;
        this.targetTonnageQtl = targetTonnageQtl;
        this.intakeTonnageQtl = intakeTonnageQtl;
        this.targetPercentage = targetPercentage;
        this.trend = trend;
        this.status = status;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }

    public String getNameHi() { return nameHi; }
    public void setNameHi(String nameHi) { this.nameHi = nameHi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Double getMspRate() { return mspRate; }
    public void setMspRate(Double mspRate) { this.mspRate = mspRate; }

    public Double getMarketPrice() { return marketPrice; }
    public void setMarketPrice(Double marketPrice) { this.marketPrice = marketPrice; }

    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }

    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getTargetTonnageQtl() { return targetTonnageQtl; }
    public void setTargetTonnageQtl(Double targetTonnageQtl) { this.targetTonnageQtl = targetTonnageQtl; }

    public Double getIntakeTonnageQtl() { return intakeTonnageQtl; }
    public void setIntakeTonnageQtl(Double intakeTonnageQtl) { this.intakeTonnageQtl = intakeTonnageQtl; }

    public Integer getTargetPercentage() { return targetPercentage; }
    public void setTargetPercentage(Integer targetPercentage) { this.targetPercentage = targetPercentage; }

    public String getTrend() { return trend; }
    public void setTrend(String trend) { this.trend = trend; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
}
