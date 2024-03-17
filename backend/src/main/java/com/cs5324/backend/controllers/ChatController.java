package com.cs5324.backend.controllers;

import com.cs5324.backend.chat.message.ChatMessageService;
import com.cs5324.backend.chat.user.ChatUser;
import com.cs5324.backend.chat.user.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
    public ChatUser userLoggedOn(ChatUser user) {
        return userService.saveUser(user);
    }
}
