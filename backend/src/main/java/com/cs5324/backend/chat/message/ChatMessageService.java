package com.cs5324.backend.chat.message;

import jakarta.annotation.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {
    @Resource
    private ChatMessageRepository chatMsgRepo;

    //CREATE
    public ChatMessage saveMessage(ChatMessage msg){
        return chatMsgRepo.save(msg);
    }
    //READ
    public List<ChatMessage> getAllMessageSortedDesc(){
        return chatMsgRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
    public ChatMessage getMessageById(Long id){
        return chatMsgRepo.findById(id).orElseThrow();
    }
    //UPDATE
    //DELETE
    public void deleteMessageById(Long id){
        chatMsgRepo.deleteById(id);
    }

    //PRIVATE
}
