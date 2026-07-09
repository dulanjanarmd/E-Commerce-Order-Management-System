package com.lankathread.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.ProductFilterRequest;
import com.lankathread.model.Product;
import com.lankathread.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;
    
    private final Path uploadDir = Paths.get("uploads/products").toAbsolutePath();
    
    public ProductController() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<ApiResponse> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @PostMapping("/filter")
    public ResponseEntity<ApiResponse> filterProducts(
            @RequestBody ProductFilterRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.filterProducts(request, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProducts(@RequestParam String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse> getBrands() {
        return ResponseEntity.ok(productService.getBrands());
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    @PutMapping("/{id}/archive")
    public ResponseEntity<ApiResponse> archiveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.archiveProduct(id));
    }

    @PutMapping("/{id}/unarchive")
    public ResponseEntity<ApiResponse> unarchiveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.unarchiveProduct(id));
    }

    /**
     * Create product with image uploads (multipart/form-data)
     * Accepts "product" JSON part + "images" file parts
     */
    @PostMapping(value = "/with-images", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> createProductWithImages(
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);
            
            // Handle image uploads
            List<String> imageUrls = new ArrayList<>();
            if (images != null && !images.isEmpty()) {
                for (MultipartFile img : images) {
                    if (img != null && !img.isEmpty()) {
                        String ext = "";
                        String orig = img.getOriginalFilename();
                        if (orig != null && orig.contains(".")) {
                            ext = orig.substring(orig.lastIndexOf("."));
                        }
                        String filename = UUID.randomUUID() + ext;
                        Path target = uploadDir.resolve(filename);
                        Files.copy(img.getInputStream(), target);
                        imageUrls.add("/uploads/products/" + filename);
                    }
                }
            }
            
            // Set images: first image as main, rest as gallery
            if (!imageUrls.isEmpty()) {
                if (product.getMainImage() == null || product.getMainImage().isBlank()) {
                    product.setMainImage(imageUrls.get(0));
                }
                product.setImages(imageUrls);
            }
            
            return ResponseEntity.ok(productService.createProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create product: " + e.getMessage()));
        }
    }

    /**
     * Update product with image uploads (multipart/form-data)
     */
    @PutMapping(value = "/{id}/with-images", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> updateProductWithImages(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Product product = mapper.readValue(productJson, Product.class);
            
            // Handle new image uploads
            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile img : images) {
                    if (img != null && !img.isEmpty()) {
                        String ext = "";
                        String orig = img.getOriginalFilename();
                        if (orig != null && orig.contains(".")) {
                            ext = orig.substring(orig.lastIndexOf("."));
                        }
                        String filename = UUID.randomUUID() + ext;
                        Path target = uploadDir.resolve(filename);
                        Files.copy(img.getInputStream(), target);
                        imageUrls.add("/uploads/products/" + filename);
                    }
                }
                if (!imageUrls.isEmpty()) {
                    if (product.getMainImage() == null || product.getMainImage().isBlank()) {
                        product.setMainImage(imageUrls.get(0));
                    }
                    product.setImages(imageUrls);
                }
            }
            
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update product: " + e.getMessage()));
        }
    }
}
