function createCard(username, picUrl, accountId) {
    const cardList = document.getElementById("card-list")

    // Create card element
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.accountId = accountId // Set accountId as a custom data attribute

    // Create image element
    const img = document.createElement("img")
    img.src = picUrl
    img.alt = "Profile Image"

    // Create card detail element
    const cardDetail = document.createElement("div")
    cardDetail.classList.add("card-detail")

    // Create card detail name element
    const cardDetailName = document.createElement("div")
    cardDetailName.classList.add("card-detail-name")
    cardDetailName.textContent = username

    const cardDetailLocation = document.createElement("div")
    cardDetailLocation.classList.add("card-detail-location")
    cardDetailLocation.textContent = "Bangkok"

    // Append elements to card
    cardDetail.appendChild(cardDetailLocation)
    cardDetail.appendChild(cardDetailName)
    card.appendChild(img)
    card.appendChild(cardDetail)

    // Add event listener to card
    card.addEventListener("click", () => {
        const accountId = card.dataset.accountId
        console.log("Clicked card with accountId:", accountId)
        // Perform GET request with accountId
    })

    // Append card to card list
    cardList.appendChild(card)
}

function getMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list")
    cardList.innerHTML = ""

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        // body: JSON.stringify(requestBody)
    }

    fetch(url + "/api/controller/get-mates", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((item) => {
                const username = item.account_detail.username
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                createCard(username, picUrl, accountId)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}

function createChatRoom(username, picUrl, accountId, timestamp, text) {
    const cardList = document.getElementById("chat-room-list")

    // Create card element
    const card = document.createElement("div")
    card.classList.add("chat-room")
    card.dataset.accountId = accountId // Set accountId as a custom data attribute

    // Create image element
    const img = document.createElement("img")
    img.src = picUrl
    img.alt = "Profile Image"

    // Create card detail element
    const cardDetail = document.createElement("div")
    cardDetail.classList.add("chat-detail")

    // Create card detail name element
    const cardDetailName = document.createElement("div")
    cardDetailName.classList.add("chat-username")
    cardDetailName.textContent = username

    // Create card detail timestamp element
    const cardDetailTimestamp = document.createElement("div")
    cardDetailTimestamp.classList.add("chat-timestamp")

    // Set timestamp text content or "No record" if empty
    if (timestamp === "") {
        cardDetailTimestamp.textContent = "มาเริ่มคุยกันเลย -"
    } else {
        cardDetailTimestamp.textContent = timestamp
    }

    // Append elements to card
    cardDetail.appendChild(cardDetailName)
    cardDetail.appendChild(cardDetailTimestamp)

    card.appendChild(img)
    card.appendChild(cardDetail) // Append card detail to card

    // Add event listener to card
    card.addEventListener("click", () => {
        const accountId = card.dataset.accountId
        console.log("Clicked card with accountId:", accountId)

        // Clear previous messages
        const messageList = document.getElementById("message-list")
        messageList.innerHTML = ""

        // Set current chat room ID
        currentChatRoomId = accountId

        getChatHistory(currentChatRoomId)
    })

    // Append card to card list
    cardList.appendChild(card)
}

function sendMessage() {
    const messageInput = document.getElementById("message-input")
    const messageText = messageInput.value
    if (messageText.trim() !== "") {
        const receiverId = currentChatRoomId // Assuming currentChatRoomId is set elsewhere

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-token": my_token,
            },
            body: JSON.stringify({
                receiver_id: receiverId,
                text: messageText,
            }),
        }

        fetch(url + "/api/chat/talk", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("Message sent successfully:", data)
                getChatHistory(currentChatRoomId)
                // Optionally, you can handle the response here
            })
            .catch((error) => console.error("Error sending message:", error))

        // Clear message input after sending
        messageInput.value = ""
    }
}

function getChatRooms() {
    // Clear previous values
    const cardList = document.getElementById("chat-room-list")
    cardList.innerHTML = ""

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    }

    fetch(url + "/api/chat/chat-room", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((item) => {
                const username = item.account_detail.username
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                const timestamp = item.latest_timestamp
                const text = item.latest_text
                createChatRoom(username, picUrl, accountId, timestamp, text)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}

function createMessageList(username, message_id, text, timestamp, is_edit) {
    const cardList = document.getElementById("message-list")

    // Create card element
    const card = document.createElement("div")
    card.classList.add("message-box")
    card.dataset.accountId = message_id // Set accountId as a custom data attribute

    // Create card detail name element
    const cardDetailTimestamp = document.createElement("div")
    cardDetailTimestamp.classList.add("message-timestamp")
    cardDetailTimestamp.textContent = timestamp

    const cardDetailSender = document.createElement("div")
    cardDetailSender.classList.add("message-sender")
    cardDetailSender.textContent = username

    const cardDetailText = document.createElement("div")
    cardDetailText.classList.add("message-text")
    cardDetailText.textContent = text

    card.appendChild(cardDetailTimestamp)
    card.appendChild(cardDetailSender)
    card.appendChild(cardDetailText)

    // Append card to card list
    cardList.appendChild(card)
}

function getChatHistory(chatRoomId) {
    // Clear previous values
    const cardList = document.getElementById("message-list")
    cardList.innerHTML = ""

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    }

    fetch(url + "/api/chat/chat-history/"+chatRoomId, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data == "No History") {
                // Handle the case when there is no history
                console.log("No chat history available")
            } else {
                console.log(data)
                data.forEach((item) => {
                    const username = item.sender_username
                    const message_id = item.message_id
                    const text = item.text
                    const timestamp = item.timestamp
                    const is_edit = item.is_edit
                    createMessageList(
                        username,
                        message_id,
                        text,
                        timestamp,
                        is_edit
                    )
                })
            }
        })
        .catch((error) => console.error("Error fetching data:", error))
}

window.onload = function () {
    getChatRooms()
}
function registerPage(buttonId) {
    var encodedButtonId = encodeURIComponent(buttonId);
    window.location.href = 'login.html?page=' + encodedButtonId;
}

let my_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzMyYWEyOTQtODA4OC00OTlkLWExNWEtOGM4NDMyMzk5Njc1Iiwicm9sZSI6ImN1c3RvbWVyIn0.4tlNJNtLJd-4W3PzlzA_Qo9J4c7YzIxFNL7H01jR1OA';
let url = 'http://127.0.0.1:8000'
// Add event listener to send button


function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i <cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Usage example
const registrationData = getCookie('userData');
console.log(registrationData); // Log the value retrieved from the cookie
if (registrationData !== '') {
    const data = JSON.parse(registrationData);
    console.log(data);
    my_token = data.token;
    // Do something with the registration data
} else {
    console.log('Registration data not found in cookie.');
}

window.onload = function () {
    getMates();
}
