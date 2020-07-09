let usernamePage = document.querySelector('#username-page');
let chatPage = document.querySelector('#chat-page');
let usernameForm = document.querySelector('#usernameForm');
let messageForm = document.querySelector('#messageForm');
let messageInput = document.querySelector('#message');
let messageArea = document.querySelector('#messageArea');
let connectingElement = document.querySelector('.connecting');


let stompClient = null;
let username = null;
let colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652',
                
                '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];


function connect(event) {
    username = document.querySelector('#name').value.trim();
    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        let socket = new SockJS('/ws');

        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
    
    event.preventDefault();
}


function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
    )
    connectingElement.classList.add('hidden');
    setFocus('message');
}


function onError(error) {
    connectingElement.textContent = 'Couldn\'t connect to sockets. Restart the page!';
    connectingElement.style.color = '#ff4743';
}


function sendMessage(event) {
    let messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        let chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT',
            time: new Date()
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }

    setFocus('message');
    event.preventDefault();
}


function onMessageReceived(payload) {
    
    let message = JSON.parse(payload.body);
    let messageElement = document.createElement('li');
    
    
    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined';
    } 
    else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left';
    } 
    else {
        messageElement.classList.add('chat-message');

        let avatarElement = document.createElement('i');
        let avatarContent = document.createTextNode(message.sender[0]);

        avatarElement.appendChild(avatarContent);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);
        messageElement.appendChild(avatarElement);


        let usernameElement = document.createElement('span');
        let usernameContent = document.createTextNode(message.sender);

        usernameElement.style.color = '#333333';
        usernameElement.appendChild(usernameContent);
        messageElement.appendChild(usernameElement);
    }


    let textElement = document.createElement('p');
    let textContent = document.createTextNode(message.content);

    textElement.style.color = '#555555'
    textElement.appendChild(textContent);
    messageElement.appendChild(textElement);


    let dateElement = document.createElement('p');
    let dateText = document.createTextNode(message.time);

    dateElement.classList.add('time-message');
    dateElement.appendChild(dateText);
    messageElement.appendChild(dateElement);


    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    let hash = 0;

    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    let index = Math.abs(hash % colors.length);
    return colors[index];
}


function setFocus(elementId) {
    document.getElementById(elementId).focus();
}


setFocus('name');
usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
