const container = document.getElementById("container")
const registerBtn = document.getElementById("register")
const loginBtn = document.getElementById("login")

let url = 'http://127.0.0.1:8000'

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
    register();
})

loginBtn.addEventListener("click", () => {
    container.classList.remove("active")
})

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

function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // Get the form element

    // Your form submission handling code goes here
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Convert data to JSON string
    const jsonData = JSON.stringify(data);

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: data.username,
            password: data.password,
            role: data.role
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
            throw new Error("Account already exists"); // For other statuses, throw unexpected error
        }
    })
    .then((data) => {
        // Handle success response
        console.log("Message sent successfully:", data);

        // Save data to cookie
        const cookieData = {
            token: data.data.token,
            id: data.data.id,
            username: data.data.username,
            pic_url: data.data.pic_url
        };
        document.cookie = `userData=${JSON.stringify(cookieData)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

        setTimeout(function() {
            window.location.href = '../view/index.html'; // Redirect to success page
        }, 100);
    })
    .catch((error) => {
        // Handle error
        console.error("Error sending message:", error.message);
        // You can display error messages or perform other actions here
    });


    // // Redirect to another page after a short delay to ensure the cookie is set
    // setTimeout(function() {
    //     window.location.href = '../view/index.html'; // Redirect to success page
    // }, 5000);
}

