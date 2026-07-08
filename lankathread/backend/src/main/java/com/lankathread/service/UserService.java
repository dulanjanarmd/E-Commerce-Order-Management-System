package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.ForgotPasswordRequest;
import com.lankathread.dto.JwtResponse;
import com.lankathread.dto.LoginRequest;
import com.lankathread.dto.RegisterRequest;
import com.lankathread.dto.ResetPasswordRequest;
import com.lankathread.dto.UserProfileResponse;
import com.lankathread.model.User;
import com.lankathread.repository.UserRepository;
import com.lankathread.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CUSTOMER);

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return ApiResponse.success("Registration successful",
                new JwtResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                        user.getRole().name(), user.getProfileImage()));
    }

    public ApiResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtTokenProvider.generateToken(user.getEmail());
            return ApiResponse.success("Login successful",
                    new JwtResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                            user.getRole().name(), user.getProfileImage()));
        } catch (Exception e) {
            return ApiResponse.error("Invalid email or password");
        }
    }

    public ApiResponse getCurrentUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ApiResponse.success("User found", new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getProfileImage()));
    }

    public ApiResponse processGoogleLogin(String email, String fullName, String googleId, String profileImage) {
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setGoogleId(googleId);
                    newUser.setProfileImage(profileImage);
                    newUser.setRole(User.Role.CUSTOMER);
                    return userRepository.save(newUser);
                });

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return ApiResponse.success("Google login successful",
                new JwtResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                        user.getRole().name(), user.getProfileImage()));
    }

    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.success("If an account exists with this email, a password reset link has been sent.", null);
        }

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

        return ApiResponse.success("If an account exists with this email, a password reset link has been sent.", null);
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElse(null);

        if (user == null) {
            return ApiResponse.error("Invalid or expired reset token");
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ApiResponse.error("Reset token has expired. Please request a new password reset.");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ApiResponse.success("Password has been reset successfully. You can now login with your new password.", null);
    }
}
