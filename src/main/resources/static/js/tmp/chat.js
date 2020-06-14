function setFocus(elementId) {
    document.getElementById(elementId).focus();
}

class Elements {
    static usernamePage = document.querySelector('#username-page');
    static chatPage = document.querySelector('#chat-page');
    static usernameForm = document.querySelector('#usernameForm');
    static messageForm = document.querySelector('#messageForm');
    static messageInput = document.querySelector('#message');
    static messageArea = document.querySelector('#messageArea');
    static connectingElement = document.querySelector('.connecting');
}

class WebSocketListener {
    static stompClient = null;
    
    constructor(url) {
        let socket = new SockJS(url);

        WebSocketListener.stompClient = Stomp.over(socket);
    }

    connect(event) {
        stompClient.connect({}, this.onConnected, this.onError);

        event.preventDefault();
    }

    onConnected() {
        throw new Error('Not implement');
    }
    
    
    onError(error) {
        throw new Error('Not implement');
    }
}

class ChatWebSocketListener extends WebSocketListener {
    constructor(url) {
        super(url);
    }

    onConnected() { 
        stompClient.subscribe('/topic/public', onMessageReceived);
        stompClient.send('/app/chat.addUser', 
                        {},
                        JSON.stringify({ sender: username, type: 'JOIN' })
        );
        Elements.connectingElement.classList.add('hidden');
        setFocus('message');
    }

    onError(error) {
        Elements.connectingElement.textContent = 'Не можем подключиться к веб-сокету. Обнови страницу';
        Elements.connectingElement.style.color = '#ff4743';
    }
    
    onMessageReceived(payload) {
        let message = JSON.parse(payload.body);

        let messageElement = setMessageContent(message);
        printMessage(messageElement);
    }

    setMessageContent(message) {
        let messageElement = document.createElement('li');
        if (message.type === 'JOIN') {
            messageElement.classList.add('event-message');
            message.content = message.sender + ' присоединился';
        } else if (message.type === 'LEAVE') {
            
        }
    }

    printMessage(messageElement) {
        
    }
}