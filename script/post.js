let my_token = "";
let my_id = "";
let url = "http://127.0.0.1:8000";

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Usage example
function registrationCookie() {
    const registrationData = getCookie("userData");
    console.log(registrationData); // Log the value retrieved from the cookie
    if (registrationData !== "") {
        const data = JSON.parse(registrationData);
        console.log(data);
        my_token = data.token;
        my_id = data.id;
        // Do something with the registration data
        let loginNav = document.getElementById("login");
        loginNav.style.cssText = "display: none;";
        let registerNav = document.getElementById("register");
        registerNav.style.cssText = "display: none;";
    } else {
        console.log("Registration data not found in cookie.");
        let progileNav = document.getElementById("profile");
        progileNav.style.cssText = "display: none;";
    }
}

window.onload = function () {
    registrationCookie();
    verify_role(my_token)
        .then((role) => {
            console.log("role :", role);
            // Use the role value here
            if (role == "customer") {
                addPostBtn = document.getElementById("add-post");
                addPostBtn.style.display = "none";
            } else if (role == "admin") {
                setTimeout(function () {
                    window.location.href = "admin.html"; // Redirect to success page
                }, 100);
            }
        })
        .catch((error) => {
            console.error("Error verifying role:", error.message);
        });

    getPosts();
    addPostBtn();
};

function addPostBtn() {
    const addPostElement = document.getElementById("add-post");
    addPostElement.addEventListener("click", () => {
        let pic_url = prompt(
            "(Leave EMPTY if canccle)\nEnter Picture Content: "
        );
        let post_detail = prompt(
            "(Leave EMPTY if canccle)\nEnter Post Detail: "
        );

        if (pic_url != "" && post_detail != "") {
            alert("add post");
            addPost(post_detail, pic_url);
            getPosts();
        } else {
            alert("Cancle add post");
        }
        getPosts();
    });
}

function addPost(description, picture) {
    let post = {
        description: description,
        picture: picture,
    };
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
        body: JSON.stringify(post),
    };

    fetch(url + "/api/controller/add-post", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((posts) => {
            console.log("Posts received:", posts); // Log the response data
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
}

function getPosts() {
    fetch(url + "/api/controller/get-post", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": my_token,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((posts) => {
            console.log("Posts received:", posts); // Log the response data
            const postList = document.getElementById("post-list");
            postList.innerHTML = "";

            // Check if posts is an array before using forEach
            // if (!Array.isArray(posts)) {
            //     throw new Error("Posts is not an array");
            // }

            // Loop through each post and create post containers
            let list = [];
            const isValidUrl = (urlString) => {
                var urlPattern = new RegExp(
                    "^(https?:\\/\\/)?" + // validate protocol
                        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                        "(\\#[-a-z\\d_]*)?$",
                    "i"
                ); // validate fragment locator
                return !!urlPattern.test(urlString);
            };

            posts.data
                .slice()
                .reverse()
                .forEach((post) => {
                    function isImage(src, callback) {
                        var img = new Image();

                        img.onload = function () {
                            callback(true);
                        };

                        img.onerror = function () {
                            callback(false);
                        };
                        img.src = src;
                    }

                    const postContainer = document.createElement("div");
                    postContainer.classList.add("post-container");

                    const postHeader = document.createElement("div");
                    postHeader.id = "post-header";

                    const profilePic = document.createElement("img");
                    profilePic.src = post.account_detail.pic_url; // Set profile picture URL
                    profilePic.alt = "profile-pic";

                    let postProfileName = document.createElement("div");
                    postProfileName.id = "post-profile-name";
                    postProfileName.textContent =
                        post.account_detail.displayname;

                    let postProfileName2 = document.createElement("div");
                    postProfileName2.id = "post-profile-name";
                    postProfileName2.textContent =
                        post.account_detail.displayname; // Set profile name

                    const postTimestamp = document.createElement("div");
                    postTimestamp.id = "post-timestamp";
                    postTimestamp.textContent = post.timestamp; // Set post timestamp

                    postHeader.appendChild(profilePic);
                    postHeader.appendChild(postProfileName2);
                    postHeader.appendChild(postTimestamp);

                    const postContent = document.createElement("div");
                    postContent.id = "post-content";

                    const contentImg = document.createElement("img");

                    let pic = post.picture;
                    if (isImage(post.picture)) {
                        // alert("test")
                        pic = "";
                        contentImg.style.cssText = "display: none";
                    }

                    contentImg.style.cssText = " display: flex; justify-content: center; align-items: center;";
                       
                    postContainer.style.cssText =
                        "background: linear-gradient(151deg, rgba(255,255,238,1) 0%, rgba(238,170,119,1) 50%, rgba(238,119,204,1) 100%); ";
                    // alert(pic);
                    contentImg.src = pic; // Set content image URL
                    // contentImg.alt = "img";
                    postContent.appendChild(contentImg);

                    const postDetail = document.createElement("div");
                    postDetail.id = "post-detail";

                    const postDetailText = document.createElement("div");
                    postDetailText.id = "post-detail-text";
                    postDetailText.textContent = post.description; // Set post detail text

                    postDetail.appendChild(postProfileName);
                    postDetail.appendChild(postDetailText);

                    postContainer.appendChild(postHeader);
                    postContainer.appendChild(postContent);
                    postContainer.appendChild(postDetail);

                    postList.appendChild(postContainer); // Append post container to the post list
                    postContainer.dataset.accountId = post.account_detail.id;

                    postContainer.addEventListener("click", () => {
                        const accountId = postContainer.dataset.accountId;
                        console.log("Clicked card with accountId:", accountId);
                        window.location.href = "book.html?id=" + accountId;
                    });
                });
        })
        .catch((error) => {
            console.error("Error fetching posts:", error);
        });
}

function verify_role(token) {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-token": token,
        },
    };

    // Return the fetch call directly to chain promises
    return fetch(url + "/api/controller/get-self-profile", requestOptions)
        .then((response) => {
            console.log("get-user-profile ", response);
            if (response.status === 200) {
                return response.json(); // If status is 200, parse response JSON
            } else {
                alert("Verification error");
                window.location.href = "login.html";
                throw new Error("Verification error"); // For other statuses, throw unexpected error
            }
        })
        .then((data) => {
            if (data.hasOwnProperty("status_code")) {
                if (data.status_code == 404) {
                    alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
                    window.location.href = "login.html";
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
