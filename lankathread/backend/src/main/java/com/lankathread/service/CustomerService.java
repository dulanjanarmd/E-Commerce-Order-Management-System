package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.model.Order;
import com.lankathread.model.User;
import com.lankathread.repository.OrderRepository;
import com.lankathread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all customers with optional search and status filter
     */
    public ApiResponse getAllCustomers(String keyword, Boolean isActive) {
        List<User> customers;

        if (keyword != null && !keyword.trim().isEmpty() && isActive != null) {
            customers = userRepository.searchCustomersWithStatus(
                    keyword.trim(), User.Role.CUSTOMER, isActive);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            customers = userRepository.searchCustomers(keyword.trim(), User.Role.CUSTOMER);
        } else if (isActive != null) {
            customers = userRepository.findByRoleAndIsActive(User.Role.CUSTOMER, isActive);
        } else {
            customers = userRepository.findByRole(User.Role.CUSTOMER);
        }

        List<Map<String, Object>> customerList = customers.stream()
                .map(this::buildCustomerSummary)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("customers", customerList);
        response.put("total", customerList.size());

        return ApiResponse.success("Customers retrieved successfully", response);
    }

    /**
     * Get customer detail by ID including order history
     */
    public ApiResponse getCustomerDetail(Long customerId) {
        Optional<User> optUser = userRepository.findById(customerId);
        if (optUser.isEmpty()) {
            return ApiResponse.error("Customer not found");
        }

        User customer = optUser.get();
        if (customer.getRole() != User.Role.CUSTOMER) {
            return ApiResponse.error("User is not a customer");
        }

        Map<String, Object> detail = buildCustomerSummary(customer);

        // Get order history
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(customerId);
        List<Map<String, Object>> orderHistory = orders.stream().map(order -> {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("orderNumber", order.getOrderNumber());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("finalAmount", order.getFinalAmount());
            orderMap.put("status", order.getStatus().name());
            orderMap.put("paymentStatus", order.getPaymentStatus().name());
            orderMap.put("paymentMethod", order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null);
            orderMap.put("itemCount", order.getOrderItems() != null ? order.getOrderItems().size() : 0);
            orderMap.put("createdAt", order.getCreatedAt());
            return orderMap;
        }).collect(Collectors.toList());

        detail.put("orders", orderHistory);
        detail.put("totalOrders", orders.size());
        detail.put("totalSpent", orders.stream()
                .filter(o -> o.getPaymentStatus() == Order.PaymentStatus.PAID)
                .mapToDouble(o -> o.getFinalAmount() != null ? o.getFinalAmount() : 0)
                .sum());

        return ApiResponse.success("Customer detail retrieved", detail);
    }

    /**
     * Update customer information
     */
    public ApiResponse updateCustomer(Long customerId, Map<String, Object> updates) {
        Optional<User> optUser = userRepository.findById(customerId);
        if (optUser.isEmpty()) {
            return ApiResponse.error("Customer not found");
        }

        User customer = optUser.get();
        if (customer.getRole() != User.Role.CUSTOMER) {
            return ApiResponse.error("User is not a customer");
        }

        if (updates.containsKey("fullName")) {
            customer.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            // Check if email is already taken by another user
            Optional<User> existingUser = userRepository.findByEmail(newEmail);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(customerId)) {
                return ApiResponse.error("Email is already registered to another user");
            }
            customer.setEmail(newEmail);
        }
        if (updates.containsKey("phone")) {
            customer.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("address")) {
            customer.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("notes")) {
            customer.setNotes((String) updates.get("notes"));
        }

        userRepository.save(customer);
        return ApiResponse.success("Customer updated successfully", buildCustomerSummary(customer));
    }

    /**
     * Block or unblock a customer
     */
    public ApiResponse toggleBlockCustomer(Long customerId) {
        Optional<User> optUser = userRepository.findById(customerId);
        if (optUser.isEmpty()) {
            return ApiResponse.error("Customer not found");
        }

        User customer = optUser.get();
        if (customer.getRole() != User.Role.CUSTOMER) {
            return ApiResponse.error("User is not a customer");
        }

        boolean newStatus = !(customer.getIsActive() != null && customer.getIsActive());
        customer.setIsActive(newStatus);
        userRepository.save(customer);

        String message = newStatus ? "Customer unblocked successfully" : "Customer blocked successfully";
        return ApiResponse.success(message, buildCustomerSummary(customer));
    }

    /**
     * Create a new customer (admin)
     */
    public ApiResponse createCustomer(Map<String, Object> customerData) {
        String email = (String) customerData.get("email");
        String fullName = (String) customerData.get("fullName");
        String phone = (String) customerData.get("phone");
        String password = (String) customerData.get("password");
        String address = (String) customerData.get("address");

        if (email == null || email.trim().isEmpty()) {
            return ApiResponse.error("Email is required");
        }
        if (fullName == null || fullName.trim().isEmpty()) {
            return ApiResponse.error("Full name is required");
        }
        if (password == null || password.trim().isEmpty()) {
            return ApiResponse.error("Password is required");
        }

        if (userRepository.existsByEmail(email)) {
            return ApiResponse.error("Email already registered");
        }

        User customer = new User();
        customer.setEmail(email);
        customer.setFullName(fullName);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setPassword(passwordEncoder.encode(password));
        customer.setRole(User.Role.CUSTOMER);
        customer.setIsActive(true);

        userRepository.save(customer);
        return ApiResponse.success("Customer created successfully", buildCustomerSummary(customer));
    }

    /**
     * Get customer stats for admin dashboard
     */
    public ApiResponse getCustomerStats() {
        Long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        Long activeCustomers = userRepository.countByRoleAndIsActive(User.Role.CUSTOMER, true);
        Long blockedCustomers = userRepository.countByRoleAndIsActive(User.Role.CUSTOMER, false);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("activeCustomers", activeCustomers);
        stats.put("blockedCustomers", blockedCustomers);

        return ApiResponse.success("Customer stats retrieved", stats);
    }

    /**
     * Build a summary map for a customer (used in list views)
     */
    private Map<String, Object> buildCustomerSummary(User customer) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", customer.getId());
        map.put("fullName", customer.getFullName());
        map.put("email", customer.getEmail());
        map.put("phone", customer.getPhone());
        map.put("address", customer.getAddress());
        map.put("profileImage", customer.getProfileImage());
        map.put("isActive", customer.getIsActive());
        map.put("role", customer.getRole().name());
        map.put("createdAt", customer.getCreatedAt());
        map.put("googleId", customer.getGoogleId() != null);
        return map;
    }
}
