const container = document.getElementById("container");

const registerBtn = document.getElementById("register");

const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
    // history.replaceState({}, document.title, "register")
});

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
    var urlParams = new URLSearchParams(window.location.search);
    var page = urlParams.get("page");
    if (page == "register") {
        container.classList.add("active");
    } else if (page == "login") {
        container.classList.remove("active");
    }
};
