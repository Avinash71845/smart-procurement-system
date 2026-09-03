package com.hackathon_group.smart_procurement_system_backend.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test-protected")
    public String testProtected() {
        return "Agar ye dikh raha hai, matlab tu authenticated hai!";
    }
}