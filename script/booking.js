const url = "http://127.0.0.1:8000";
let valid = false;
let my_id = "";
let my_token = "";
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

async function delBookingByID(button) {
    const id = button.getAttribute("uuid");
    await fetch(url + `/api/controller/delete-booking/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    useEffect("booking-element");
    getBooking();
}

function useEffect(elementId) {
    const parent = document.getElementById(elementId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function searchMates() {
    const value = document.getElementById("mate-name").value;
    useEffect("booking-element");
    const res = await fetch(url + `/api/controller/get-booking`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    });
    const data = await res.json();
    const parent = document.getElementById("booking-element");
    data.data.forEach((item) => {
        console.log(item.mate.username);
        if (item.mate.username === value && item.is_success) {
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
            priceElement.textContent = item.payment + " บาท";

            // Create date element
            const dateElement = document.createElement("h3");
            dateElement.textContent = "วันที่ " + item.timestamp;

            // Create address element
            const addressElement = document.createElement("h3");
            addressElement.textContent = item.mate.location;

            // Create delete button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add(
                "booking-button",
                "red",
                "pink-btn",
                "input-search",
                "search-template"
            );
            deleteButton.textContent = "ลบ";
            deleteButton.setAttribute("onclick", "delBookingByID(this)"); // Add onclick event
            deleteButton.setAttribute("uuid", item.id);

            // Create add button
            const addButton = document.createElement("button");
            addButton.classList.add(
                "booking-button",
                "pink-btn",
                "input-search",
                "search-template"
            );
            addButton.textContent = "เพิ่ม";
            // addButton.onclick = getMates; // Add onclick event

            // Append elements to booking info
            bookingInfo.appendChild(priceElement);
            bookingInfo.appendChild(dateElement);
            bookingInfo.appendChild(addressElement);
            bookingInfo.appendChild(deleteButton);
            bookingInfo.appendChild(addButton);

            // Append booking profile and booking info to booking element
            bookingElement.appendChild(bookingProfile);
            bookingElement.appendChild(bookingInfo);
            parent.appendChild(bookingElement);
        }
    });
    // console.log(data)
}

async function getBooking() {
    await fetch(url + "/api/controller/get-booking", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            useEffect("booking-element");
            const parent = document.getElementById("booking-element");
            data.data.forEach((item) => {
                if (!item.is_success) {
                    return;
                }
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
                priceElement.textContent = item.payment + " บาท";

                // Create date element
                const dateElement = document.createElement("h3");
                dateElement.textContent = item.book_date;

                // Create address element
                const addressElement = document.createElement("h3");
                addressElement.textContent = item.mate.location;

                // Create delete button
                const deleteButton = document.createElement("button");
                deleteButton.classList.add(
                    "booking-button",
                    "red",
                    "pink-btn",
                    "input-search",
                    "search-template"
                );
                deleteButton.textContent = "ลบ";
                deleteButton.setAttribute("onclick", "delBookingByID(this)"); // Add onclick event
                deleteButton.setAttribute("uuid", item.id);

                // Create add button
                const addButton = document.createElement("button");
                addButton.classList.add(
                    "booking-button",
                    "pink-btn",
                    "input-search",
                    "search-template"
                );
                addButton.textContent = "เพิ่ม";
                // addButton.onclick = getMates; // Add onclick event

                // Append elements to booking info
                bookingInfo.appendChild(priceElement);
                bookingInfo.appendChild(dateElement);
                bookingInfo.appendChild(addressElement);
                bookingInfo.appendChild(deleteButton);
                bookingInfo.appendChild(addButton);

                // Append booking profile and booking info to booking element
                bookingElement.appendChild(bookingProfile);
                bookingElement.appendChild(bookingInfo);
                parent.appendChild(bookingElement);
            });
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function registerPage(buttonId) {
    const encodedButtonId = encodeURIComponent(buttonId);
    window.location.href = "login.html?buttonId=" + encodedButtonId;
}

window.onload = function () {
    registrationCookie();
    verify_role(my_token);
    getCookie("userData");
    getBooking();
};

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
