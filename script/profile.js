const url = 'http://127.0.0.1:8000';
// let url = 'http://10.66.4.108:8000'
let my_token = '';
let my_id = ''

window.onload = function () {
    registrationCookie();
    verify_role(my_token)    
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

document.addEventListener('DOMContentLoaded', function() {
    const editDisplayNameBtn = document.getElementById('editDisplayNameBtn');
    const editPicUrlBtn = document.getElementById('editPicUrlBtn');

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

    // Fetch user profile
    fetchUserProfile();

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

    function fetchUserProfile() {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-token": my_token
            },
        };

        fetch(url + "/api/controller/get-user-profile/"+my_id, requestOptions)
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
        // Update the UI with the fetched profile data
        document.getElementById('displayName').textContent = profileData.display_name;
        document.getElementById('picUrl').textContent = profileData.pic_url;
        document.querySelector('.profile-pic img').setAttribute('src', profileData.pic_url);
        // document.getElementById('moneyLeft').textContent = profileData.money_left;
    }
});

function logOut(){
    document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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