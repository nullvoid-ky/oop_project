const container = document.getElementById("container")

const registerBtn = document.getElementById("register")

const loginBtn = document.getElementById("login")

registerBtn.addEventListener("click", () => {
    container.classList.add("active")
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
