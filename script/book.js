const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmViM2Y4MmItNGU5YS00MDBkLWE2YTktMzg0MDU0ZjllMzdkIiwicm9sZSI6ImN1c3RvbWVyIn0.g9FxZnqhe54NDq4ujfhdcTxYBa1LkvX11cOme7COdrk"
const url = "http://127.0.0.1:8000"

async function getMateData(token) {
    const mate_id = "066a8ef8-58b1-47ad-99ef-1b3c41835b1a"
    const res = await fetch(url + "/api/controller/get-user-data/" + mate_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
    const data = await res.json()
    const nameElement = document.getElementById("name-text")
    const locationElement = document.getElementById("location-text")
    const priceElement = document.getElementById("price-text")
    nameElement.textContent = data.data.username
    locationElement.textContent = data.data.location
    priceElement.textContent = data.data.amount
    console.log(data)
    return data
}

async function getMateAvalability(token, mate_id) {
    const res = await fetch(url + "/api/mate/get-availability/" + mate_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
    const data = await res.json()
    const availabilityElement = document.getElementById("availability-content")
    console.log(data)
    data.data.forEach((item) => {
        const p = document.createElement("p")
        p.textContent = item.date
        availabilityElement.appendChild(p)
    })
    return data
}

async function bookMate(token, mate_id) {
    const res = await fetch(url + "/api/controller/add-booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
        body: JSON.stringify({
            mate_id: mate_id,
            date: {
                year: Date.now().getFullYear(),
                month: Date.now().getMonth(),
                day: Date.now().getDate(),
            },
        }),
    })
    const data = await res.json()
    console.log(data)
    return data
}

async function pay(token, booking_id) {
    const res = await fetch(url + "/api/controller/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
        body: JSON.stringify({
            booking_id: booking_id,
        }),
    })
    console.log(res)
    return res
}

async function getReview(token, mate_id) {
    const res = await fetch(url + "/api/mate/get-review/" + mate_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
    const data = await res.json()
    console.log(data)
    data.data.forEach((item) => {
        const div = document.createElement("div")

        const reviewText = document.createElement("p")
        reviewText.id = "review-text"
        reviewText.textContent = item.message

        const starText = document.createElement("p")
        starText.id = "start-text"
        starText.textContent = item.star

        const timeText = document.createElement("p")
        timeText.id = "time-text"
        timeText.textContent = item.timestamp

        div.appendChild(reviewText)
        div.appendChild(starText)
        div.appendChild(timeText)

        document.body.appendChild(div)
    })
}

getMateData(token)
getMateAvalability(token, "066a8ef8-58b1-47ad-99ef-1b3c41835b1a")
getReview(token, "066a8ef8-58b1-47ad-99ef-1b3c41835b1a")
