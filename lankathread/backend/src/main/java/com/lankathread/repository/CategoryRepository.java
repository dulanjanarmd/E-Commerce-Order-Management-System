package com.lankathread.repository;

import com.lankathread.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNullAndActiveTrueOrderByDisplayOrder();
    
    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId AND c.active = true")
    List<Category> findSubcategoriesByParentId(Long parentId);
    
    Optional<Category> findBySlug(String slug);
    
    @Query("SELECT c FROM Category c WHERE c.isPinned = true AND c.active = true ORDER BY c.pinOrder")
    List<Category> findPinnedCategories();
}
