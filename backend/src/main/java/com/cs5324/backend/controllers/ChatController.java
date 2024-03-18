package com.cs5324.backend.controllers;

import com.cs5324.backend.chat.message.ChatMessage;
import com.cs5324.backend.chat.message.ChatMessageService;
import com.cs5324.backend.chat.user.ChatUser;
import com.cs5324.backend.chat.user.ChatUserService;
import com.cs5324.backend.enums.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatUserService userService;
    private final ChatMessageService messageService;

    @MessageMapping("/user")
    @SendTo("/topic/user")
    @Transactional
    public ChatUser userLoggedOn(ChatUser user) {
        return userService.saveUser(user);
    }

    @MessageMapping("/logout")
    @SendTo("/topic/user")
    @Transactional
    public ChatUser logoutUser(ChatUser user) {
        userService.deleteByUsername(user.getUsername());
        user.setStatus(Status.OFFLINE);
        return user;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage sendChatMessage(ChatMessage message) {
        return messageService.saveMessage(message);
    }

    @MessageMapping("/status")
    @SendTo("/topic/user")
    public ChatUser changeUserStatus(ChatUser user) {
        if (user.getStatus() == null) return null;
        ChatUser user1 = userService.getUserByUsername(user.getUsername());
        user1.setStatus(user.getStatus());
        return userService.saveUser(user1);
    }
}