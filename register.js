// ==========================
// ELEMENTS
// ==========================

const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const successBox = document.getElementById("successBox");

const fullname = document.getElementById("fullname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const pin = document.getElementById("pin");
const referral = document.getElementById("referral");


// ==========================
// PASSWORD TOGGLE
// ==========================

document.getElementById("togglePassword").addEventListener("click", function () {

    password.type =
        password.type === "password" ? "text" : "password";

    this.innerHTML =
        password.type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';
});


document.getElementById("toggleConfirm").addEventListener("click", function () {

    confirmPassword.type =
        confirmPassword.type === "password" ? "text" : "password";

    this.innerHTML =
        confirmPassword.type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';
});


// ==========================
// PHONE FORMAT
// ==========================

phone.addEventListener("input", function () {

    let value = this.value.replace(/\D/g, "");

    if (value.startsWith("234")) {
        value = value.substring(3);
    }

    if (value.startsWith("0")) {
        value = value.substring(1);
    }

    value = value.substring(0, 10);

    this.value = "+234" + value;
});


// ==========================
// ERROR
// ==========================

function error(input, message) {

    const box = input.parentElement;

    box.classList.add("error");

    const errorText = box.querySelector(".error");

    if (errorText) {
        errorText.textContent = message;
    }
}


// ==========================
// CLEAR ERROR
// ==========================

function success(input) {

    const box = input.parentElement;

    box.classList.remove("error");

    const errorText = box.querySelector(".error");

    if (errorText) {
        errorText.textContent = "";
    }

    input.style.borderColor = "";
}


// ==========================
// SUBMIT
// ==========================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    let valid = true;


    [
        fullname,
        username,
        email,
        phone,
        password,
        confirmPassword,
        pin
    ].forEach(input => success(input));


    // Full name
    if (fullname.value.trim() === "") {

        error(fullname, "Enter your full name");

        valid = false;
    }


    // Username
    if (username.value.trim().length < 4) {

        error(username, "Username must be at least 4 characters");

        valid = false;
    }


    // Email
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.value.trim())) {

        error(email, "Enter a valid email address");

        valid = false;
    }


    // Phone
    const phoneRegex =
        /^\+234[789][01]\d{8}$/;

    if (!phoneRegex.test(phone.value)) {

        error(
            phone,
            "Enter a valid Nigerian phone number."
        );

        valid = false;
    }


    // Password
    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!strongPassword.test(password.value)) {

        error(
            password,
            "Password must contain uppercase, lowercase, number, special character and at least 8 characters."
        );

        valid = false;
    }


    // Confirm password
    if (password.value !== confirmPassword.value) {

        error(
            confirmPassword,
            "Passwords do not match"
        );

        valid = false;
    }


    // PIN
    if (!/^\d{4}$/.test(pin.value)) {

        error(
            pin,
            "PIN must be exactly 4 digits"
        );

        valid = false;
    }


    if (!valid) {
        return;
    }


    // ==========================
    // GET USERS
    // ==========================

    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    // ==========================
    // CHECK DUPLICATE EMAIL
    // ==========================

    const emailExists = users.some(user =>
        String(user.email).toLowerCase() ===
        email.value.trim().toLowerCase()
    );


    if (emailExists) {

        error(
            email,
            "This email is already registered."
        );

        return;
    }


    // ==========================
    // CHECK DUPLICATE PHONE
    // ==========================

    const phoneExists = users.some(user =>
        user.phone === phone.value
    );


    if (phoneExists) {

        error(
            phone,
            "This phone number is already registered."
        );

        return;
    }


    // ==========================
    // CREATE USER
    // ==========================

    const user = {

        fullname: fullname.value.trim(),

        username: username.value.trim(),

        email: email.value.trim().toLowerCase(),

        phone: phone.value,

        password: password.value,

        pin: pin.value,

        referral: referral.value.trim()

    };


    // ==========================
    // SAVE USER
    // ==========================

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // ==========================
    // LOADING
    // ==========================

    submitBtn.classList.add("loading");

    submitBtn.disabled = true;


    setTimeout(() => {

        submitBtn.classList.remove("loading");

        submitBtn.disabled = false;


        const container =
            document.querySelector(".container");

        if (container) {
            container.style.display = "none";
        }


        if (successBox) {

            successBox.style.display = "flex";

        }


        setTimeout(() => {

            window.location.href = "login.html";

        }, 2500);

    }, 2000);

});