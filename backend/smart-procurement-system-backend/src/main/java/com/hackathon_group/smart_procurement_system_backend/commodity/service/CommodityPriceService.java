package com.hackathon_group.smart_procurement_system_backend.commodity.service;

import com.hackathon_group.smart_procurement_system_backend.commodity.dto.CropPriceDto;
import com.hackathon_group.smart_procurement_system_backend.commodity.dto.IntakeBoardResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommodityPriceService {

    private final List<CropPriceDto> commodityCatalog = new ArrayList<>();

    public CommodityPriceService() {
        initCatalog();
    }

    private void initCatalog() {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        // 1. Major Yard Intake Commodities (Official Govt CCEA Approved MSP)
        commodityCatalog.add(new CropPriceDto(
                "wheat-grade-a", "Wheat (Grade A)", "गेहूं (A ग्रेड)", "Cereals", "Grade A",
                2585.0, 2640.0, 2550.0, 2700.0, "₹/Qtl",
                1420.0, 1306.4, 92, "+1.4%", "Target 92%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "paddy-common", "Paddy (Common)", "धान (सामान्य)", "Cereals", "Common",
                2441.0, 2490.0, 2400.0, 2550.0, "₹/Qtl",
                980.0, 823.2, 84, "+0.8%", "Target 84%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "paddy-grade-a", "Paddy (Grade A)", "धान (A ग्रेड)", "Cereals", "Grade A",
                2461.0, 2520.0, 2420.0, 2580.0, "₹/Qtl",
                600.0, 480.0, 80, "+1.1%", "Target 80%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "mustard-seeds", "Mustard Seeds", "सरसों", "Oilseeds", "Standard",
                6200.0, 6380.0, 6100.0, 6500.0, "₹/Qtl",
                650.0, 507.0, 78, "+2.1%", "Target 78%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "cotton-medium", "Cotton (Medium)", "कपास (मध्यम स्टेपल)", "Commercial", "Medium Staple",
                7122.0, 7300.0, 7000.0, 7450.0, "₹/Qtl",
                420.0, 273.0, 65, "-0.3%", "Target 65%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "cotton-long", "Cotton (Long Staple)", "कपास (लंबा स्टेपल)", "Commercial", "Long Staple",
                7521.0, 7750.0, 7400.0, 7900.0, "₹/Qtl",
                300.0, 210.0, 70, "+0.4%", "Target 70%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "gram-chana", "Gram (Chana)", "चना", "Pulses", "Desi / Standard",
                5875.0, 6050.0, 5800.0, 6200.0, "₹/Qtl",
                540.0, 475.2, 88, "+1.0%", "Target 88%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "soybean-yellow", "Soybean (Yellow)", "सोयाबीन (पीला)", "Oilseeds", "Yellow",
                5708.0, 5880.0, 5600.0, 6000.0, "₹/Qtl",
                310.0, 155.0, 50, "+0.5%", "Target 50%", now
        ));

        // 2. Additional Essential Kharif & Rabi Govt MSP Commodities
        commodityCatalog.add(new CropPriceDto(
                "maize-makka", "Maize (Makka)", "मक्का", "Cereals", "Hybrid",
                2410.0, 2480.0, 2350.0, 2550.0, "₹/Qtl",
                400.0, 288.0, 72, "+0.7%", "Target 72%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "bajra-millet", "Bajra (Pearl Millet)", "बाजरा", "Cereals", "Standard",
                2900.0, 2980.0, 2850.0, 3080.0, "₹/Qtl",
                250.0, 195.0, 78, "+1.2%", "Target 78%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "jowar-hybrid", "Jowar (Hybrid)", "ज्वार (हाइब्रिड)", "Cereals", "Hybrid",
                4023.0, 4120.0, 3980.0, 4220.0, "₹/Qtl",
                200.0, 140.0, 70, "-0.2%", "Target 70%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "jowar-maldandi", "Jowar (Maldandi)", "ज्वार (मालदांडी)", "Cereals", "Maldandi",
                4073.0, 4180.0, 4010.0, 4280.0, "₹/Qtl",
                150.0, 105.0, 70, "+0.5%", "Target 70%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "ragi-finger-millet", "Ragi (Finger Millet)", "रागी", "Cereals", "Standard",
                5205.0, 5350.0, 5100.0, 5480.0, "₹/Qtl",
                180.0, 126.0, 70, "+1.6%", "Target 70%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "barley-jau", "Barley (Jau)", "जौ", "Cereals", "Standard",
                2150.0, 2220.0, 2100.0, 2300.0, "₹/Qtl",
                220.0, 176.0, 80, "+0.9%", "Target 80%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "moong-green-gram", "Moong (Green Gram)", "मूंग", "Pulses", "Standard",
                8780.0, 9050.0, 8650.0, 9300.0, "₹/Qtl",
                190.0, 142.5, 75, "+2.4%", "Target 75%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "urad-black-gram", "Urad (Black Gram)", "उड़द", "Pulses", "Standard",
                8200.0, 8450.0, 8050.0, 8700.0, "₹/Qtl",
                210.0, 168.0, 80, "+1.8%", "Target 80%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "arhar-tur", "Arhar / Tur", "अरहर (तुअर)", "Pulses", "Standard",
                8450.0, 8720.0, 8300.0, 8950.0, "₹/Qtl",
                280.0, 238.0, 85, "+1.5%", "Target 85%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "masur-lentil", "Lentil (Masur)", "मसूर", "Pulses", "Standard",
                7000.0, 7240.0, 6900.0, 7450.0, "₹/Qtl",
                180.0, 144.0, 80, "+1.0%", "Target 80%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "groundnut-pods", "Groundnut (In Shell)", "मूंगफली", "Oilseeds", "Pods",
                7517.0, 7750.0, 7400.0, 7900.0, "₹/Qtl",
                350.0, 262.5, 75, "+0.6%", "Target 75%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "sunflower-seed", "Sunflower Seed", "सूरजमुखी बीज", "Oilseeds", "Standard",
                8343.0, 8550.0, 8200.0, 8750.0, "₹/Qtl",
                150.0, 97.5, 65, "-0.4%", "Target 65%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "sesamum-til", "Sesamum (Til)", "तिल", "Oilseeds", "White/Black",
                9267.0, 9550.0, 9100.0, 9800.0, "₹/Qtl",
                120.0, 90.0, 75, "+2.8%", "Target 75%", now
        ));

        commodityCatalog.add(new CropPriceDto(
                "safflower-kusum", "Safflower (Kusum)", "कुसुम", "Oilseeds", "Standard",
                6540.0, 6720.0, 6450.0, 6900.0, "₹/Qtl",
                100.0, 65.0, 65, "+0.3%", "Target 65%", now
        ));
    }

    public List<CropPriceDto> getAllCommodities() {
        return Collections.unmodifiableList(commodityCatalog);
    }

    public List<CropPriceDto> searchCommodities(String query, String category) {
        String cleanQuery = (query == null) ? "" : query.trim().toLowerCase();
        String cleanCategory = (category == null) ? "" : category.trim();

        return commodityCatalog.stream()
                .filter(crop -> {
                    boolean matchesCategory = cleanCategory.isEmpty() ||
                            cleanCategory.equalsIgnoreCase("All") ||
                            crop.getCategory().equalsIgnoreCase(cleanCategory);

                    if (!matchesCategory) return false;
                    if (cleanQuery.isEmpty()) return true;

                    return crop.getNameEn().toLowerCase().contains(cleanQuery) ||
                            crop.getNameHi().toLowerCase().contains(cleanQuery) ||
                            crop.getCategory().toLowerCase().contains(cleanQuery) ||
                            crop.getGrade().toLowerCase().contains(cleanQuery) ||
                            crop.getId().toLowerCase().contains(cleanQuery);
                })
                .collect(Collectors.toList());
    }

    public IntakeBoardResponse getLiveYardIntakeBoard() {
        // Filter the prime 6 yard intake commodities requested for the Yard Intake Board
        List<String> primeKeys = Arrays.asList(
                "wheat-grade-a", "paddy-common", "mustard-seeds",
                "cotton-medium", "gram-chana", "soybean-yellow"
        );

        List<CropPriceDto> primeCrops = commodityCatalog.stream()
                .filter(c -> primeKeys.contains(c.getId()))
                .collect(Collectors.toList());

        double totalTarget = primeCrops.stream().mapToDouble(CropPriceDto::getTargetTonnageQtl).sum();
        double totalIntake = primeCrops.stream().mapToDouble(CropPriceDto::getIntakeTonnageQtl).sum();
        int overallPct = (int) Math.round((totalIntake / totalTarget) * 100);

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm:ss a"));

        return new IntakeBoardResponse(
                totalTarget,
                Math.round(totalIntake * 10.0) / 10.0,
                overallPct,
                primeCrops.size(),
                now,
                primeCrops
        );
    }
}
