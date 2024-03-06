import { getChatRooms, getCookie } from './script.js';

let my_token = ''

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

window.onload = function () {
    getChatRooms(my_token);
}