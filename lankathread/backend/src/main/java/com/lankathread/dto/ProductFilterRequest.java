package com.lankathread.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductFilterRequest {
    private String search;
    private Long categoryId;
    private Long parentCategoryId;
    private String gender;
    private List<String> sizes;
    private Double minPrice;
    private Double maxPrice;
    private List<String> colors;
    private List<String> brands;
    private Boolean inStock;
    private Boolean newArrivals;
    private Boolean onSale;
    private String sortBy = "createdAt";
    private String sortOrder = "desc";
}
