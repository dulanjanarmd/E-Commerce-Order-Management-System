package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.model.WishlistItem;
import com.lankathread.model.Product;
import com.lankathread.repository.WishlistItemRepository;
import com.lankathread.repository.ProductRepository;
import com.lankathread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse getWishlistItems(Long userId) {
        List<WishlistItem> items = wishlistItemRepository.findByUserId(userId);
        return ApiResponse.success("Wishlist items fetched", items);
    }

    public ApiResponse addToWishlist(Long userId, Long productId) {
        if (wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            return ApiResponse.error("Product already in wishlist");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WishlistItem item = new WishlistItem();
        item.setUser(userRepository.findById(userId).orElseThrow());
        item.setProduct(product);

        WishlistItem saved = wishlistItemRepository.save(item);
        return ApiResponse.success("Added to wishlist", saved);
    }

    public ApiResponse removeFromWishlist(Long userId, Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
        return ApiResponse.success("Removed from wishlist");
    }

    public ApiResponse isInWishlist(Long userId, Long productId) {
        Boolean exists = wishlistItemRepository.existsByUserIdAndProductId(userId, productId);
        return ApiResponse.success("Wishlist status", exists);
    }
}
