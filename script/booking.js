const url = "http://127.0.0.1:8000"

async function delBooking(token, id) {
    await fetch(url + `/api/controller/delete-booking/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => console.error("Error fetching data:", error))
    useEffect("booking-element")
    getBooking(token)
}

function useEffect(elementId) {
    const parent = document.getElementById(elementId)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    
}

function getBooking(token) {
    fetch(url + "/api/controller/get-booking", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data)
            const parent = document.getElementById("booking-element")
            data.data.forEach((item) => {
                // Create the first checkbox and label
                const checkbox1 = document.createElement("input")
                checkbox1.type = "checkbox"
                checkbox1.id = "select-name"
                checkbox1.name = "select-name"
                checkbox1.value = "select-name"

                const label1 = document.createElement("label")
                label1.htmlFor = "select-name"
                label1.textContent = item.mate.username

                // Append checkbox and label to the first name-box div
                const nameBox1 = document.createElement("div")
                nameBox1.classList.add("name-box")
                nameBox1.appendChild(checkbox1)
                nameBox1.appendChild(label1)

                // Create the second checkbox, label, price, date, and button
                const checkbox2 = document.createElement("input")
                checkbox2.type = "checkbox"
                checkbox2.id = "select-2"
                checkbox2.name = "select-2"
                checkbox2.value = "select-2"

                const label2 = document.createElement("label")
                label2.htmlFor = "select-2"
                label2.textContent = "รายการที่ 1"

                const price = document.createElement("h3")
                price.textContent = item.payment

                const date = document.createElement("h3")
                date.textContent = item.timestamp

                const deleteButton = document.createElement("button")
                deleteButton.classList.add(
                    "pink-btn",
                    "input-search",
                    "search-template"
                )
                deleteButton.textContent = "ลบ"
                deleteButton.style.cssText =
                    "font-size: 24px; background-color: #DE89A1; color: white; width: 140px; padding: 0; margin-left: 10px;"
                deleteButton.setAttribute("onclick", `delBooking("${token}", "${item.id}")`)
                // Append elements to the columm-content div
                const colummContent = document.createElement("div")
                colummContent.classList.add("columm-content")
                colummContent.id = "booking-columm-element"
                colummContent.appendChild(nameBox1)
                colummContent.appendChild(price)
                colummContent.appendChild(date)
                colummContent.appendChild(deleteButton)
                parent.appendChild(colummContent)
            })
        })
        .catch((error) => console.error("Error fetching data:", error))
}

// const data = JSON.parse(getCookie("userData"));
// getBooking(data.token);
getBooking(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWY4NTUwZWEtZmI4NC00YjE3LWE4Y2ItMzhiMTc1ZWM2NjNiIiwicm9sZSI6ImN1c3RvbWVyIn0.mCHHIxdY96dcWzU21poRVnvD4O9AawFN4XddQIcesGs"
)

