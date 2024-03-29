let my_token = "";
let my_id = "";
let url = "http://127.0.0.1:8000";
// let url = 'http://10.66.4.108:8000'

function createCard(username, picUrl, accountId) {
    const cardList = document.getElementById("card-list");

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
        // Perform GET request with accountId
    });

    // Append card to card list
    cardList.appendChild(card);
}

function getMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list");
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
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                createCard(username, picUrl, accountId);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function getTopMateLeaderboard() {
    // Clear previous values
    const cardList = document.getElementById("card-list");
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

    fetch(url + "/api/controller/get-leaderboard", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data);
            let count = 0; // Counter variable to track the number of iterations
            data.data.forEach((item) => {
                if (count < 4) {
                    const username = item.account_detail.username;
                    const displayName = item.account_detail.displayname;
                    const picUrl = item.account_detail.pic_url;
                    const accountId = item.account_detail.id;
                    const rating = item.account_detail.star;
                    const location = item.account_detail.location;
                    console.log(item.account_detail.star);
                    // createCard(displayname, picUrl, accountId)
                    createCardRating(
                        displayName,
                        picUrl,
                        accountId,
                        rating,
                        location
                    );
                    count++; // Increment the counter after each iteration
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function createCardRating(username, picUrl, accountId, rating, location) {
    const cardList = document.getElementById("card-list");

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
    cardDetailLocation.textContent = location;

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
        document.location.href = "book.html?id="+accountId;
        // Perform GET request with accountId
    });

    // Append card to card list
    cardList.appendChild(card);
}

function generateStars(rating) {
    const container = document.getElementById("average-star-container");
    container.innerHTML = ""; // Clear existing stars

    const numStars = Math.floor(rating); // Get the integer part of the rating
    for (let i = 0; i < numStars; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/star.svg";
        starImg.alt = "star";
        container.appendChild(starImg);
    }
    const numNoStar = 5 - numStars;
    for (let i = 0; i < numNoStar; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/no-star.svg";
        starImg.alt = "star";
        container.appendChild(starImg);
    }
}

function searchMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list");
    cardList.innerHTML = "";

    const nameText = document.getElementById("mate-name").value;
    const locationText = document.getElementById("mate-location").value;
    const ageText = document.getElementById("quantity").value;

    var genderValues = []; // Initialize an empty array to store gender values

    // Get all checkboxes with name 'gender'
    var checkboxes = document.querySelectorAll(
        '.input-gender input[type="checkbox"][name="gender"]'
    );

    // Iterate over each checkbox
    checkboxes.forEach(function (checkbox) {
        // If the checkbox is checked, append its value (male or female) to the genderValues array
        if (checkbox.checked) {
            genderValues.push(checkbox.value);
        }
    });

    var availabilityValue = document.querySelector(
        '.input-availability input[type="checkbox"][name="availability"]'
    ).checked;

    const urlSearchParams = new URLSearchParams({
        name: nameText,
        location: locationText,
        gender_list: JSON.stringify(genderValues),
        age: ageText,
        availability: availabilityValue,
    });
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        }
    };
    
    fetch(url + "/api/controller/search-mate-by-condition?" + urlSearchParams, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data);
            data.data.forEach((item) => {
                const username = item.account_detail.username;
                const displayName = item.account_detail.displayname;
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                const rating = item.account_detail.star;
                const location = item.account_detail.location;
                console.log(item.account_detail.star);
                // createCard(displayname, picUrl, accountId)
                createCardRating(
                    displayName,
                    picUrl,
                    accountId,
                    rating,
                    location
                );
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

window.onload = function () {
    registrationCookie();
    addEnterSearch();
    if (window.location.pathname.includes("index.html")) {
        clearLocalStorage();
        updateValue();
        // getMates();
        getTopMateLeaderboard();
        console.log("You are on index.html");
    } else {
        console.log("You are not mate.html");
        updateValue();
        searchMates();
    }
};

function goToMate() {
    window.location.href = "mate.html";
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

function clearLocalStorage() {
    // localStorage.clear();
    // console.log("Local storage cleared.");
    localStorage.setItem("mate-name", "");
    localStorage.setItem("mate-location", "");
    localStorage.setItem("quantity", 18);
}

function syncGender() {
    var selectedGenders = [];
    var checkboxes = document.querySelectorAll(
        '.input-gender input[type="checkbox"]:checked'
    );
    checkboxes.forEach(function (checkbox) {
        selectedGenders.push(checkbox.value);
    });
    console.log(selectedGenders);
    localStorage.setItem("selectedGenders", JSON.stringify(selectedGenders));
}

function syncAvailability() {
    var selectedAvailabilitys = [];
    var checkboxes = document.querySelectorAll(
        '.input-availability input[type="checkbox"]:checked'
    );
    checkboxes.forEach(function (checkbox) {
        selectedAvailabilitys.push(checkbox.value);
    });
    console.log(selectedAvailabilitys);
    localStorage.setItem(
        "selectedAvailability",
        JSON.stringify(selectedAvailabilitys)
    );
}

function syncValue() {
    console.log(document.getElementById("mate-name").value);
    localStorage.setItem(
        "mate-name",
        document.getElementById("mate-name").value
    );
    localStorage.setItem(
        "mate-location",
        document.getElementById("mate-location").value
    );
    localStorage.setItem("quantity", document.getElementById("quantity").value);

    syncGender();
    syncAvailability();
}

function updateValue() {
    document.getElementById("mate-name").value =
        localStorage.getItem("mate-name");
    document.getElementById("mate-location").value =
        localStorage.getItem("mate-location");
    document.getElementById("quantity").value =
        localStorage.getItem("quantity");
    var storedGenders = localStorage.getItem("selectedGenders");
    if (storedGenders) {
        storedGenders = JSON.parse(storedGenders);
        var checkboxes = document.querySelectorAll(
            '.input-gender input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
            if (storedGenders.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }

    var storedAvailablility = localStorage.getItem("selectedAvailability");
    if (storedAvailablility) {
        storedAvailablility = JSON.parse(storedAvailablility);
        var checkboxes = document.querySelectorAll(
            '.input-availability input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
            if (storedAvailablility.includes(checkbox.value)) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
        });
    }
}

function addEnterSearch() {
    var enterMessage = document.getElementById("mate-name");
    enterMessage.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("search-btn").click();
            enterMessage.innerText = "";
            window.location.href = "mate.html";
        }
    });

    var enterMessage = document.getElementById("mate-location");
    enterMessage.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("search-btn").click();
            enterMessage.innerText = "";
            window.location.href = "mate.html";
        }
    });

    var enterMessage = document.getElementById("quantity");
    enterMessage.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("search-btn").click();
            enterMessage.innerText = "";
            window.location.href = "mate.html";
        }
    });
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
                window.location.href = "login.html";
                throw new Error("Verification error"); // For other statuses, throw unexpected error
            }
        })
        .then((data) => {
            if (data.hasOwnProperty("status_code")) {
                if (data.status_code == 404) {
                    alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
                    window.location.href = "login.html";
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
