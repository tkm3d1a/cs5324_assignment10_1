package com.cs5324.backend.controllers;

import com.cs5324.backend.chat.message.ChatMessage;
import com.cs5324.backend.chat.message.ChatMessageService;
import com.cs5324.backend.chat.user.ChatUser;
import com.cs5324.backend.chat.user.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatUserService userService;
    private final ChatMessageService messageService;

    @GetMapping
    public String returnView() {
        return "index";
    }

    @MessageMapping("/user")
    @SendTo("/topic/user")
    @Transactional
    public ChatUser userLoggedOn(ChatUser user) {
        return userService.saveUser(user);
    }

    @MessageMapping("/logout")
    @SendTo("/topic/user")
    @Transactional
    public String logoutUser(ChatUser user) {
        userService.deleteByUsername(user.getUsername());
        return String.format("User %s logged out.", user.getUsername());
    }

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public ChatMessage sendChatMessage(ChatMessage message) {
        return messageService.saveMessage(message);
    }

    @MessageMapping("/status")
    @SendTo("/topic/user")
    public ChatUser changeUserStatus(ChatUser user) {
        if (user.getCurrentStatus() == null) return null;
        return userService.saveUser(user);
    }
}