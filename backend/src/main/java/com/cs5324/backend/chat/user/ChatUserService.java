package com.cs5324.backend.chat.user;

import jakarta.annotation.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatUserService {
    @Resource
    private ChatUserRepository chatUserRepo;

    //CREATE
    public ChatUser saveUser(ChatUser usr){
        return chatUserRepo.save(usr);
    }
    //READ
    public List<ChatUser> getAllUsersSortedByStatus(){
        return chatUserRepo.findAll(Sort.by(Sort.Direction.ASC, "currentStatus"));
    }
    public ChatUser getUserById(Long id){
        return chatUserRepo.findById(id).orElseThrow();
    }

    public ChatUser getUserByUsername(String username) {
        return chatUserRepo.findByUsername(username).orElseThrow();
    }
    //UPDATE
    //DELETE
    public void deleteUserById(Long id){
        chatUserRepo.deleteById(id);
    }

    public void deleteByUsername(String username) {
        chatUserRepo.deleteByUsername(username);
    }

    //PRIVATE
}
