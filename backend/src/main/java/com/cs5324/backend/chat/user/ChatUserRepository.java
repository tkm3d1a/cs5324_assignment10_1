package com.cs5324.backend.chat.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatUserRepository extends JpaRepository<ChatUser,Long> {
    void deleteByUsername(String username);
    Optional<ChatUser> findByUsername(String username);
}
