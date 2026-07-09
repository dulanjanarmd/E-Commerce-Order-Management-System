package com.lankathread.repository;

import com.lankathread.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByResetToken(String resetToken);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);

    // Customer management queries
    List<User> findByRole(User.Role role);

    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<User> searchCustomers(@Param("keyword") String keyword, @Param("role") User.Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = :isActive AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<User> searchCustomersWithStatus(@Param("keyword") String keyword, 
                                          @Param("role") User.Role role, 
                                          @Param("isActive") Boolean isActive);

    Long countByRole(User.Role role);

    Long countByRoleAndIsActive(User.Role role, Boolean isActive);
}
