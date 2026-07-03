package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.OrderRequest;
import com.lankathread.model.Order;
import com.lankathread.model.OrderItem;
import com.lankathread.model.Product;
import com.lankathread.repository.OrderRepository;
import com.lankathread.repository.ProductRepository;
import com.lankathread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ApiResponse createOrder(Long userId, OrderRequest request) {
        Order order = new Order();
        order.setUser(userRepository.findById(userId).orElseThrow(() -> 
                new RuntimeException("User not found")));
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingDistrict(request.getShippingDistrict());
        order.setShippingPostalCode(request.getShippingPostalCode());
        order.setDeliveryNotes(request.getDeliveryNotes());
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingCost(request.getShippingCost());
        order.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : 0.0);
        order.setFinalAmount(request.getFinalAmount());
        
        if (request.getPaymentMethod() == Order.PaymentMethod.CASH_ON_DELIVERY) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setSize(itemRequest.getSize());
            orderItem.setColor(itemRequest.getColor());
            orderItem.setUnitPrice(itemRequest.getUnitPrice());
            orderItem.setTotalPrice(itemRequest.getUnitPrice() * itemRequest.getQuantity());
            orderItems.add(orderItem);

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setOrderItems(orderItems);
        Order saved = orderRepository.save(order);
        return ApiResponse.success("Order placed successfully", saved);
    }

    public ApiResponse getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ApiResponse.success("Orders fetched", orders);
    }

    public ApiResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return ApiResponse.success("Order found", order);
    }

    public ApiResponse getAllOrders() {
        return ApiResponse.success("All orders", orderRepository.findAllByOrderByCreatedAtDesc());
    }

    public ApiResponse updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        
        if (status == Order.OrderStatus.DELIVERED && order.getPaymentMethod() == Order.PaymentMethod.CASH_ON_DELIVERY) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
        }
        
        Order updated = orderRepository.save(order);
        return ApiResponse.success("Order status updated", updated);
    }

    public ApiResponse getOrderStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("pendingOrders", orderRepository.countByStatus(Order.OrderStatus.PENDING));
        stats.put("confirmedOrders", orderRepository.countByStatus(Order.OrderStatus.CONFIRMED));
        stats.put("shippedOrders", orderRepository.countByStatus(Order.OrderStatus.SHIPPED));
        stats.put("deliveredOrders", orderRepository.countByStatus(Order.OrderStatus.DELIVERED));
        stats.put("cancelledOrders", orderRepository.countByStatus(Order.OrderStatus.CANCELLED));
        return ApiResponse.success("Order stats", stats);
    }
}
