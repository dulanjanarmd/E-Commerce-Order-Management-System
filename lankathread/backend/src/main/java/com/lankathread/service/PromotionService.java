package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.model.Promotion;
import com.lankathread.repository.PromotionRepository;
import com.lankathread.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public List<Promotion> getActivePromotions() {
        return promotionRepository.findByIsActiveTrue();
    }

    public List<Promotion> getProductPromotions(Long productId) {
        return promotionRepository.findByProductId(productId);
    }

    public Promotion getPromotionById(Long id) {
        return promotionRepository.findById(id).orElse(null);
    }

    public ApiResponse createPromotion(Promotion promotion) {
        if (promotion.getProduct() == null || promotion.getProduct().getId() == null) {
            return ApiResponse.error("Product is required");
        }

        if (!productRepository.existsById(promotion.getProduct().getId())) {
            return ApiResponse.error("Product not found");
        }

        Promotion saved = promotionRepository.save(promotion);
        return ApiResponse.success("Promotion created successfully", saved);
    }

    public ApiResponse updatePromotion(Long id, Promotion promotion) {
        Promotion existing = promotionRepository.findById(id).orElse(null);
        if (existing == null) {
            return ApiResponse.error("Promotion not found");
        }

        existing.setDiscountPercentage(promotion.getDiscountPercentage());
        existing.setDiscountAmount(promotion.getDiscountAmount());
        existing.setSalePrice(promotion.getSalePrice());
        existing.setStartDate(promotion.getStartDate());
        existing.setEndDate(promotion.getEndDate());
        existing.setDescription(promotion.getDescription());
        existing.setIsActive(promotion.getIsActive());

        Promotion updated = promotionRepository.save(existing);
        return ApiResponse.success("Promotion updated successfully", updated);
    }

    public ApiResponse deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            return ApiResponse.error("Promotion not found");
        }
        promotionRepository.deleteById(id);
        return ApiResponse.success("Promotion deleted successfully", null);
    }
}
