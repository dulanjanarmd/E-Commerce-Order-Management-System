package com.lankathread.repository;

import com.lankathread.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySlug(String slug);
    
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    
    List<Product> findByIsNewArrivalTrueAndIsActiveTrue();
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:parentCategoryId IS NULL OR p.category.id = :parentCategoryId OR p.category.parent.id = :parentCategoryId) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:inStock IS NULL OR (:inStock = true AND p.stockQuantity > 0) OR (:inStock = false)) AND " +
           "(:newArrivals IS NULL OR (:newArrivals = true AND p.isNewArrival = true) OR (:newArrivals = false)) AND " +
           "(:onSale IS NULL OR (:onSale = true AND p.salePrice IS NOT NULL) OR (:onSale = false))")
    Page<Product> findByFilters(@Param("search") String search,
                                @Param("categoryId") Long categoryId,
                                @Param("parentCategoryId") Long parentCategoryId,
                                @Param("gender") Product.Gender gender,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                @Param("brand") String brand,
                                @Param("inStock") Boolean inStock,
                                @Param("newArrivals") Boolean newArrivals,
                                @Param("onSale") Boolean onSale,
                                Pageable pageable);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true AND p.brand IS NOT NULL")
    List<String> findAllBrands();
    
    @Query("SELECT DISTINCT p.gender FROM Product p WHERE p.isActive = true")
    List<Product.Gender> findAllGenders();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByName(@Param("query") String query, Pageable pageable);
}
