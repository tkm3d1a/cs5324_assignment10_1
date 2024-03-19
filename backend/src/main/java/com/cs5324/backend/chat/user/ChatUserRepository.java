package com.cs5324.backend.chat.user;

import com.cs5324.backend.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatUserRepository extends JpaRepository<ChatUser,Long> {
    List<ChatUser> findByStatusIn(Collection<Status> statuses);
    void deleteByUsername(String username);
    Optional<ChatUser> findByUsername(String username);
}
