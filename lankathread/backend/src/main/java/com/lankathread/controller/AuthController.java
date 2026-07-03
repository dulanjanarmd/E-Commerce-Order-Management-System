package com.lankathread.controller;

import com.lankathread.dto.*;
import com.lankathread.security.JwtTokenProvider;
import com.lankathread.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import lombok.Data;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        String token = resolveBearerToken(authorizationHeader);
        if (!StringUtils.hasText(token) || !jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or missing token"));
        }
        String email = jwtTokenProvider.getEmailFromToken(token);
        return ResponseEntity.ok(userService.getCurrentUserByEmail(email));
    }

    private String resolveBearerToken(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader)) {
            return null;
        }
        if (authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return authorizationHeader;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(userService.processGoogleLogin(
                request.getEmail(), request.getFullName(), request.getGoogleId(), request.getProfileImage()));
    }

    @Data
    public static class GoogleLoginRequest {
        private String email;
        private String fullName;
        private String googleId;
        private String profileImage;
    }
}
