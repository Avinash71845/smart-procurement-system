package com.hackathon_group.smart_procurement_system_backend.procurement.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OsrmResponse {

    private String code;

    private List<Route> routes;

    @Getter
    @Setter
    public static class Route {

        private Double distance;

        private Double duration;
    }
}