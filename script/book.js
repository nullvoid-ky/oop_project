const url = "http://127.0.0.1:8000";
const user_id = new URLSearchParams(window.location.search).get("id")
let my_token = "";
let my_id = "";
let selectedTime = null;
let availabilitySelectedElement = null;
let matePrice = 0;
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

async function getMateData(token) {
    const res = await fetch(url + "/api/mate/get-mate-profile/" + user_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    });

    const data = await res.json();
    console.log("getMateData: ", data);
    // console.log(data)
    const pic = document.getElementById("pic");
    pic.src = data.data.pic_url;
    const nameText = document.getElementById("name-text");
    nameText.textContent = data.data.displayname;
    const locationText = document.getElementById("location-text");
    locationText.textContent = data.data.location;
    const averageStarNum = document.getElementById("average-star-num");
    let starNum = data.data.star.toString();
    if (data.data.star == "-1.0") {
        starNum = "None";
        averageStarNum.textContent = starNum;
        starNum = 0;
    } else {
        averageStarNum.textContent = starNum;
    }
    const averageStarContainer = document.getElementById(
        "average-star-container"
    );

    for (let i = 0; i < Math.floor(starNum); i++) {
        const averageStar = document.createElement("img");
        averageStar.className = "average-star";
        averageStar.id = "average-star";
        averageStar.src = "../img/star.svg";
        averageStar.alt = "star";
        averageStarContainer.appendChild(averageStar);
    }

    for (let i = 0; i < 5 - Math.floor(starNum); i++) {
        const averageStar = document.createElement("img");
        averageStar.className = "average-star";
        averageStar.id = "average-star";
        averageStar.src = "../img/no-star.svg";
        averageStar.alt = "star";
        averageStarContainer.appendChild(averageStar);
    }
    const reviewCount = document.getElementById("review-count");
    let reviewCountText = data.data.review_count;
    reviewCount.textContent = reviewCountText + " ครั้ง";

    const rentCount = document.getElementById("rent-count");
    let rentCountText = data.data.rent_count;
    rentCount.textContent = rentCountText + " ครั้ง";

    const priceText = document.getElementById("price-text");
    matePrice = data.data.price;
    priceText.textContent = data.data.price + " บาท";
    return data;
}

async function getMateAvalability(token) {
    const res = await fetch(url + "/api/mate/get-availability/" + user_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    });
    const data = await res.json();
    const parent = document.getElementById("availability-content");
    console.log(data);
    data.data.forEach((item) => {
        const pElement = document.createElement("p");
        pElement.className = "availability-text";
        pElement.id = "availability-text";
        pElement.setAttribute("data-time", item.date);
        pElement.setAttribute("detail", item.detail);
        pElement.textContent = item.date;
        parent.appendChild(pElement);
    });

    const availabilityTextElements =
        document.querySelectorAll(".availability-text");

    // Add click event listeners to each availability text element
    availabilityTextElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // Remove the 'selected' class from all elements
            availabilityTextElements.forEach(function (el) {
                el.classList.remove("selected");
            });

            // Add the 'selected' class to the clicked element
            element.classList.add("selected");
            selectedTime = element.getAttribute("data-time");
            availabilitySelectedElement = element.getAttribute("detail");
            console.log(availabilitySelectedElement);
            console.log(selectedTime);
        });
    });
}

async function bookMate(token, mate_id) {
    const year = parseInt(selectedTime.split("-")[2]);
    const month = parseInt(selectedTime.split("-")[1]);
    const day = parseInt(selectedTime.split("-")[0]);
    console.log(year, month, day);
    const res = await fetch(url + "/api/controller/add-booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
        body: JSON.stringify({
            mate_id: mate_id,
            date: {
                year: year,
                month: month,
                day: day,
            },
        }),
    });
    const data = await res.json();
    console.log(data);
    return data;
}

async function pay(token, booking_id) {
    const res = await fetch(url + "/api/controller/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
        body: JSON.stringify({
            booking_id: booking_id,
        }),
    });
    console.log(res);
    return res;
}

async function getReview(token, mate_id) {
    const res = await fetch(url + "/api/mate/get-reviews/" + mate_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    });
    const data = await res.json();
    console.log(data);
    const reviewContent = document.getElementById("review-content");
    data.data.forEach((item) => {
        // Create the main review-box container
        const reviewBox = document.createElement("div");
        reviewBox.className = "review-box";
        reviewBox.id = "review-box";

        // Create the review-pic image element
        const reviewPic = document.createElement("img");
        reviewPic.className = "review-pic";
        reviewPic.id = "review-pic";
        reviewPic.src = item.user.pic_url; // Set the image source
        reviewPic.alt = "user";

        // Create the review-detail container
        const reviewDetail = document.createElement("div");
        reviewDetail.className = "review-detail";
        reviewDetail.id = "review-detail";

        const reviewName = document.createElement("p");
        reviewName.className = "review-name";
        reviewName.id = "review-name";
        reviewName.textContent = item.user.username; // Set the review name

        // Create the review-time-text paragraph
        const reviewTimeText = document.createElement("p");
        reviewTimeText.className = "review-time-text";
        reviewTimeText.id = "review-time-text";
        reviewTimeText.textContent = item.timestamp; // Set the review timestamp

        // Create the review-star-container div
        const reviewStarContainer = document.createElement("div");
        reviewStarContainer.className = "review-star-container";
        reviewStarContainer.id = "review-star-container";

        // Create and append 5 review-star images to the review-star-container
        for (let i = 0; i < Math.floor(item.star); i++) {
            const reviewStar = document.createElement("img");
            reviewStar.className = "review-star";
            reviewStar.id = "review-star";
            reviewStar.src = "../img/star.svg"; // Set the star image source
            reviewStar.alt = "star";
            reviewStarContainer.appendChild(reviewStar);
        }

        for (let i = 0; i < 5 - Math.floor(item.star); i++) {
            const reviewStar = document.createElement("img");
            reviewStar.className = "review-star";
            reviewStar.id = "review-star";
            reviewStar.src = "../img/no-star.svg"; // Set the star image source
            reviewStar.alt = "star";
            reviewStarContainer.appendChild(reviewStar);
        }

        // Create the review-message paragraph
        const reviewMessage = document.createElement("p");
        reviewMessage.className = "review-message";
        reviewMessage.id = "review-message";
        reviewMessage.textContent = item.message; // Set the review message (assuming it's the star rating)

        // Append all elements to their respective parent elements
        reviewDetail.appendChild(reviewName);
        reviewDetail.appendChild(reviewTimeText);
        reviewDetail.appendChild(reviewStarContainer);
        reviewDetail.appendChild(reviewMessage);

        reviewBox.appendChild(reviewPic);
        reviewBox.appendChild(reviewDetail);
        reviewContent.appendChild(reviewBox);
    });
    return data;
}
document.addEventListener("DOMContentLoaded", function () {
    const availabilityTextElements =
        document.querySelectorAll(".availability-text");
    const bookButton = document.getElementById("book-btn");

    // Add click event listeners to each availability text element
    availabilityTextElements.forEach(function (element) {
        element.addEventListener("click", function () {
            // Remove the 'selected' class from all elements
            availabilityTextElements.forEach(function (el) {
                el.classList.remove("selected");
            });

            // Add the 'selected' class to the clicked element
            element.classList.add("selected");
            availabilitySelectedElement = element;
            console.log(availabilitySelectedElement.getAttribute("detail"));
            selectedTime = element.getAttribute("data-time");
        });
    });

    bookButton.addEventListener("click", async function () {
        if (selectedTime !== null) {
            // Perform actions for the selected time (e.g., submit data)
            alert(availabilitySelectedElement);
            let ans = prompt(
                `คุณต้องการชำระค่ามัดจำเลยหรือไม่\n${
                    matePrice / 2
                }\ny : รับทราบและชำระ\nn : ยกเลิกการจ่าย`
            );
            if (ans == "y") {
                bookMate(my_token, user_id);
                alert("Successfully paid");
                console.log("Booking for time:", selectedTime);
                bookMate(my_token, user_id);
                window.location.href = "booking.html";
            } else if (ans == "n") {
                alert("ยกเลิกการจ่าย ยังไม่ได้จองเมท");
            } else {
                alert("กรุณากรอกให้ถูกต้อง\nhint : 'y' or 'n'");
            }
            // Add your logic here to submit the data or perform other actions
        } else {
            console.log("Please select a time before booking.");
        }
    });
});

registrationCookie();
getMateData(my_token);
getReview(my_token, user_id);
getMateAvalability(my_token);
