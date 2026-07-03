package com.lankathread.dto;

import com.lankathread.model.Order;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private Order.PaymentMethod paymentMethod;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingDistrict;
    private String shippingPostalCode;
    private String deliveryNotes;
    private Double totalAmount;
    private Double shippingCost;
    private Double discountAmount;
    private Double finalAmount;
    
    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String size;
        private String color;
        private Double unitPrice;
    }
}
