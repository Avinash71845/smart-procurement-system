package com.hackathon_group.smart_procurement_system_backend.chatbot.service;

import com.hackathon_group.smart_procurement_system_backend.chatbot.dto.ChatbotResponse;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChatbotService {

    private final Map<String, String> questionAnswerMap = new HashMap<>();

    public ChatbotService() {

        questionAnswerMap.put(
                "slot",
                "To book a slot, select your nearest procurement centre, choose an available date and time slot, select your grain type, enter the expected grain quantity, and confirm your booking."
        );

        questionAnswerMap.put(
                "grain",
                "SmartProcure currently supports four grain types: Wheat, Paddy, Mustard, and Gram."
        );

        questionAnswerMap.put(
                "wheat",
                "Wheat is one of the grain types supported by SmartProcure for procurement booking."
        );

        questionAnswerMap.put(
                "paddy",
                "Paddy is one of the grain types supported by SmartProcure for procurement booking."
        );

        questionAnswerMap.put(
                "mustard",
                "Mustard is one of the grain types supported by SmartProcure for procurement booking."
        );

        questionAnswerMap.put(
                "gram",
                "Gram is one of the grain types supported by SmartProcure for procurement booking."
        );

        questionAnswerMap.put(
                "queue",
                "After reaching the procurement centre, you can check in using your booking. A queue token is generated and you can track your position through the queue system."
        );

        questionAnswerMap.put(
                "token",
                "Your queue token is generated when you check in at the procurement centre. The token helps you track your turn in the queue."
        );

        questionAnswerMap.put(
                "payment",
                "After your procurement is completed, your payment status can be tracked through the SmartProcure payment tracking system."
        );

        questionAnswerMap.put(
                "cancel",
                "You can cancel your booking while its status is BOOKED. After cancellation, the slot capacity becomes available again."
        );

        questionAnswerMap.put(
                "centre",
                "SmartProcure can recommend a nearby procurement centre based on your location. You can then select a centre while booking your slot."
        );

        questionAnswerMap.put(
                "procurement",
                "The procurement process includes check-in, queue management, document verification, weighing and quality checking, procurement completion, and payment tracking."
        );

        questionAnswerMap.put(
                "smartprocure",
                "SmartProcure is a digital procurement platform designed to reduce farmer waiting time by providing slot booking, queue management, procurement tracking, payment tracking, notifications, nearby centre recommendation, and a farmer assistance chatbot."
        );

        questionAnswerMap.put(
                "document",
                "Please carry the documents required by your procurement centre for farmer and procurement verification."
        );

        questionAnswerMap.put(
                "hello",
                "Hello! I am the SmartProcure Assistant. I can help you with slot booking, grain types, queue, procurement, payment, and procurement centre information."
        );

        questionAnswerMap.put(
                "hi",
                "Hello! I am the SmartProcure Assistant. How can I help you?"
        );
    }

    public ChatbotResponse getAnswer(String question) {

        if (question == null || question.trim().isEmpty()) {

            return new ChatbotResponse(
                    "Please enter a question."
            );
        }

        String userQuestion =
                question.toLowerCase().trim();

        for (Map.Entry<String, String> entry :
                questionAnswerMap.entrySet()) {

            if (userQuestion.contains(entry.getKey())) {

                return new ChatbotResponse(
                        entry.getValue()
                );
            }
        }

        return new ChatbotResponse(
                "Sorry, I don't have an answer for that question. Please ask about slot booking, grain types, queue, procurement, payment, or procurement centres."
        );
    }
}