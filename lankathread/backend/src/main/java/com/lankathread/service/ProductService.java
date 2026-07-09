package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.ProductFilterRequest;
import com.lankathread.model.Product;
import com.lankathread.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ApiResponse getAllActiveProducts() {
        return ApiResponse.success("Products fetched", 
                productRepository.findByIsActiveTrueOrderByCreatedAtDesc());
    }

    public ApiResponse getFeaturedProducts() {
        return ApiResponse.success("Featured products", 
                productRepository.findByIsFeaturedTrueAndIsActiveTrue());
    }

    public ApiResponse getNewArrivals() {
        return ApiResponse.success("New arrivals", 
                productRepository.findByIsNewArrivalTrueAndIsActiveTrue());
    }

    public ApiResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ApiResponse.success("Product found", product);
    }

    public ApiResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ApiResponse.success("Product found", product);
    }

    public ApiResponse getProductsByCategory(Long categoryId) {
        return ApiResponse.success("Category products",
                productRepository.findByCategoryIdAndIsActiveTrue(categoryId));
    }

    public ApiResponse filterProducts(ProductFilterRequest request, int page, int size) {
        Sort sort = Sort.by(request.getSortOrder().equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC, request.getSortBy());
        Pageable pageable = PageRequest.of(page, size, sort);

        Product.Gender gender = null;
        if (request.getGender() != null && !request.getGender().isEmpty()) {
            try {
                gender = Product.Gender.valueOf(request.getGender().toUpperCase());
            } catch (IllegalArgumentException e) {
                // ignore invalid gender
            }
        }

        String brandFilter = null;
        if (request.getBrands() != null && !request.getBrands().isEmpty()) {
            brandFilter = request.getBrands().get(0);
        }

        Page<Product> products = productRepository.findByFilters(
                request.getSearch(),
                request.getCategoryId(),
                request.getParentCategoryId(),
                gender,
                request.getMinPrice(),
                request.getMaxPrice(),
                brandFilter,
                request.getInStock(),
                request.getNewArrivals(),
                request.getOnSale(),
                pageable
        );

        return ApiResponse.success("Filtered products", products);
    }

    public ApiResponse searchProducts(String query) {
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> results = productRepository.searchByName(query, pageable);
        return ApiResponse.success("Search results", results);
    }

    public ApiResponse getBrands() {
        return ApiResponse.success("Brands", productRepository.findAllBrands());
    }

    public ApiResponse createProduct(Product product) {
        // Auto-set active status based on stock
        if (product.getStockQuantity() != null && product.getStockQuantity() <= 0) {
            product.setIsActive(false);
        }
        Product saved = productRepository.save(product);
        return ApiResponse.success("Product created", saved);
    }

    public ApiResponse updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setName(product.getName());
        existing.setSlug(product.getSlug());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setSalePrice(product.getSalePrice());
        existing.setCategory(product.getCategory());
        existing.setSubCategory(product.getSubCategory());
        existing.setBrand(product.getBrand());
        existing.setGender(product.getGender());
        existing.setSizes(product.getSizes());
        existing.setColors(product.getColors());
        existing.setImages(product.getImages());
        existing.setMainImage(product.getMainImage());
        existing.setMaterial(product.getMaterial());
        existing.setCareInstructions(product.getCareInstructions());
        existing.setStockQuantity(product.getStockQuantity());
        existing.setSizeStock(product.getSizeStock());
        existing.setIsNewArrival(product.getIsNewArrival());
        existing.setIsFeatured(product.getIsFeatured());
        existing.setBarcode(product.getBarcode());
        existing.setStoreLocation(product.getStoreLocation());
        existing.setIsArchived(product.getIsArchived());
        // Auto-set active status based on stock: if stock is 0 or less, deactivate; if stock > 0 and not archived, activate
        if (!Boolean.TRUE.equals(existing.getIsArchived())) {
            if (existing.getStockQuantity() != null && existing.getStockQuantity() <= 0) {
                existing.setIsActive(false);
            } else if (existing.getStockQuantity() != null && existing.getStockQuantity() > 0) {
                existing.setIsActive(product.getIsActive() != null ? product.getIsActive() : true);
            }
        }
        Product updated = productRepository.save(existing);
        return ApiResponse.success("Product updated", updated);
    }

    public ApiResponse deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
        return ApiResponse.success("Product deactivated");
    }

    public ApiResponse archiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsArchived(true);
        product.setIsActive(false);
        productRepository.save(product);
        return ApiResponse.success("Product archived");
    }

    public ApiResponse unarchiveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsArchived(false);
        product.setIsActive(true);
        productRepository.save(product);
        return ApiResponse.success("Product unarchived and activated");
    }
}
