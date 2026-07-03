package com.lankathread.controller;

import com.lankathread.dto.ApiResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class UploadController {

    private final Path uploadDir = Paths.get("uploads").toAbsolutePath();

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String cloudApiKey;

    @Value("${cloudinary.api-secret:}")
    private String cloudApiSecret;

    public UploadController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No file provided"));
        }

        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx >= 0)
            ext = original.substring(idx);

        String filename = UUID.randomUUID().toString() + ext;
        Path target = uploadDir.resolve(filename);

        try {
            Files.copy(file.getInputStream(), target);
            String url = String.format("/uploads/%s", filename);
            return ResponseEntity.ok(ApiResponse.success("File uploaded", url));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to save file"));
        }
    }

    @PostMapping("/cloudinary")
    public ResponseEntity<ApiResponse> uploadToCloudinary(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("No file provided"));
        }

        if (cloudName == null || cloudName.isBlank() || cloudApiKey == null || cloudApiKey.isBlank()
                || cloudApiSecret == null || cloudApiSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.error("Cloudinary is not configured on the server"));
        }

        long timestamp = Instant.now().getEpochSecond();
        String toSign = "timestamp=" + timestamp;
        String signature;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest((toSign + cloudApiSecret).getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest)
                sb.append(String.format("%02x", b));
            signature = sb.toString();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to compute signature"));
        }

        String url = String.format("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName);

        RestTemplate rest = new RestTemplate();
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        try {
            ByteArrayResource bar = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    String original = StringUtils.cleanPath(file.getOriginalFilename());
                    return original == null || original.isBlank() ? UUID.randomUUID().toString() : original;
                }
            };
            body.add("file", bar);
            body.add("api_key", cloudApiKey);
            body.add("timestamp", String.valueOf(timestamp));
            body.add("signature", signature);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to read file"));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> resp = rest.postForEntity(url, requestEntity, String.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode node = mapper.readTree(resp.getBody());
                String secureUrl = node.has("secure_url") ? node.get("secure_url").asText() : null;
                if (secureUrl != null) {
                    return ResponseEntity.ok(ApiResponse.success("Uploaded to Cloudinary", secureUrl));
                }
            }
            return ResponseEntity.status(500).body(ApiResponse.error("Cloudinary upload failed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Cloudinary upload error"));
        }
    }
}
