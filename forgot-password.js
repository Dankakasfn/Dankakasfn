function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}


let currentUserIndex = -1;


// Verify account
function verifyAccount() {

    const account = document
        .getElementById("account")
        .value
        .trim()
        .toLowerCase();

    const message = document.getElementById("message");

    if (!account) {
        message.textContent = "Please enter your email or phone number.";
        message.style.color = "red";
        return;
    }

    const users = getUsers();

    currentUserIndex = users.findIndex(user => {

        const email = String(user.email || "").toLowerCase();

        const phone = String(user.phone || "")
            .replace(/\s/g, "");

        const enteredPhone = account.replace(/\s/g, "");

        return email === account || phone === enteredPhone;
    });


    if (currentUserIndex === -1) {

        message.textContent =
            "No account was found with this email or phone number.";

        message.style.color = "red";

        return;
    }


    message.textContent =
        "Account found. Enter your new password.";

    message.style.color = "green";


    document.getElementById("resetSection").style.display = "block";
}




const password = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
/* ==========================
   PASSWORD TOGGLE
========================== */

document.getElementById("togglePassword").onclick = function () {

    password.type =
        password.type === "password" ? "text" : "password";

    this.innerHTML =
        password.type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';
};

document.getElementById("toggleConfirm").onclick = function () {

    confirmPassword.type =
        confirmPassword.type === "password"
            ? "text"
            : "password";

    this.innerHTML =
        confirmPassword.type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';
};




// Reset password
function resetPassword() {

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");


    if (!newPassword || !confirmPassword) {

        message.textContent =
            "Please enter and confirm your new password.";

        message.style.color = "red";

        return;
    }


    if (newPassword !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        message.style.color = "red";

        return;
    }


    // Password requirements
    const passwordRule =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


    if (!passwordRule.test(newPassword)) {

        message.textContent =
            "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";

        message.style.color = "red";

        return;
    }


    const users = getUsers();


    // Update password
    users[currentUserIndex].password = newPassword;


    // Save users
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    message.textContent =
        "Password reset successfully! Redirecting to login...";

    message.style.color = "green";


    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}