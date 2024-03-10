const url = 'http://127.0.0.1:8000';
// let url = 'http://10.66.4.108:8000'
let my_token = '';
let my_id = ''

window.onload = function () {
    registrationCookie();
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

function registrationCookie(){
    const registrationData = getCookie('userData');
    console.log(registrationData); // Log the value retrieved from the cookie
    if (registrationData !== '') {
        const data = JSON.parse(registrationData);
        console.log(data);
        my_token = data.token;
        my_id = data.id

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

    editDisplayNameBtn.addEventListener('click', function() {
        const newDisplayName = prompt('Enter new DisplayName:');
        if (newDisplayName !== null && newDisplayName !== '') {
            updateDisplayName({ display_name: newDisplayName });
        }
    });

    editPicUrlBtn.addEventListener('click', function() {
        const newPicUrl = prompt('Enter new profile picture URL:');
        if (newPicUrl !== null && newPicUrl !== '') {
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

    // Fetch user profile
    fetchUserProfile();
});

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
}

function logOut(){
    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.href = 'index.html'
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