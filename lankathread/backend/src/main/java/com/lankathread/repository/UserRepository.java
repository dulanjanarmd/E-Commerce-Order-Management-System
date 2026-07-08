package com.lankathread.repository;

import com.lankathread.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByResetToken(String resetToken);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);
}
