let my_token = '';
let url = 'http://127.0.0.1:8000';
// let url = 'http://10.66.4.108:8000'


function createCard(username, picUrl, accountId) {
    const cardList = document.getElementById("card-list")

    // Create card element
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.accountId = accountId // Set accountId as a custom data attribute

    // Create image element
    const img = document.createElement("img")
    img.src = picUrl
    img.alt = "Profile Image"

    // Create card detail element
    const cardDetail = document.createElement("div")
    cardDetail.classList.add("card-detail")

    // Create card detail name element
    const cardDetailName = document.createElement("div")
    cardDetailName.classList.add("card-detail-name")
    cardDetailName.textContent = username

    const cardDetailLocation = document.createElement("div")
    cardDetailLocation.classList.add("card-detail-location")
    cardDetailLocation.textContent = "Bangkok"

    // Append elements to card
    cardDetail.appendChild(cardDetailLocation)
    cardDetail.appendChild(cardDetailName)
    card.appendChild(img)
    card.appendChild(cardDetail)

    // Add event listener to card
    card.addEventListener("click", () => {
        const accountId = card.dataset.accountId
        console.log("Clicked card with accountId:", accountId)
        // Perform GET request with accountId
    })

    // Append card to card list
    cardList.appendChild(card)
}

function getMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list")
    cardList.innerHTML = ""

    // Define request options
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        // body: JSON.stringify(requestBody)
    }

    fetch(url + "/api/controller/get-mates", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data)
            data.data.forEach((item) => {
                const username = item.account_detail.username
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                createCard(username, picUrl, accountId)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}


function searchMates() {
    // Clear previous values
    const cardList = document.getElementById("card-list")
    cardList.innerHTML = ""

    const nameText = document.getElementById("mate-name").value

    // Define request options
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        body: JSON.stringify({
            name: nameText,
            location: "",
            gender: "",
            age: 18
        })
    }

    fetch(url + "/api/controller/search-mates", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetch mates: ", data)
            data.data.forEach((item) => {
                const username = item.account_detail.username
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                createCard(username, picUrl, accountId)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}


window.onload = function () {
    registrationCookie();
    addEnterSearch();
    if (window.location.pathname.includes("index.html")) {
        clearLocalStorage();
        updateValue();
        getMates();
        console.log("You are on index.html");
    } else {
        console.log("You are not mate.html");
        updateValue();
        searchMates();
    }
    
}

function registerPage(buttonId) {
    var encodedButtonId = encodeURIComponent(buttonId);
    window.location.href = 'login.html?buttonId=' + encodedButtonId; // passing value
}

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i <cookieArray.length; i++) {
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

function clearLocalStorage() {
    localStorage.clear();
    // console.log("Local storage cleared.");
    // localStorage.setItem('mate-name', "");
    // localStorage.setItem('mate-location', "");
    // localStorage.setItem('quantity', "");

}

function syncGender() {
    var selectedGenders = [];
    var checkboxes = document.querySelectorAll('.input-gender input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
        selectedGenders.push(checkbox.value);
    });
    console.log(selectedGenders)
    localStorage.setItem('selectedGenders', JSON.stringify(selectedGenders));
}

function syncValue() {
    console.log(document.getElementById('mate-name').value)
    localStorage.setItem('mate-name', document.getElementById('mate-name').value);
    localStorage.setItem('mate-location', document.getElementById('mate-location').value);
    localStorage.setItem('quantity', document.getElementById('quantity').value);

    syncGender()    
}

function updateValue(){
    document.getElementById('mate-name').value = localStorage.getItem('mate-name');
    document.getElementById('mate-location').value = localStorage.getItem('mate-location'); 
    document.getElementById('quantity').value = localStorage.getItem('quantity');
    var storedGenders = localStorage.getItem('selectedGenders');
    if (storedGenders) {
        storedGenders = JSON.parse(storedGenders);
        var checkboxes = document.querySelectorAll('.input-gender input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            if (storedGenders.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

function addEnterSearch(){
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

