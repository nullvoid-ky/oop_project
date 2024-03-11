let my_token = "";
let my_id = "";
let url = "http://127.0.0.1:8000";

function getTopMates() {
    // Clear previous values
    const cardList = document.getElementById("leaderboard");
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
            console.log("Get leaderboard: ", data);
            data.data.forEach((item) => {
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                const displayName = item.account_detail.displayname;
                const star = item.account_detail.star;
                const amount = item.account_detail.rent_count;
                const rank = item.account_detail.rank;
                const gender = item.account_detail.gender;
                createRankingBox(
                    accountId,
                    displayName,
                    picUrl,
                    star,
                    amount,
                    gender,
                    rank
                );
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
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
function createRankingBox(
    accountId,
    displayName,
    picUrl,
    star,
    amountBooked,
    gender,
    rank
) {
    const leaderboard = document.getElementById("leaderboard");
    // Create card element
    const rankingBox = document.createElement("div");
    rankingBox.classList.add("ranking-mate-box");
    rankingBox.dataset.accountId = accountId; // Set accountId as a custom data attribute

    // Create image element
    const ranking = document.createElement("div");
    ranking.classList.add("ranking");
    ranking.textContent = rank;

    const ratingBox = document.createElement("div");
    ratingBox.classList.add("average-star-box");

    const cardDetailRating = document.createElement("div");
    cardDetailRating.classList.add("average-star-num");
    cardDetailRating.textContent = star.toString();

    // Create star rating element
    const starRatingContainer = document.createElement("div");
    starRatingContainer.classList.add("star-rating-container");

    const numStars = Math.floor(star); // Get the integer part of the star
    for (let i = 0; i < numStars; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/star.svg";
        starImg.alt = "star";
        starRatingContainer.appendChild(starImg);
    }

    const numEmptyStars = 5 - Math.floor(star); // Get the integer part of the rating
    for (let i = 0; i < numEmptyStars; i++) {
        const starImg = document.createElement("img");
        starImg.className = "average-star";
        starImg.src = "../img/no-star.svg";
        starImg.alt = "star";
        starRatingContainer.appendChild(starImg);
    }

    ratingBox.appendChild(starRatingContainer);
    ratingBox.appendChild(cardDetailRating);

    const img = document.createElement("img");
    img.src = picUrl;
    img.alt = "Profile Image";

    const name = document.createElement("div");
    name.classList.add("mate-name");
    name.textContent = displayName;

    const amount = document.createElement("div");
    amount.classList.add("mate-amount");
    amount.textContent = amountBooked;

    const genderElement = document.createElement("div");
    genderElement.classList.add("mate-gender");
    genderElement.textContent = gender;

    rankingBox.appendChild(ranking);
    rankingBox.appendChild(ratingBox);
    rankingBox.appendChild(img);
    rankingBox.appendChild(name);
    rankingBox.appendChild(amount);
    rankingBox.appendChild(genderElement);

    // Add event listener to card
    rankingBox.addEventListener("click", () => {
        const accountId = rankingBox.dataset.accountId;
        console.log("Clicked card with accountId:", accountId);
        window.location.href = 'book.html?id=' + accountId;
        // Perform GET request with accountId
    });

    // Append card to card list
    leaderboard.appendChild(rankingBox);
}

window.onload = function () {
    registrationCookie();
    getTopMates();
};
