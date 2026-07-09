package com.lankathread.controller;

import com.lankathread.dto.ApiResponse;
import com.lankathread.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * GET /api/admin/customers
     * List all customers with optional search and status filter
     * Query params: keyword (search by name/email/phone), isActive (true/false)
     */
    @GetMapping
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(customerService.getAllCustomers(keyword, isActive));
    }

    /**
     * GET /api/admin/customers/{id}
     * Get detailed customer profile with order history
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerDetail(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerDetail(id));
    }

    /**
     * PUT /api/admin/customers/{id}
     * Update customer information
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(customerService.updateCustomer(id, updates));
    }

    /**
     * PUT /api/admin/customers/{id}/toggle-block
     * Block or unblock a customer
     */
    @PutMapping("/{id}/toggle-block")
    public ResponseEntity<?> toggleBlockCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.toggleBlockCustomer(id));
    }

    /**
     * POST /api/admin/customers
     * Create a new customer (admin-initiated)
     */
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Map<String, Object> customerData) {
        return ResponseEntity.ok(customerService.createCustomer(customerData));
    }

    /**
     * GET /api/admin/customers/stats
     * Get customer statistics for admin dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getCustomerStats() {
        return ResponseEntity.ok(customerService.getCustomerStats());
    }
}
