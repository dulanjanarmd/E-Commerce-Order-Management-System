package com.lankathread.dto;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private Integer quantity;
    private String size;
    private String color;
}
