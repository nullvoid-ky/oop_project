const url = "http://10.66.7.125:8000";
let my_token = "";
let my_id = "";
const bookingId = new URLSearchParams(window.location.search).get("id");

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
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
    if (registrationData !== "") {
        const data = JSON.parse(registrationData);
        my_token = data.token;
        my_id = data.id;
        // Do something with the registration data
        let loginNav = document.getElementById("login");
        loginNav.style.cssText = "display: none;";
        let registerNav = document.getElementById("register");
        registerNav.style.cssText = "display: none;";
    } else {
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
        return data.data.role;
    })
    .catch((error) => {
        console.error("Error Verification respond:", error.message);
        throw error; // Re-throw the error to be caught by the caller
    });
}

async function getPayment() {
    await fetch(url + "/api/controller/get-booking-by-id/" + bookingId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.data.status === "Failed") {
            alert("ไม่พบการจอง");
            window.location.href = 'profile.html';
        }
        console.log("get-payment respond:", data);
        const bookedMate = document.getElementById("booked-mate");
        bookedMate.innerHTML = data.data.mate.username;
        const bookedTime = document.getElementById("booked-time");
        bookedTime.innerHTML = data.data.book_date;
        const bookedLocation = document.getElementById("booked-location");
        bookedLocation.innerHTML = data.data.mate.location
        const bookedPrice = document.getElementById("booked-price");
        bookedPrice.innerHTML = data.data.payment;
    })
}

async function cancleBooking() {
    await fetch(url + "/api/controller/delete-booking/" + bookingId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("cancleBooking respond:", data);
        alert("ยกเลิกการจองเรียบร้อย");
        window.location.href = 'profile.html';
    })
}

async function confirmPayment() {
    await fetch(url + "/api/controller/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        body: JSON.stringify({
            booking_id: bookingId,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("confirmPayment respond:", data);
        alert("ยืนยันการจองเรียบร้อย");
        window.location.href = 'profile.html';
    })

}

window.onload = function () {
    registrationCookie();
    verify_role(my_token)
    getPayment();
}