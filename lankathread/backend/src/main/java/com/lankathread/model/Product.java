package com.lankathread.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String slug;
    
    @Column(name = "short_description", length = 500)
    private String shortDescription;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(name = "sale_price")
    private Double salePrice;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(name = "sub_category")
    private String subCategory;
    
    private String brand;
    
    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> sizes;
    
    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    private List<String> colors;
    
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> images;
    
    @Column(name = "main_image")
    private String mainImage;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    private String material;
    
    @Column(name = "care_instructions", columnDefinition = "TEXT")
    private String careInstructions;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 5;
    
    @ElementCollection
    @CollectionTable(name = "product_size_stock", joinColumns = @JoinColumn(name = "product_id"))
    private List<SizeStock> sizeStock;
    
    private String sku;
    
    @Column(name = "is_new_arrival")
    private Boolean isNewArrival = false;
    
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_archived")
    private Boolean isArchived = false;

    @Column(name = "barcode")
    private String barcode;

    @Column(name = "store_location")
    private String storeLocation;
    
    // Shipping fields
    private Double weight;
    
    private String dimensions;
    
    // SEO fields
    @Column(name = "meta_title")
    private String metaTitle;
    
    @Column(name = "meta_description", length = 500)
    private String metaDescription;
    
    // Additional attributes
    private String season;
    
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @ElementCollection
    @CollectionTable(name = "product_attributes", joinColumns = @JoinColumn(name = "product_id"))
    private List<ProductAttribute> attributes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum Gender {
        WOMEN, MEN, KIDS, TEENS, UNISEX
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SizeStock {
        @Column(name = "size")
        private String size;
        
        @Column(name = "stock")
        private Integer stock;
    }
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductAttribute {
        @Column(name = "attr_key")
        private String key;
        
        @Column(name = "attr_value")
        private String value;
    }
}
