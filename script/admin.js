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
    let list = [
        ["Username", username],
        ["Display Name", displayName],
        ["Gender", gender],
        ["Location", location],
        ["Account Created", timestamp],
    ];
    const cardList = document.getElementById("card-list-customer");
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.accountId = accountId; // Set accountId as a custom data attribute
    const img = document.createElement("img");
    img.src = picUrl;
    img.alt = "Profile Image";
    const cardDetail = document.createElement("li");
    cardDetail.classList.add("card-detail");
    for (let i = 0; i < list.length; i++) {
        const cardDetailElement = document.createElement("ul");
        cardDetailElement.classList.add("card-item-detail");
        cardDetailElement.textContent = list[i][0] + " : " + list[i][1];
        cardDetail.appendChild(cardDetailElement);
    }
    card.appendChild(img);
    card.appendChild(cardDetail);
    // card.addEventListener("click", () => {
    //     const accountId = card.dataset.accountId;
    //     console.log("Clicked card with accountId:", accountId);
    // });
    cardList.appendChild(card);
}

function getMates() {
    const cardList = document.getElementById("card-list-mate");
    cardList.innerHTML = "";
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
            const transactionList = document.getElementById(
                "card-list-transaction"
            );
            data.data.forEach((transaction) => {
                // Assuming you have a parent element with id "transaction-list" where you want to append the transaction item

                // Create the transaction item container
                const transactionItem = document.createElement("div");
                transactionItem.classList.add("card", "row");

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
            console.log("book: ", data);
            // useEffect("card-list-transaction");
            const parent = document.getElementById("card-list-booking");
            data.data.forEach((item) => {

                list = [
                    ["booking-mate-name", item.mate.displayname],
                    ["booking-age", item.mate.age],
                    ["payment", item.payment],
                    ["book-date", item.book_date],
                    ["Location", item.mate.location],
                    ["customer", item.customer.displayname],
                    ["status", item.status],
                ]
                const cardList = document.getElementById("card-list-customer");
                const card = document.createElement("div");
                card.classList.add("card");
                // card.dataset.accountId = accountId; // Set accountId as a custom data attribute
                const img = document.createElement("img");
                img.src = item.customer.pic_url;
                img.alt = "Profile Image";
                const cardDetail = document.createElement("li");
                cardDetail.classList.add("card-detail");
                for (let i = 0; i < list.length; i++) {
                    const cardDetailElement = document.createElement("ul");
                    cardDetailElement.classList.add("card-item-detail");
                    cardDetailElement.textContent = list[i][0] + " : " + list[i][1];
                    cardDetail.appendChild(cardDetailElement);
                }
                card.appendChild(img);
                card.appendChild(cardDetail);
                // card.addEventListener("click", () => {
                //     const accountId = card.dataset.accountId;
                //     console.log("Clicked card with accountId:", accountId);
                // });
                parent.appendChild(card);
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
            console.log("log: ", data);
            // useEffect("card-list-transaction");
            const parent = document.getElementById("card-list-log");
            data.data.forEach((item) => {
                list = [
                    ["Actor:", item.actor && item.actor.username ? item.actor.username: "-"],
                    ["age", item.actor && item.actor.age ? item.actor.age : "-" + " ปี"],
                    ["Receiver", item.mate && item.mate.username ? item.mate.username: "-"],
                    ["age", item.mate && item.mate.age ? item.mate.age : "-" + " ปี"],
                    ["action: ", item.action],
                    ["item ", item.item],
                    ["msg ", item.msg],
                ]

                const cardList = document.getElementById("card-list-customer");
                const card = document.createElement("div");
                card.classList.add("card");
                // card.dataset.accountId = accountId; // Set accountId as a custom data attribute
                const img = document.createElement("img");
                img.src = item.actor.pic_url;
                img.alt = "Profile Image";
                const cardDetail = document.createElement("li");
                cardDetail.classList.add("card-detail");
                for (let i = 0; i < list.length; i++) {
                    const cardDetailElement = document.createElement("ul");
                    cardDetailElement.classList.add("card-item-detail");
                    cardDetailElement.textContent = list[i][0] + " : " + list[i][1];
                    cardDetail.appendChild(cardDetailElement);
                }
                card.appendChild(img);
                card.appendChild(cardDetail);
                // card.addEventListener("click", () => {
                //     const accountId = card.dataset.accountId;
                //     console.log("Clicked card with accountId:", accountId);
                // });
                parent.appendChild(card);
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

function verify_role(token) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    };

    // Return the fetch call directly to chain promises
    return fetch(url + "/api/controller/get-self-profile", requestOptions)
        .then((response) => {
            console.log("get-user-profile ", response);
            if (response.status === 200) {
                return response.json(); // If status is 200, parse response JSON
            } else {
                alert("Verification error");
                throw new Error("Verification error"); // For other statuses, throw unexpected error
            }
        })
        .then((data) => {
            // Handle success response
            console.log("Verification respond:", data);
            return data.data.role;
        })
        .catch((error) => {
            console.error("Error Verification respond:", error.message);
            throw error; // Re-throw the error to be caught by the caller
        });
}

window.onload = function () {
    registrationCookie();

    verify_role(my_token)
    .then((role) => {
        // Use the role value here
        if (role == "customer" || role == "mate") {
            alert("ฮันแน่~~~")
            setTimeout(function () {
                window.location.href = "index.html"; // Redirect to success page
            }, 100);
        } else if (role == 'admin'){
            getMates();
            getCustomer();
            getTransactionHistory();
            getBooking();
            getLog();
        }

    })
    .catch((error) => {
        console.error("Error verifying role:", error.message);
    });


};
