const my_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZGZjNTk3ZjUtMDllMS00OTQzLTg0OWItMTFjNTdiYmNkMmE2Iiwicm9sZSI6ImN1c3RvbWVyIn0.nQXdUl5i9cgggIs-zECPMBDfr_ipWCrR7PQ6m-mGCvw";
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
            data.data.forEach((item) => {
                const picUrl = item.account_detail.pic_url;
                const accountId = item.account_detail.id;
                const displayName = item.account_detail.displayname;
                const star = item.account_detail.star;
                const amount = item.account_detail.amount;
                const rank = item.account_detail.rank;
                const gender = item.account_detail.gender;
                createRankingBox(
                    accountId,
                    username,
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
    // const leaderboard = document.getElementById("leaderboard");
    // // Create card element
    // const rankingBox = document.createElement("div");
    // rankingBox.classList.add("ranking-mate-box");
    // rankingBox.dataset.username = accountId; // Set accountId as a custom data attribute

    // // Create image element
    // const ranking = document.createElement("div");
    // ranking.classList.add("ranking");
    // ranking.textContent = rank;

    // const img = document.createElement("img");
    // img.src = picUrl;
    // img.alt = "Profile Image";

    // const name = document.createElement("div");
    // name.classList.add("mate-name");
    // name.textContent = displayName;

    // const amount = document.createElement("div");
    // amount.classList.add("mate-amount");
    // amount.textContent = amountBooked;

    // // Create card detail element
    // const cardDetail = document.createElement("div");
    // cardDetail.classList.add("card-detail");

    // // Create card detail name element
    // const cardDetailName = document.createElement("div");
    // cardDetailName.classList.add("card-detail-name");
    // cardDetailName.textContent = username;

    // const cardDetailLocation = document.createElement("div");
    // cardDetailLocation.classList.add("card-detail-location");
    // cardDetailLocation.textContent = "Bangkok";

    // // Append elements to card
    // cardDetail.appendChild(cardDetailLocation);
    // cardDetail.appendChild(cardDetailName);
    // card.appendChild(img);
    // card.appendChild(cardDetail);

    // // Add event listener to card
    // card.addEventListener("click", () => {
    //     const accountId = card.dataset.accountId;
    //     console.log("Clicked card with accountId:", accountId);
    //     // Perform GET request with accountId
    // });

    // // Append card to card list
    // cardList.appendChild(card);
}

window.onload = function () {
    registrationCookie();
};
