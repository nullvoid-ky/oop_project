let my_token = "";
let my_id = "";
let url = "http://127.0.0.1:8000";
// let url = 'http://10.66.4.108:8000'

function getCustomer() {
    // Clear previous values
    const cardList = document.getElementById("card-list-customer");
    cardList.innerHTML = "";

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        // body: JSON.stringify(requestBody)
    };

    fetch(url + "/api/controller/get-customers", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data);
            data.data.forEach((item) => {
                const username = item.account_detail.username;
                const displayName = item.account_detail.displayname;
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                const gender = item.account_detail.gender;
                const location = item.account_detail.location;
                const timestamp = item.account_detail.timestamp;
                createCardCustomer(
                    username,
                    displayName,
                    picUrl,
                    accountId,
                    gender,
                    location,
                    timestamp
                );
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createCardCustomer(
    username,
    displayName,
    picUrl,
    accountId,
    gender,
    location,
    timestamp
) {
    const cardList = document.getElementById("card-list-customer");

    // Create card element
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.accountId = accountId; // Set accountId as a custom data attribute

    // Create image element
    const img = document.createElement("img");
    img.src = picUrl;
    img.alt = "Profile Image";

    // Create card detail element
    const cardDetail = document.createElement("div");
    cardDetail.classList.add("card-detail");

    // Create card detail name element
    const cardDetailName = document.createElement("div");
    cardDetailName.classList.add("card-detail-name");
    cardDetailName.textContent = username;

    // Create card detail location element
    const cardDetailLocation = document.createElement("div");
    cardDetailLocation.classList.add("card-detail-location");
    cardDetailLocation.textContent = "Bangkok";

    // Append elements to card
    cardDetail.appendChild(cardDetailLocation);
    cardDetail.appendChild(cardDetailName);
    card.appendChild(img);
    card.appendChild(cardDetail);

    // Add event listener to card
    card.addEventListener("click", () => {
        const accountId = card.dataset.accountId;
        console.log("Clicked card with accountId:", accountId);
    });

    // Append card to card list
    cardList.appendChild(card);
}

function getMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list-mate");
    cardList.innerHTML = "";

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        // body: JSON.stringify(requestBody)
    };

    fetch(url + "/api/controller/get-mates", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data);
            data.data.forEach((item) => {
                const username = item.account_detail.username;
                const displayName = item.account_detail.displayname;
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                const rating = item.account_detail.star;
                createCardRating(displayName, picUrl, accountId, rating);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createCardRating(display_name, picUrl, accountId, rating) {
    const cardList = document.getElementById("card-list-mate");

    // Create card element
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.accountId = accountId; // Set accountId as a custom data attribute

    // Create image element
    const img = document.createElement("img");
    img.src = picUrl;
    img.alt = "Profile Image";

    // Create card detail element
    const cardDetail = document.createElement("div");
    cardDetail.classList.add("card-detail");

    // Create card detail name element
    const cardDetailName = document.createElement("div");
    cardDetailName.classList.add("card-detail-name");
    cardDetailName.textContent = display_name;

    // Create card detail location element
    const cardDetailLocation = document.createElement("div");
    cardDetailLocation.classList.add("card-detail-location");
    cardDetailLocation.textContent = "Bangkok";

    const ratingBox = document.createElement("div");
    ratingBox.classList.add("average-star-box");

    const cardDetailRating = document.createElement("div");
    cardDetailRating.classList.add("average-star-num");
    let ratingSrting = rating.toString();
    if (ratingSrting == "-1.0") {
        ratingSrting = "None";
        rating = 0;
    }
    cardDetailRating.textContent = ratingSrting;

    // Create star rating element
    const starRatingContainer = document.createElement("div");
    starRatingContainer.classList.add("star-rating-container");

    const numStars = Math.floor(rating); // Get the integer part of the rating
    for (let i = 0; i < numStars; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/star.svg";
        starImg.alt = "star";
        starRatingContainer.appendChild(starImg);
    }

    const numEmptyStars = 5 - Math.floor(rating); // Get the integer part of the rating
    for (let i = 0; i < numEmptyStars; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/no-star.svg";
        starImg.alt = "star";
        starRatingContainer.appendChild(starImg);
    }

    ratingBox.appendChild(starRatingContainer);
    ratingBox.appendChild(cardDetailRating);

    // Append elements to card
    cardDetail.appendChild(cardDetailLocation);
    cardDetail.appendChild(cardDetailName);
    card.appendChild(img);
    card.appendChild(cardDetail);
    card.appendChild(ratingBox); // Append star rating container

    // Add event listener to card
    card.addEventListener("click", () => {
        const accountId = card.dataset.accountId;
        console.log("Clicked card with accountId:", accountId);
        localStorage.setItem("book-mate-id", accountId);
        document.location.href = "book.html";
        // Perform GET request with accountId
    });

    // Append card to card list
    cardList.appendChild(card);
}

function getTransactionHistory() {
    fetch(url + "/api/controller/get-transaction-by-admin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Transaction history:", data.data);
            const transactionList = document.getElementById("card-list-transaction");
            data.data.forEach((transaction) => {
                // Assuming you have a parent element with id "transaction-list" where you want to append the transaction item

                // Create the transaction item container
                const transactionItem = document.createElement("div");
                transactionItem.classList.add("transaction-item", "row");

                // Create the transaction image element
                const imgElement = document.createElement("img");
                imgElement.src = transaction.recipient.pic_url; // Set the src attribute to the actual image URL
                imgElement.alt = transaction.recipient.pic_url;

                // Create the transaction detail container
                const transactionDetail = document.createElement("div");
                transactionDetail.classList.add("transaction-detail");

                // Create the transaction topic element
                const topicElement = document.createElement("h2");
                topicElement.classList.add("transaction-topic");
                topicElement.textContent = `From ${transaction.sender.username} to ${transaction.recipient.username}`; // Set the text content to the desired topic

                // Create the transaction type and receiver elements
                const typeElement = document.createElement("span");
                typeElement.classList.add("transaction-type", "bolded");
                typeElement.textContent = transaction.timestamp;

                const receiverElement = document.createElement("span");
                receiverElement.classList.add("transaction-receiver");
                // receiverElement.textContent = "Nana";

                // Create the transaction amount element
                const amountElement = document.createElement("div");
                amountElement.classList.add("transaction-amount");
                amountElement.textContent = `${transaction.amount} บาท`; // Set the text content to the desired amount

                // Append the elements to the transaction detail container
                transactionDetail.appendChild(topicElement);
                transactionDetail.appendChild(document.createTextNode(" "));
                transactionDetail.appendChild(typeElement);
                transactionDetail.appendChild(document.createTextNode(" "));
                transactionDetail.appendChild(receiverElement);
                transactionDetail.appendChild(amountElement);

                // Append the image and transaction detail to the transaction item container
                transactionItem.appendChild(imgElement);
                transactionItem.appendChild(transactionDetail);

                // Append the transaction item to the transaction list
                transactionList.appendChild(transactionItem);
            });
        });
}

async function getBooking() {
    await fetch(url + "/api/controller/get-booking-by-admin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("book: ", data)
            // useEffect("card-list-transaction");
            const parent = document.getElementById("card-list-booking");
            data.data.forEach((item) => {

                const bookingElement = document.createElement("div");
                bookingElement.classList.add("booking-column-element");

                // Create booking profile
                const bookingProfile = document.createElement("div");
                bookingProfile.classList.add("booking-profile");

                // Create image element
                const imageElement = document.createElement("img");
                imageElement.classList.add("booking-pic");
                imageElement.src = item.mate.pic_url; // Set the image source

                // Create booking mate detail
                const bookingMateDetail = document.createElement("div");
                bookingMateDetail.classList.add("booking-mate-detail");

                // Create name element
                const nameElement = document.createElement("span");
                nameElement.classList.add("booking-text", "booking-name");
                nameElement.textContent = item.mate.username;

                // Create age element
                const ageElement = document.createElement("span");
                ageElement.classList.add("booking-text", "booking-age");
                ageElement.textContent = item.mate.age + " ปี";

                // Append name and age to booking mate detail
                bookingMateDetail.appendChild(nameElement);
                bookingMateDetail.appendChild(ageElement);

                // Append image and booking mate detail to booking profile
                bookingProfile.appendChild(imageElement);
                bookingProfile.appendChild(bookingMateDetail);

                // Create booking info
                const bookingInfo = document.createElement("div");
                bookingInfo.classList.add("booking-info");

                // Create price element
                const priceElement = document.createElement("h3");
                priceElement.textContent = "ราคา: " + item.payment + " บาท";

                // Create date element
                const dateElement = document.createElement("h3");
                dateElement.textContent = "วันจอง: " + item.book_date;

                // Create address element
                const addressElement = document.createElement("h3");
                addressElement.textContent = "สถานที่: " + item.mate.location;

                const customerElement = document.createElement("h3");
                customerElement.textContent = "ผู้จอง: "+ item.customer.displayname;

                const statusElement = document.createElement("h3");
                statusElement.textContent = "สถานะ: "+ item.is_success;

            
                // Append elements to booking info
                bookingInfo.appendChild(priceElement);
                bookingInfo.appendChild(dateElement);
                bookingInfo.appendChild(addressElement);
                bookingInfo.appendChild(customerElement);
                bookingInfo.appendChild(statusElement);

                // Append booking profile and booking info to booking element
                bookingElement.appendChild(bookingProfile);
                bookingElement.appendChild(bookingInfo);
                parent.appendChild(bookingElement);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

async function getLog() {
    await fetch(url + "/api/controller/get-logs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("log: ", data)
            // useEffect("card-list-transaction");
            const parent = document.getElementById("card-list-log");
            data.data.forEach((item) => {

                const logElement = document.createElement("div");
                logElement.classList.add("log-column-element");

                // Create log profile
                const logProfile = document.createElement("div");
                logProfile.classList.add("log-profile");

                // Create image element
                const imageElement = document.createElement("img");
                imageElement.classList.add("log-pic");
                imageElement.src = item.actor && item.actor.pic_url ? item.actor.pic_url : "../img/customer_male.svg"; // Set the image source

                // Create log mate detail
                const logMateDetail = document.createElement("div");
                logMateDetail.classList.add("log-mate-detail");

                // Create name element
                const nameElement = document.createElement("span");
                nameElement.classList.add("log-text", "log-name");
                nameElement.textContent = "Actor: " + (item.actor && item.actor.username ? item.actor.username : "-");

                // Create age element
                const ageElement = document.createElement("span");
                ageElement.classList.add("log-text", "log-age");
                ageElement.textContent = item.actor && item.actor.age ? item.actor.age : "-" + " ปี";

                // Append name and age to log mate detail
                logMateDetail.appendChild(nameElement);
                logMateDetail.appendChild(ageElement);

                const logMateDetail2 = document.createElement("div");
                logMateDetail2.classList.add("log-mate-detail");

                // Create name element
                const nameElement2 = document.createElement("span");
                nameElement2.classList.add("log-text", "log-name");
                nameElement2.textContent = "Receiver: " + (item.actor && item.actor.username ? item.actor.username : "-");

                // Create age element
                const ageElement2 = document.createElement("span");
                ageElement2.classList.add("log-text", "log-age");
                ageElement2.textContent = item.actor && item.actor.age ? item.actor.age : "-" + " ปี";

                // Append name and age to log mate detail
                logMateDetail2.appendChild(nameElement2);
                logMateDetail2.appendChild(ageElement2);

                // Append image and log mate detail to log profile
                logProfile.appendChild(imageElement);
                logProfile.appendChild(logMateDetail);
                logProfile.appendChild(logMateDetail2);

                // Create log info
                const logInfo = document.createElement("div");
                logInfo.classList.add("log-info");

                // Create price element
                const actionElement = document.createElement("h3");
                actionElement.textContent = item.action;

                const itemElement = document.createElement("h3");
                itemElement.textContent = "item: "+ item.item;

                const msgElement = document.createElement("h3");
                msgElement.textContent = "msg: "+ item.msg;

            
                // Append elements to log info
                logInfo.appendChild(actionElement);


                // Append log profile and log info to log element
                logElement.appendChild(logProfile);
                logElement.appendChild(logInfo);
                logElement.appendChild(itemElement);
                logElement.appendChild(msgElement);
                parent.appendChild(logElement);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function registerPage(buttonId) {
    var encodedButtonId = encodeURIComponent(buttonId);
    window.location.href = "login.html?buttonId=" + encodedButtonId; // passing value
}

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

// Usage example
function registrationCookie() {
    const registrationData = getCookie("userData");
    console.log(registrationData); // Log the value retrieved from the cookie
    if (registrationData !== "") {
        const data = JSON.parse(registrationData);
        console.log(data);
        my_token = data.token;
        my_id = data.id;
    } else {
        console.log("Registration data not found in cookie.");
    }
}

function logOut() {
    document.cookie =
        "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.href = "login.html";
}
function useEffect(elementId) {
    const parent = document.getElementById(elementId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
window.onload = function () {
    registrationCookie();
    getMates();
    getCustomer();
    getTransactionHistory()
    getBooking()
    getLog()
};
