// ========================================
// DANKAKADATA DASHBOARD JAVASCRIPT
// ========================================


// ========================================
// ELEMENTS
// ========================================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const toggleBalance = document.getElementById("toggleBalance");
const walletBalance = document.getElementById("walletBalance");

const walletBtn = document.getElementById("walletBtn");
const walletMenu = document.getElementById("walletMenu");

const transactionBtn =
    document.getElementById("transactionBtn");

const transactionMenu =
    document.getElementById("transactionMenu");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeName =
    document.getElementById("welcomeName");

const profileInitial =
    document.getElementById("profileInitial");


// ========================================
// SIDEBAR
// ========================================

// Open sidebar
menuBtn.addEventListener("click", function () {

    sidebar.classList.add("active");

    sidebarOverlay.classList.add("active");

});


// Close sidebar
function closeSideMenu() {

    sidebar.classList.remove("active");

    sidebarOverlay.classList.remove("active");

}


// Close button
closeSidebar.addEventListener(
    "click",
    closeSideMenu
);


// Close when clicking overlay
sidebarOverlay.addEventListener(
    "click",
    closeSideMenu
);


// ========================================
// CLOSE SIDEBAR WHEN CLICKING MENU ITEM
// ========================================

const sidebarItems =
    document.querySelectorAll(".sidebar-item");


sidebarItems.forEach(function (item) {

    item.addEventListener("click", function () {

        // Keep dropdown buttons open
        if (
            item.classList.contains("dropdown-btn") ||
            item.classList.contains("wallet-btn") ||
            item.classList.contains("logout-btn")
        ) {

            return;

        }

        closeSideMenu();

    });

});


// ========================================
// WALLET DROPDOWN
// ========================================

walletBtn.addEventListener(
    "click",
    function () {

        walletMenu.classList.toggle("active");

        walletBtn.classList.toggle("active");

    }
);


// ========================================
// TRANSACTION DROPDOWN
// ========================================

transactionBtn.addEventListener(
    "click",
    function () {

        transactionMenu.classList.toggle("open");

        transactionBtn.classList.toggle("open");

    }
);


// ========================================
// CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function (event) {


        // Close Transaction dropdown

        if (
            !transactionBtn.contains(event.target) &&
            !transactionMenu.contains(event.target)
        ) {

            transactionMenu.classList.remove("open");

            transactionBtn.classList.remove("open");

        }


        // Close Wallet dropdown

        if (
            !walletBtn.contains(event.target) &&
            !walletMenu.contains(event.target)
        ) {

            walletMenu.classList.remove("active");

            walletBtn.classList.remove("active");

        }

    }
);


// ========================================
// BALANCE SHOW / HIDE
// ========================================

let balanceVisible = true;


toggleBalance.addEventListener(
    "click",
    function () {

        if (balanceVisible) {

            walletBalance.textContent =
                "••••••";

            toggleBalance.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

            balanceVisible = false;

        } else {

            walletBalance.textContent =
                walletBalance.dataset.balance;

            toggleBalance.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

            balanceVisible = true;

        }

    }
);


// ========================================
// GET CURRENT USER
// ========================================

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


// ========================================
// DISPLAY USER INFORMATION
// ========================================

if (currentUser) {

    // Full name
    const fullName =
        currentUser.fullname ||
        currentUser.username ||
        "User";


    // Welcome name
    welcomeName.textContent =
        fullName;


    // Profile initial
    profileInitial.textContent =
        fullName
            .charAt(0)
            .toUpperCase();

} else {

    welcomeName.textContent =
        "User";

    profileInitial.textContent =
        "U";

}


// ========================================
// LOGOUT
// ========================================

logoutBtn.addEventListener(
    "click",
    function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {

            return;

        }


        // Remove current user
        localStorage.removeItem(
            "currentUser"
        );


        // Close sidebar
        closeSideMenu();


        // Go to login
        window.location.href =
            "login.html";

    }
);