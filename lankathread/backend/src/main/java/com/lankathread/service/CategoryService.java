package com.lankathread.service;

import com.lankathread.dto.ApiResponse;
import com.lankathread.model.Category;
import com.lankathread.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public ApiResponse getAllParentCategories() {
        List<Category> categories = categoryRepository.findByParentIsNullAndActiveTrueOrderByDisplayOrder();
        return ApiResponse.success("Categories fetched", categories);
    }

    public ApiResponse getPinnedCategories() {
        List<Category> categories = categoryRepository.findPinnedCategories();
        return ApiResponse.success("Pinned categories fetched", categories);
    }

    public ApiResponse getSubcategories(Long parentId) {
        List<Category> subcategories = categoryRepository.findSubcategoriesByParentId(parentId);
        return ApiResponse.success("Subcategories fetched", subcategories);
    }

    public ApiResponse getAllCategories() {
        return ApiResponse.success("All categories", categoryRepository.findAll());
    }

    public ApiResponse createCategory(Category category) {
        // If parent is null but we have a parentId reference, resolve it
        if (category.getParent() == null && category.getParentId() != null) {
            Category parent = categoryRepository.findById(category.getParentId())
                    .orElse(null);
            category.setParent(parent);
        }
        if (category.getSlug() == null || category.getSlug().isEmpty()) {
            category.setSlug(category.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        }
        if (category.getIsPinned() == null) {
            category.setIsPinned(false);
        }
        Category saved = categoryRepository.save(category);
        return ApiResponse.success("Category created", saved);
    }

    public ApiResponse updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(category.getName());
        existing.setSlug(category.getSlug());
        existing.setDescription(category.getDescription());
        existing.setImageUrl(category.getImageUrl());
        existing.setActive(category.getActive());
        existing.setDisplayOrder(category.getDisplayOrder());
        existing.setIsPinned(category.getIsPinned());
        existing.setPinOrder(category.getPinOrder());
        // Handle parent category change
        if (category.getParentId() != null) {
            Category parent = categoryRepository.findById(category.getParentId()).orElse(null);
            existing.setParent(parent);
        } else {
            existing.setParent(null);
        }
        Category updated = categoryRepository.save(existing);
        return ApiResponse.success("Category updated", updated);
    }

    public ApiResponse togglePin(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        // Only main categories (no parent) can be pinned
        if (category.getParent() != null) {
            return ApiResponse.success("Only main categories can be pinned", category);
        }
        category.setIsPinned(!Boolean.TRUE.equals(category.getIsPinned()));
        if (Boolean.TRUE.equals(category.getIsPinned())) {
            // Count currently pinned to assign order
            long pinnedCount = categoryRepository.findPinnedCategories().size();
            if (pinnedCount >= 5) {
                category.setIsPinned(false);
                return ApiResponse.success("Maximum 5 categories can be pinned. Unpin one first.", category);
            }
            category.setPinOrder((int) pinnedCount + 1);
        } else {
            category.setPinOrder(null);
        }
        Category updated = categoryRepository.save(category);
        return ApiResponse.success("Category pin toggled", updated);
    }

    public ApiResponse deleteCategory(Long id) {
        categoryRepository.deleteById(id);
        return ApiResponse.success("Category deleted");
    }
}
