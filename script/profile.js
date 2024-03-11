const url = "http://127.0.0.1:8000";
let my_token = "";
let my_id = "";

window.onload = function () {
    registrationCookie();
    getTransactionHistory()
    verify_role(my_token)
    .then(role => {
        console.log("role :", role);
        const editMoneyBtn = document.getElementById("editMoneyBtn")
        // Use the role value here
        if(role == 'customer'){
            const mateContent = document.getElementById('mate-content');
            // Set its display property to 'none'
            mateContent.style.display = 'none';
            editMoneyBtn.textContent = 'Deposit';
            editMoneyBtn.addEventListener('click', function() {
                const amount = prompt('Enter new profile Money:');
                if (amount !== null && amount !== '') {
                    addMoney({ amount: amount });
                }
            });

        } else {
            editMoneyBtn.textContent = 'Withdraw'
            editMoneyBtn.addEventListener('click', function() {
                const amount = prompt('Enter new profile Money:');
                if (amount !== null && amount !== '') {
                    delMoney({ amount: amount });
                }
            });
        }
    })
    .catch(error => {
        console.error("Error verifying role:", error.message);
    });    
};

function getTransactionHistory() {
    fetch(url + "/api/controller/get-transaction", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Transaction history:", data.data);
            const transactionList = document.getElementById("transaction-list");
            data.data.forEach((transaction) => {
                // Assuming you have a parent element with id "transaction-list" where you want to append the transaction item

                // Create the transaction item container
                const transactionItem = document.createElement("div");
                transactionItem.classList.add("transaction-item", "row");

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
    } else {
        console.log('Registration data not found in cookie.');
    }
        
}
function addMoney(data) {
    fetch(url+"/api/controller/add-amount", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function delMoney(data) {
    fetch(url+"/api/controller/del-amount", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}



document.addEventListener('DOMContentLoaded', function() {
    registrationCookie();
    const editDisplayNameBtn = document.getElementById('editDisplayNameBtn');
    const editPicUrlBtn = document.getElementById('editPicUrlBtn');
    const editMoneyBtn = document.getElementById('editMoneyBtn');
    const editAgeBtn = document.getElementById('editAgeBtn');
    const editLocationBtn = document.getElementById('editLocationBtn');
    const editPriceBtn = document.getElementById('editPriceBtn');

    editDisplayNameBtn.addEventListener("click", function () {
        const newDisplayName = prompt("Enter new DisplayName:");
        if (newDisplayName !== null && newDisplayName !== "") {
            updateDisplayName({ display_name: newDisplayName });
        }
    });

    editPicUrlBtn.addEventListener("click", function () {
        const newPicUrl = prompt("Enter new profile picture URL:");
        if (newPicUrl !== null && newPicUrl !== "") {
            updatePicUrl({ url: newPicUrl });
        }
    });

    // editMoneyBtn.addEventListener('click', function() {
    //     const new_money = prompt('Enter new profile Money:');
    //     if (new_money !== null && new_money !== '') {
    //         updateMoney({ amount: new_money });
    //     }
    // });

    editAgeBtn.addEventListener('click', function() {
        const age = prompt('Enter new profile Money:');
        if (age !== null && age !== '') {
            updateAge({ age: age });
        }
    });

    editLocationBtn.addEventListener('click', function() {
        const location = prompt('Enter new profile Money:');
        if (location !== null && location !== '') {
            updateLocation({ location: location });
        }
    });

    editPriceBtn.addEventListener('click', function() {
        const price = prompt('Enter new price:');
        if (price !== null && price !== '') {
            updatePrice({ price: parseInt(price) });
        }
    });

    // Fetch user profile
    fetchUserProfile();
});

function updatePrice(data) {
    fetch(url+"/api/controller/edit-price", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function updateDisplayName(data) {
    fetch(url+"/api/controller/edit-display-name", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function updatePicUrl(data) {
    fetch(url+"/api/controller/edit-pic-url", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function updateMoney(data) {
    fetch(url+"/api/controller/edit-money", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function updateAge(data) {
    fetch(url+"/api/controller/edit-age", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function updateLocation(data) {
    fetch(url+"/api/controller/edit-location", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-token': my_token
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the UI with the new data if necessary
        fetchUserProfile();
    })
    .catch(error => {
        console.error('Error updating profile:', error);
    });
}

function fetchUserProfile() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token
        },
    };

    fetch(url + "/api/controller/get-self-profile", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        return response.json();
    })
    .then(data => {
        console.log('User profile fetched successfully:', data);
        // Update the UI with the fetched data
        updateProfileUI(data.data);
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });
}

function updateProfileUI(profileData) {
    console.log(profileData)
    // Update the UI with the fetched profile data
    document.getElementById('displayName').textContent = profileData.displayname;
    document.getElementById('picUrl').textContent = profileData.pic_url;
    // document.querySelector('.profile-pic img').setAttribute('src', profileData.pic_url);
    // document.querySelector('.images img').setAttribute('src', profileData.pic_url);

    // If you want to set src for all images with class profile-pic:
    const profilePics = document.querySelectorAll('.images img');
    profilePics.forEach(pic => {
        pic.setAttribute('src', profileData.pic_url);
    });

    document.getElementById('money-left').textContent = profileData.amount;

    document.getElementById('age').textContent = profileData.age;
    document.getElementById('location').textContent = profileData.location;
    document.getElementById('price').textContent = profileData.price;
}

function logOut() {
    document.cookie =
        "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.href = "index.html";
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

document.getElementById('addAvailable').addEventListener('click', function() {
    const availableDate = document.getElementById('availableTime').value;
    const date = new Date(availableDate);

    if (isNaN(date)) {
        console.log("Invalid date");
        alert("Please select available date")
    } else {
        console.log("Valid date");
        const detailInput = prompt("Enter Available detail: ");
        const detail = detailInput ? detailInput : "";
        
        const data = {
            "date": {
                "day": parseInt(date.getDate()),
                "month": parseInt(date.getMonth()) + 1, // Months are 0-indexed, so we add 1 to get the correct month
                "year": parseInt(date.getFullYear()),
            },
            "detail": detail
        };

        console.log("available on : ", data)

        fetch(url + "/api/mate/add-availability", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-token": my_token
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Response from POST:", data);
            if (data.hasOwnProperty("status_code")) {
                if (data.status_code == 404 || data.status_code == 400) {
                    alert("Fail: เพิ่มช่วงเวลาไม่สำเร็จ, Due to limit or error");
                }
            } else {
                alert("Success: เพิ่มช่วงเวลาสำเร็จ");
            }

            // Handle response data as needed
        })
        .catch(error => {
            console.error("Error adding availability:", error);
        });
    }
    
});