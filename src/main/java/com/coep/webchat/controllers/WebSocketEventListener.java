package com.coep.webchat.controllers;

import com.coep.webchat.dto.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void connectListener(SessionConnectedEvent event) {
        logger.info("Connected to new sockets...");
    }

    @EventListener
    public void disconnectListener(SessionDisconnectEvent event) {
        Message<byte[]> message = event.getMessage();
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            logger.info(username + " left the chat");

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.MessageType.LEAVE);
            chatMessage.setSender(username);
            sendingOperations.convertAndSend("/topic/public", chatMessage);
        }
    }
}
