// ==========================
// ELEMENTS
// ==========================

const form = document.getElementById("loginForm");
const loginInput = document.getElementById("login");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const successBox = document.getElementById("successBox");
const togglePassword = document.getElementById("togglePassword");


// ==========================
// SHOW / HIDE PASSWORD
// ==========================

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        this.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        this.innerHTML =
            '<i class="fa-solid fa-eye"></i>';
    }

});


// ==========================
// ERROR MESSAGE
// ==========================

function showError(input, message) {

    const box = input.parentElement;

    const error = box.querySelector(".error");

    if (error) {
        error.textContent = message;
    }

    input.style.borderColor = "red";
}


function clearError(input) {

    const box = input.parentElement;

    const error = box.querySelector(".error");

    if (error) {
        error.textContent = "";
    }

    input.style.borderColor = "#ddd";
}


// ==========================
// NORMALIZE PHONE NUMBER
// ==========================

function normalizePhone(phone) {

    phone = String(phone)
        .replace(/\s+/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");


    // 08012345678 → +2348012345678
    if (phone.startsWith("0")) {

        phone = "+234" + phone.substring(1);

    }


    // 2348012345678 → +2348012345678
    else if (phone.startsWith("234")) {

        phone = "+" + phone;

    }


    return phone;
}


// ==========================
// LOGIN
// ==========================

form.addEventListener("submit", function (e) {

    e.preventDefault();


    // Clear previous errors
    clearError(loginInput);
    clearError(password);


    // Get values
    const login = loginInput.value.trim();
    const pass = password.value;


    // ==========================
    // VALIDATION
    // ==========================

    if (login === "") {

        showError(
            loginInput,
            "Enter your email or phone number."
        );

        loginInput.focus();

        return;
    }


    if (pass === "") {

        showError(
            password,
            "Enter your password."
        );

        password.focus();

        return;
    }


    // ==========================
    // GET REGISTERED USERS
    // ==========================

    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    // ==========================
    // SEARCH USER
    // ==========================

    const enteredEmail =
        login.toLowerCase();


    const enteredPhone =
        normalizePhone(login);


    const user = users.find(function (u) {

        const registeredEmail =
            String(u.email || "")
                .trim()
                .toLowerCase();


        const registeredPhone =
            normalizePhone(u.phone || "");


        const emailMatch =
            registeredEmail === enteredEmail;


        const phoneMatch =
            registeredPhone === enteredPhone;


        return emailMatch || phoneMatch;

    });


    // ==========================
    // USER NOT FOUND
    // ==========================

    if (!user) {

        showError(
            loginInput,
            "Email or phone number is not registered."
        );

        return;
    }


    // ==========================
    // PASSWORD CHECK
    // ==========================

    if (String(user.password) !== String(pass)) {

        showError(
            password,
            "Incorrect password."
        );

        return;
    }


    // ==========================
    // LOGIN SUCCESSFUL
    // ==========================

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    // ==========================
    // LOADING ANIMATION
    // ==========================

    loginBtn.classList.add("loading");


    // Prevent multiple clicks
    loginBtn.disabled = true;


    setTimeout(function () {

        loginBtn.classList.remove("loading");


        // Hide login container
        const container =
            document.querySelector(".container");

        if (container) {
            container.style.display = "none";
        }


        // Show success box
        if (successBox) {

            successBox.style.display = "flex";

        }


        // Redirect to dashboard
        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 2000);


    }, 1500);

});