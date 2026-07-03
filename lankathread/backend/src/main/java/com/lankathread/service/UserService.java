package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.JwtResponse;
import com.lankathread.dto.LoginRequest;
import com.lankathread.dto.RegisterRequest;
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
}
