//package com.hackathon_group.smart_procurement_system_backend.chatbot.controller;
//
//import com.hackathon_group.smart_procurement_system_backend.chatbot.dto.ChatbotRequest;
//import com.hackathon_group.smart_procurement_system_backend.chatbot.dto.ChatbotResponse;
//import com.hackathon_group.smart_procurement_system_backend.chatbot.service.ChatbotService;
//
//import jakarta.validation.Valid;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/chatbot")
//public class ChatbotController {
//
//    @Autowired
//    private ChatbotService chatbotService;
//
//    @PostMapping("/ask")
//    public ResponseEntity<ChatbotResponse> askQuestion(
//            @RequestBody ChatbotRequest request) {
//
//        ChatbotResponse response =
//                chatbotService.getAnswer(
//                        request.getQuestion()
//                );
//
//        return ResponseEntity.ok(response);
//    }
//}