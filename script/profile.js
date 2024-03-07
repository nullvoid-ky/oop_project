const url = 'http://127.0.0.1:8000';
let my_token = '';

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

const registrationData = getCookie('userData');
console.log(registrationData); // Log the value retrieved from the cookie
if (registrationData !== '') {
    const data = JSON.parse(registrationData);
    console.log(data);
    my_token = data.token;
    // Do something with the registration data
} else {
    console.log('Registration data not found in cookie.');
}

document.addEventListener('DOMContentLoaded', function() {
    const editUsernameBtn = document.getElementById('editUsernameBtn');
    const editPicUrlBtn = document.getElementById('editPicUrlBtn');

    editUsernameBtn.addEventListener('click', function() {
        const newUsername = prompt('Enter new username:');
        if (newUsername !== null && newUsername !== '') {
            updateUsername({ username: newUsername });
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

    function updateUsername(data) {
        fetch(url+"/api/controller/edit-username", {
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

        fetch(url + "/api/controller/get-user-profile", requestOptions)
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
        document.getElementById('username').textContent = profileData.displayname;
        document.getElementById('picUrl').textContent = profileData.pic_url;
        document.querySelector('.profile-pic img').setAttribute('src', profileData.pic_url);
        // document.getElementById('moneyLeft').textContent = profileData.money_left;
    }
});
