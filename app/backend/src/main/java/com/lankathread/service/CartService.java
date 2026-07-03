package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.dto.CartRequest;
import com.lankathread.model.CartItem;
import com.lankathread.model.Product;
import com.lankathread.repository.CartItemRepository;
import com.lankathread.repository.ProductRepository;
import com.lankathread.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse getCartItems(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return ApiResponse.success("Cart items fetched", items);
    }

    public ApiResponse addToCart(Long userId, CartRequest request) {
        Optional<CartItem> existing = cartItemRepository
                .findByUserIdAndProductIdAndSizeAndColor(userId, request.getProductId(), 
                        request.getSize(), request.getColor());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
            return ApiResponse.success("Cart updated", item);
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = new CartItem();
        cartItem.setUser(userRepository.findById(userId).orElseThrow());
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setSize(request.getSize());
        cartItem.setColor(request.getColor());

        CartItem saved = cartItemRepository.save(cartItem);
        return ApiResponse.success("Added to cart", saved);
    }

    public ApiResponse updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!item.getUser().getId().equals(userId)) {
            return ApiResponse.error("Unauthorized");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ApiResponse.success("Item removed from cart");
        }

        item.setQuantity(quantity);
        CartItem updated = cartItemRepository.save(item);
        return ApiResponse.success("Quantity updated", updated);
    }

    public ApiResponse removeFromCart(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!item.getUser().getId().equals(userId)) {
            return ApiResponse.error("Unauthorized");
        }

        cartItemRepository.delete(item);
        return ApiResponse.success("Item removed from cart");
    }

    public ApiResponse clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        return ApiResponse.success("Cart cleared");
    }

    public ApiResponse getCartCount(Long userId) {
        Long count = cartItemRepository.countByUserId(userId);
        return ApiResponse.success("Cart count", count);
    }
}
