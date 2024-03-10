const url = "http://127.0.0.1:8000"
let valid = false
let my_id = ''
let my_token = ''
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
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
function registrationCookie(){
    const registrationData = getCookie('userData');
    console.log(registrationData); // Log the value retrieved from the cookie
    if (registrationData !== '') {
        const data = JSON.parse(registrationData);
        console.log(data);
        my_token = data.token;
        my_id = data.id
        // Do something with the registration data
        let loginNav = document.getElementById('login');
        loginNav.style.cssText = "display: none;"
        let registerNav = document.getElementById('register');
        registerNav.style.cssText = "display: none;"
    } else {
        console.log('Registration data not found in cookie.');
        let progileNav = document.getElementById('profile');
        progileNav.style.cssText = "display: none;"
    }
        
}

async function delBooking(token, id) {
    await fetch(url + `/api/controller/delete-booking/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => console.error("Error fetching data:", error))
    useEffect("booking-element")
    getBooking(token)
}

function useEffect(elementId) {
    const parent = document.getElementById(elementId)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function searchMates() {
    const value = document.getElementById("mate-name").value
    const res = await fetch(url + `/api/controller/get-booking`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
    const data = await res.json() 
    data.data.forEach((item) => {
        if (item.mate.username === value) {
            console.log(item)
        }
    })
    // console.log(data)
}

function getBooking(token) {
    fetch(url + "/api/controller/get-booking", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data)
            const parent = document.getElementById("booking-element")
            data.data.forEach((item) => {
                // Create the first checkbox and label
                const checkbox1 = document.createElement("input")
                checkbox1.type = "checkbox"
                checkbox1.id = "select-name"
                checkbox1.name = "select-name"
                checkbox1.value = "select-name"

                const label1 = document.createElement("label")
                label1.htmlFor = "select-name"
                label1.textContent = item.mate.username

                // Append checkbox and label to the first name-box div
                const nameBox1 = document.createElement("div")
                nameBox1.classList.add("name-box")
                nameBox1.appendChild(checkbox1)
                nameBox1.appendChild(label1)

                // Create the second checkbox, label, price, date, and button
                const checkbox2 = document.createElement("input")
                checkbox2.type = "checkbox"
                checkbox2.id = "select-2"
                checkbox2.name = "select-2"
                checkbox2.value = "select-2"

                const label2 = document.createElement("label")
                label2.htmlFor = "select-2"
                label2.textContent = "รายการที่ 1"

                const price = document.createElement("h3")
                price.textContent = item.payment

                const date = document.createElement("h3")
                date.textContent = item.timestamp

                const deleteButton = document.createElement("button")
                deleteButton.classList.add(
                    "pink-btn",
                    "input-search",
                    "search-template"
                )
                deleteButton.textContent = "ลบ"
                deleteButton.style.cssText =
                    "font-size: 24px; background-color: #DE89A1; color: white; width: 140px; padding: 0; margin-left: 10px;"
                deleteButton.setAttribute("onclick", `delBooking("${token}", "${item.id}")`)
                // Append elements to the columm-content div
                const colummContent = document.createElement("div")
                colummContent.classList.add("columm-content")
                colummContent.id = "booking-columm-element"
                colummContent.appendChild(nameBox1)
                colummContent.appendChild(price)
                colummContent.appendChild(date)
                colummContent.appendChild(deleteButton)
                parent.appendChild(colummContent)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}

// const data = JSON.parse(getCookie("userData"));
// getBooking(data.token);
getBooking(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWY4NTUwZWEtZmI4NC00YjE3LWE4Y2ItMzhiMTc1ZWM2NjNiIiwicm9sZSI6ImN1c3RvbWVyIn0.mCHHIxdY96dcWzU21poRVnvD4O9AawFN4XddQIcesGs"
)


function registerPage(buttonId) {
    var encodedButtonId = encodeURIComponent(buttonId);
    window.location.href = 'login.html?buttonId=' + encodedButtonId;
}

window.onload = function () {
    registrationCookie();
    verify_role(my_token)
    getCookie('userData');
}

function verify_role(token) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token
        },
    };

    // Return the fetch call directly to chain promises
    return fetch(url + "/api/controller/get-user-profile/" + my_id, requestOptions)
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