let my_token = "";
let currentChatRoomId = null;
let url = 'http://127.0.0.1:8000'
let ws_url = 'ws://127.0.0.1:8000'
let my_id = ''
// let url = 'http://10.66.4.108:8000'
// let ws_url = 'ws://10.66.4.108:8000'

window.onload = function () {

    var enterMessage = document.getElementById("message-input");
    enterMessage.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("send-btn").click();
            enterMessage.innerText = "";
        }
    });
    
    const cardList = document.getElementById("message-list");
    cardList.innerHTML = "";
    displayMessage(false);
    registrationCookie();
    verify_role(my_token)
    getChatRooms(my_token);
    
};

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function registrationCookie(){
    const registrationData = getCookie('userData');
    console.log(registrationData); // Log the value retrieved from the cookie
    if (registrationData !== '') {
        const data = JSON.parse(registrationData);
        console.log(data);
        my_token = data.token;
        my_id = data.id
        // Do something with the registration data
        let loginNav = document.getElementById('login');
        loginNav.style.cssText = "display: none;"
        let registerNav = document.getElementById('register');
        registerNav.style.cssText = "display: none;"
    } else {
        console.log('Registration data not found in cookie.');
        let progileNav = document.getElementById('profile');
        progileNav.style.cssText = "display: none;"
    }
        
}

function displayMessage(isDisplay){
    if(isDisplay){
        const messageProfile = document.querySelector('.message-container');
        if (messageProfile) {
            messageProfile.style.display = 'flex';
        } else {
            console.error('Element with class "message-chat-current" not found.');
        }
    } else {
        const messageProfile = document.querySelector('.message-container');
        if (messageProfile) {
            messageProfile.style.display = 'none';
        } else {
            console.error('Element with class "message-chat-current" not found.');
        }
    }

}

function updateMessageHeader(picUrl, displayName){

    const img = document.getElementById("message-current-pic")
    img.src = picUrl
    img.alt = "Profile Image"

    const msgDisplayName = document.getElementById("message-current-name")
    msgDisplayName.textContent = displayName
}

function connectChatRoomWS(chatRoomId){
    // var ws = new WebSocket("ws://127.0.0.1:8000/api/chat-room/"+chatRoomId);
    // ws = new WebSocket("ws://127.0.0.1:8000/api/chat-room/" + chatRoomId, ["x-token", my_token]);

    ws = new WebSocket(ws_url + "/api/chat-room/" + chatRoomId + "/" + my_token);
    displayMessage(true)
    getChatHistory(currentChatRoomId)

    console.log("Connect WS Chat success");
    ws.onmessage = function(event) {
        console.log(event.data)

        const respondJsonString = event.data.replace(/'/g, '"');
        const messageDetail = JSON.parse(respondJsonString);
        console.log(messageDetail);

        createMessageList(messageDetail.sender.displayname, messageDetail.id, messageDetail.text, messageDetail.timestamp, false)
        getChatRooms(my_token);
    };
    // function sendMessage(event) {
    //     var input = document.getElementById("messageText")
    //     ws.send(input.value)
    //     input.value = ''
    //     event.preventDefault()
    // }
}

function createChatRoom(username, picUrl, accountId, timestamp, text, chat_room_id) {
    console.log("createChatRoom: ", username, picUrl, accountId, timestamp, text, chat_room_id)
    const cardList = document.getElementById("chat-room-list")

    // Create card element
    const card = document.createElement("div")
    card.classList.add("chat-room")
    card.dataset.accountId = accountId // Set accountId as a custom data attribute
    card.dataset.chatRoomId = chat_room_id
    card.dataset.picUrl = picUrl
    card.dataset.username = username

    // Create image element
    const img = document.createElement("img");
    img.src = picUrl;
    img.alt = "Profile Image";

    // Create card detail element
    const cardDetail = document.createElement("div");
    cardDetail.classList.add("chat-detail");

    // Create card detail name element
    const cardDetailName = document.createElement("div")
    cardDetailName.classList.add("chat-username")
    cardDetailName.textContent = username

    // chat-latest-msg
    const cardDetailText = document.createElement("div")
    cardDetailText.classList.add("chat-latest-msg")
    cardDetailText.textContent = text

    // Create card detail timestamp element
    const cardDetailTimestamp = document.createElement("div");
    cardDetailTimestamp.classList.add("chat-timestamp");

    // Set timestamp text content or "No record" if empty
    if (timestamp === "") {
        cardDetailTimestamp.textContent = "มาเริ่มคุยกันเลย";
    } else {
        cardDetailTimestamp.textContent = timestamp;
    }

    // Append elements to card
    cardDetail.appendChild(cardDetailName)
    cardDetail.appendChild(cardDetailText)
    cardDetail.appendChild(cardDetailTimestamp)

    card.appendChild(img);
    card.appendChild(cardDetail); // Append card detail to card

    // Add event listener to card
    card.addEventListener("click", () => {
        const chatRoomId = card.dataset.chatRoomId
        console.log("Clicked card with chatRoomId:", chatRoomId)

        // Clear previous messages
        const messageList = document.getElementById("message-list");
        messageList.innerHTML = "";

        // Set current chat room ID
        currentChatRoomId = chatRoomId

        updateMessageHeader(card.dataset.picUrl, card.dataset.username)

        // getChatHistory(currentChatRoomId);
        // setInterval(() => {
        //     getChatHistory(currentChatRoomId);
        // }, 1000);

        connectChatRoomWS(currentChatRoomId);
    });

    // Append card to card list
    cardList.appendChild(card);
}

function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const messageText = messageInput.value;
    if (messageText.trim() !== "") {
        const receiverId = currentChatRoomId; // Assuming currentChatRoomId is set elsewhere

        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "x-token": my_token,
        //     },
        //     body: JSON.stringify({
        //         receiver_id: receiverId,
        //         text: messageText,
        //     }),
        // }

        // fetch(url+"/api/chat/talk", requestOptions)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log("Message sent successfully:", data)
        //         getChatHistory(currentChatRoomId)
        //         // Optionally, you can handle the response here
        //     })
        //     .catch((error) => console.error("Error sending message:", error))

        ws.send(messageText)

        // Clear message input after sending
        messageInput.value = "";
    }
}

function getChatRooms(token) {
    // Clear previous values
    const cardList = document.getElementById("chat-room-list")
    cardList.innerHTML = ""

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    };

    fetch(url + "/api/chat/get-chat-room", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Respond get-chat-room: ", data)
            data.data.forEach((item) => {
                // const username = item.account_detail.username
                const displayName = item.account_detail.displayname
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                const timestamp = item.latest_timestamp
                const text = item.latest_text
                const chat_room_id = item.chat_room_id
                createChatRoom(displayName, picUrl, accountId, timestamp, text, chat_room_id)
            })
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createMessageList(username, message_id, text, timestamp, is_edit) {
    const cardList = document.getElementById("message-list");

    // Create card element
    const card = document.createElement("div");
    card.classList.add("message-box");
    card.dataset.accountId = message_id; // Set accountId as a custom data attribute

    // Create card detail name element
    const cardDetailTimestamp = document.createElement("div");
    cardDetailTimestamp.classList.add("message-timestamp");
    cardDetailTimestamp.textContent = timestamp;

    const cardDetailSender = document.createElement("div");
    cardDetailSender.classList.add("message-sender");
    cardDetailSender.textContent = username;

    const cardDetailText = document.createElement("div");
    cardDetailText.classList.add("message-text");
    cardDetailText.textContent = text;

    card.appendChild(cardDetailTimestamp);
    card.appendChild(cardDetailSender);
    card.appendChild(cardDetailText);

    // Append card to card list
    cardList.appendChild(card);
}

function getChatHistory(chatRoomId) {
    // Clear previous values
    const cardList = document.getElementById("message-list");
    cardList.innerHTML = "";

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    };

    fetch(url + "/api/chat/get-chat-history/" + chatRoomId, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Respond of get-chat-history")
            console.log(data)
            if (data == "No History") {
                // Handle the case when there is no history
                console.log("No chat history available");
            } else {
                console.log(data.data)
                data.data.forEach((item) => {
                    const username = item.sender.displayname
                    const message_id = item.id
                    const text = item.text
                    const timestamp = item.timestamp
                    const is_edit = false
                    createMessageList(
                        username,
                        message_id,
                        text,
                        timestamp,
                        is_edit
                    );
                });
            }
        })
        .catch((error) => console.error("Error fetching data:", error));
}




function verify_role(token) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token
        },
    };

    // Return the fetch call directly to chain promises
    return fetch(url + "/api/controller/get-user-profile/" + my_id, requestOptions)
    .then((response) => {
        console.log("get-user-profile ", response);
        if (response.status === 200) {
            return response.json(); // If status is 200, parse response JSON
        } else {
            alert("Verification error");
            window.location.href = 'login.html'
            throw new Error("Verification error"); // For other statuses, throw unexpected error
        }
    })
    .then((data) => {
        if(data.hasOwnProperty("status_code")){
            if(data.status_code == 404){
                alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
                window.location.href = 'login.html'
            }

        }
        // Handle success response
        console.log("Verification respond:", data);
        return data.data.role;
    })
    .catch((error) => {
        console.error("Error Verification respond:", error.message);
        throw error; // Re-throw the error to be caught by the caller
    });
}