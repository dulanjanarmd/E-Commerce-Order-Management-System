package com.lankathread.controller;

import com.lankathread.model.Category;
import com.lankathread.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/parent")
    public ResponseEntity<?> getParentCategories() {
        return ResponseEntity.ok(categoryService.getAllParentCategories());
    }

    @GetMapping("/pinned")
    public ResponseEntity<?> getPinnedCategories() {
        return ResponseEntity.ok(categoryService.getPinnedCategories());
    }

    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<?> getSubcategories(@PathVariable Long parentId) {
        return ResponseEntity.ok(categoryService.getSubcategories(parentId));
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @PutMapping("/{id}/toggle-pin")
    public ResponseEntity<?> togglePin(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.togglePin(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }
}
