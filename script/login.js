const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

let url = 'http://127.0.0.1:8000'

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
})

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
    // history.replaceState({}, document.title, "login")
});

const passwordText = document.getElementById("pwd");
const warningAlert = document.getElementById("warning");

passwordText.addEventListener("change", function () {
    if (passwordText.value.length < 8) {
        warningAlert.style.cssText = "display: flex";
    } else {
        warningAlert.style.cssText = "display: none";
    }
});

window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search)
    var buttonId = urlParams.get("buttonId")
    if (buttonId == 'register') {
        container.classList.add("active")
    } 
}

function register() {
    const username = document.getElementById("create-username");
    const password = document.getElementById("create-password");
    const radioButtons = document.querySelectorAll('input[name="account-type"]');
    const role = "mate"
    radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            role = radioButton.value;
        }
    });

    console.log(username, password, role);
}

function handleFormSubmissionRegister(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("create-username").value;
    const password = document.getElementById("create-password").value;
    const password_re = document.getElementById("create-password-re").value;
    const radioButtons = document.querySelectorAll('input[name="account-type"]');
    let role = "mate"
    radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            role = radioButton.value;
        }
    });

    // Check if passwords match
    if (password !== password_re) {
        alert("Passwords do not match. Please try again.");
        return; // Exit the function early if passwords don't match
    }
    
    // Check if password length is at least 8 characters
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return; // Exit the function early if password length is insufficient
    }

    // console.log(username, password, role);

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            role: role
        }),
    };

    fetch(url + "/api/auth/register", requestOptions)
    .then((response) => {
        console.log(response.status);
        if (response.status === 201) {
            return response.json(); // If status is 201, parse response JSON
        } else if (response.status === 400) {
            throw new Error("Account already exists"); // If status is 400, throw error
        } else {
            alert("Account already exists.");
            throw new Error("Account already exists"); // For other statuses, throw unexpected error
        }
    })
    .then((data) => {
        // Handle success response
        console.log("Message sent successfully:", data);

        // Save data to cookie
        const cookieData = {
            token: data.data.token,
        };
        document.cookie = `userData=${JSON.stringify(cookieData)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

        // Call verify_role and handle its asynchronous response
        verify_role(data.data.token)
            .then(role => {
                console.log("role :", role);
                // Use the role value here
                if(role == 'customer'){
                    setTimeout(function() {
                        window.location.href = '../view/index.html'; // Redirect to success page
                    }, 100);
                } else {
                    setTimeout(function() {
                        window.location.href = '../view/mate.html'; // Redirect to success page
                    }, 100);
                }
            })
            .catch(error => {
                console.error("Error verifying role:", error.message);
            });
    })
    .catch((error) => {
        console.error("Error sending message:", error.message);
    });
}

function handleFormSubmissionLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    };

    fetch(url + "/api/auth/login", requestOptions)
    .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
            return response.json(); // If status is 201, parse response JSON
        } else if (response.status === 400) {
            alert("Worng username or password");
            throw new Error("Worng username or password"); // If status is 400, throw error
        } else {
            throw new Error("Invalid credentials"); // For other statuses, throw unexpected error
        }
    })
    .then((data) => {
        console.log("Login sent successfully:", data);
        if (data.status_code === 401) {
            alert("Worng username or password");
            throw new Error("Worng username or password"); // If status is 400, throw error
        }
        // Handle success response
        

        // Save data to cookie
        const cookieData = {
            token: data.data.token,
            id: data.data.id,
            username: data.data.username,
            pic_url: data.data.pic_url
        };
        document.cookie = `userData=${JSON.stringify(cookieData)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

        verify_role(data.data.token)
            .then(role => {
                console.log("role :", role);
                // Use the role value here
                if(role == 'customer'){
                    setTimeout(function() {
                        window.location.href = '../view/index.html'; // Redirect to success page
                    }, 100);
                } else {
                    setTimeout(function() {
                        window.location.href = '../view/mate.html'; // Redirect to success page
                    }, 100);
                }
            })
            .catch(error => {
                console.error("Error verifying role:", error.message);
            });

        setTimeout(function() {
            window.location.href = '../view/index.html'; // Redirect to success page
        }, 100);
    })
    .catch((error) => {
        console.error("Error sending message:", error.message);
    });
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
    return fetch(url + "/api/controller/get-user-profile", requestOptions)
    .then((response) => {
        console.log("get-user-profile ", response);
        if (response.status === 200) {
            return response.json(); // If status is 200, parse response JSON
        } else {
            alert("Verification error");
            throw new Error("Verification error"); // For other statuses, throw unexpected error
        }
    })
    .then((data) => {
        // Handle success response
        console.log("Verification respond:", data);
        return data.data.role;
    })
    .catch((error) => {
        console.error("Error Verification respond:", error.message);
        throw error; // Re-throw the error to be caught by the caller
    });
}