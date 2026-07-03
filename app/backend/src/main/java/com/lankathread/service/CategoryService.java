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

    public ApiResponse getSubcategories(Long parentId) {
        List<Category> subcategories = categoryRepository.findByParentIdAndActiveTrue(parentId);
        return ApiResponse.success("Subcategories fetched", subcategories);
    }

    public ApiResponse getAllCategories() {
        return ApiResponse.success("All categories", categoryRepository.findAll());
    }

    public ApiResponse createCategory(Category category) {
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
        Category updated = categoryRepository.save(existing);
        return ApiResponse.success("Category updated", updated);
    }

    public ApiResponse deleteCategory(Long id) {
        categoryRepository.deleteById(id);
        return ApiResponse.success("Category deleted");
    }
}
