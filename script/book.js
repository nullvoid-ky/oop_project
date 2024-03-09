const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDQyNmYwYzQtZTcxYi00NjQ1LTg3NTEtNDgwMDRkNDQ5ZTQwIiwicm9sZSI6ImN1c3RvbWVyIn0.BEf0sLm6EO834ESNrMChcdoSaqglT3aq9MzmBlESTBs"
const url = "http://127.0.0.1:8000"

async function getMateData(token) {
    const user_id = "35263c58-fd9c-4222-8ff2-cec339222852"
    const res = await fetch(url + "/api/controller/get-user-data/" + user_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
    const data = await res.json()
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
    console.log(data)
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
    return data
}
document.addEventListener('DOMContentLoaded', function () {
    var availabilityTextElements = document.querySelectorAll('.availability-text');
    var bookButton = document.getElementById('book-btn');
    var selectedTime = null;

    // Add click event listeners to each availability text element
    availabilityTextElements.forEach(function (element) {
        element.addEventListener('click', function () {
            // Remove the 'selected' class from all elements
            availabilityTextElements.forEach(function (el) {
                el.classList.remove('selected');
            });

            // Add the 'selected' class to the clicked element
            element.classList.add('selected');
            selectedTime = element.getAttribute('data-time');
        });
    });

    bookButton.addEventListener('click', function () {
        if (selectedTime !== null) {
            // Perform actions for the selected time (e.g., submit data)
            console.log('Booking for time:', selectedTime);
            // Add your logic here to submit the data or perform other actions
        } else {
            console.log('Please select a time before booking.');
        }
    });
});

getMateData(token)
getReview(token, "35263c58-fd9c-4222-8ff2-cec339222852")
