package com.cs5324.backend.controllers;

import com.cs5324.backend.chat.message.ChatMessageService;
import com.cs5324.backend.chat.user.ChatUser;
import com.cs5324.backend.chat.user.ChatUserService;
import jakarta.annotation.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DisplayController {
    @Resource
    private ChatUserService userService;

    @Resource
    private ChatMessageService messageService;

    @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllLoggedInUsers(){
        List<ChatUser> onlineUsers = userService.getAllOnlineOrDoNotDisturbUsers();
        return ResponseEntity.ok().body(onlineUsers);
    }

}
