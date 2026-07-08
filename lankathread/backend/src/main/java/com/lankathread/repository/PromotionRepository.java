package com.lankathread.repository;

import com.lankathread.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByProductId(Long productId);
    Optional<Promotion> findByProductIdAndIsActiveTrue(Long productId);
    List<Promotion> findByIsActiveTrue();
}
