function increaseValue() {
    var value = parseInt(document.getElementById("quantity").value, 10)
    value = isNaN(value) ? 0 : value
    value++
    document.getElementById("quantity").value = value
}

function decreaseValue() {
    var value = parseInt(document.getElementById("quantity").value, 10)
    value = isNaN(value) ? 0 : value
    value = value <= 0 ? 0 : value - 1
    document.getElementById("quantity").value = value
}

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

    // Append elements to card
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
            "x-token":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGJiNWViZjktMTU0Ni00ODlhLWI3MWUtMDJmZmRkN2Q2YTYwIiwicm9sZSI6Im1hdGUifQ.D7cDoTUOYcX51rAWASjMINhvX1yCOzgBVVfEnyQ0lIQ",
        },
        // body: JSON.stringify(requestBody)
    }

    fetch("http://127.0.0.1:8000/api/controller/get-mates", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((item) => {
                const username = item.account_detail.username
                const picUrl = item.account_detail.pic_url
                const accountId = item.account_detail.id
                createCard(username, picUrl, accountId)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}
