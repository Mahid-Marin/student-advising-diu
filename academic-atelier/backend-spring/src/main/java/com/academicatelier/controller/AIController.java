package com.academicatelier.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.academicatelier.service.GroqService;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller for AI-powered Knowledge Base explanations
 * Handles requests to explain academic content using AI
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private GroqService groqService;

    /**
     * Generate explanation for knowledge base content using AI
     * @param request - Request body containing content and prompt
     * @return - AI-generated explanation
     */
    @PostMapping("/explain")
    public ResponseEntity<?> explainContent(@RequestBody ExplainRequest request) {
        try {
            // Call Groq Service to generate explanation
            String explanation = groqService.generateExplanation(request.getPrompt());
            
            Map<String, String> response = new HashMap<>();
            response.put("explanation", explanation);
            response.put("success", "true");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("success", "false");
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Health check for AI service availability
     * @return - Service status
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        try {
            // Simple health check
            Map<String, String> response = new HashMap<>();
            response.put("status", "available");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(
                Map.of("status", "unavailable", "error", e.getMessage())
            );
        }
    }

    /**
     * Request DTO for explain endpoint
     */
    public static class ExplainRequest {
        private String content;
        private String title;
        private String prompt;
        private String question;

        // Getters and Setters
        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }
    }
}
