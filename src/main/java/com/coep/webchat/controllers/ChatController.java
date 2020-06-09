package com.coep.webchat.controllers;

import com.coep.webchat.dto.ChatMessage;
import com.coep.webchat.utils.LocalDateTimeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        String time = LocalDateTimeUtils.formatTime(LocalDateTime.now());
        chatMessage.setTime(time);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        String username = chatMessage.getSender();
        headerAccessor.getSessionAttributes().put("username", username);

        logger.info(chatMessage.getSender() + " подключился");

        String time = LocalDateTimeUtils.formatTime(LocalDateTime.now());
        chatMessage.setTime(time);
        return chatMessage;
    }
}
