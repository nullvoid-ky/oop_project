let my_token = ""
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
                createCardCustomer(username, displayName, picUrl, accountId, gender, location, timestamp);
        });
    })
    .catch((error) => console.error("Error fetching data:", error));

}

function createCardCustomer(username, displayName, picUrl, accountId, gender, location, timestamp) {
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

function createCardRating(username, picUrl, accountId, rating) {
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
    cardDetailName.textContent = username;

    // Create card detail location element
    const cardDetailLocation = document.createElement("div");
    cardDetailLocation.classList.add("card-detail-location");
    cardDetailLocation.textContent = "Bangkok";

    const ratingBox = document.createElement("div");
    ratingBox.classList.add("average-star-box");

    const cardDetailRating = document.createElement("div");
    cardDetailRating.classList.add("average-star-num");
    cardDetailRating.textContent = rating.toString();

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
        // Do something with the registration data
        let loginNav = document.getElementById("login");
        loginNav.style.cssText = "display: none;";
        let registerNav = document.getElementById("register");
        registerNav.style.cssText = "display: none;";
    } else {
        console.log("Registration data not found in cookie.");
        let progileNav = document.getElementById("profile");
        progileNav.style.cssText = "display: none;";
    }
}

window.onload = function () {
    registrationCookie();
    getMates();
    getCustomer()
};