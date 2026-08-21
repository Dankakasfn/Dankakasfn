// =========================================================
// DANKAKADATA BUY DATA JAVASCRIPT
// VERSION: FIXED + IMPROVED
// =========================================================


// =========================================================
// ELEMENTS
// =========================================================

const phoneNumber =
    document.getElementById("phoneNumber");

const phoneError =
    document.getElementById("phoneError") ||
    document.getElementById("phoneMessage");

const validatorLogo =
    document.getElementById("validatorLogo");

const detectedNetwork =
    document.getElementById("detectedNetwork");

const detectedNetworkName =
    document.getElementById("detectedNetworkName");

const networkButtons =
    document.querySelectorAll(".network-btn");

const plansGrid =
    document.getElementById("plansGrid") ||
    document.getElementById("plansContainer");

const summaryCard =
    document.getElementById("summaryCard");

const summaryNetwork =
    document.getElementById("summaryNetwork");

const summaryPhone =
    document.getElementById("summaryPhone");

const summaryPlan =
    document.getElementById("summaryPlan");

const summaryAmount =
    document.getElementById("summaryAmount");

const purchaseBtn =
    document.getElementById("purchaseBtn");

const headerBalance =
    document.getElementById("headerBalance");

const pinModal =
    document.getElementById("pinModal");

const closePinModal =
    document.getElementById("closePinModal");

const transactionPin =
    document.getElementById("transactionPin");

const togglePin =
    document.getElementById("togglePin");

const pinError =
    document.getElementById("pinError");

const confirmPurchaseBtn =
    document.getElementById("confirmPurchaseBtn");

const successModal =
    document.getElementById("successModal");

const doneBtn =
    document.getElementById("doneBtn");


// =========================================================
// NETWORK LOGOS
// =========================================================

const networkLogos = {

    MTN:
        "images/mtn.png",

    GLO:
        "images/glo.png",

    AIRTEL:
        "images/airtel.png",

    "9MOBILE":
        "images/9mobile.png"

};


// =========================================================
// NETWORK PREFIXES
// =========================================================

const networkPrefixes = {

    MTN: [

        "0703",
        "0704",
        "0706",
        "0707",

        "0803",
        "0806",

        "0810",
        "0813",
        "0814",
        "0816",

        "0903",
        "0906",

        "0913",
        "0916"

    ],


    GLO: [

        "0705",

        "0805",
        "0807",

        "0811",
        "0815",

        "0905",

        "0915"

    ],


    AIRTEL: [

        "0701",
        "0708",

        "0802",
        "0808",

        "0812",

        "0901",
        "0902",
        "0904",
        "0907",

        "0911",
        "0912"

    ],


    "9MOBILE": [

        "0809",

        "0817",
        "0818",

        "0908",
        "0909"

    ]

};


// =========================================================
// DATA PLANS
// =========================================================

const dataPlans = {

    MTN: [

        {
            data: "500MB",
            duration: "30 Days",
            price: 150
        },

        {
            data: "1GB",
            duration: "30 Days",
            price: 300
        },

        {
            data: "2GB",
            duration: "30 Days",
            price: 600
        },

        {
            data: "3GB",
            duration: "30 Days",
            price: 900
        },

        {
            data: "5GB",
            duration: "30 Days",
            price: 1500
        },

        {
            data: "10GB",
            duration: "30 Days",
            price: 3000
        }

    ],


    GLO: [

        {
            data: "500MB",
            duration: "30 Days",
            price: 150
        },

        {
            data: "1GB",
            duration: "30 Days",
            price: 300
        },

        {
            data: "2GB",
            duration: "30 Days",
            price: 600
        },

        {
            data: "3GB",
            duration: "30 Days",
            price: 900
        },

        {
            data: "5GB",
            duration: "30 Days",
            price: 1500
        },

        {
            data: "10GB",
            duration: "30 Days",
            price: 3000
        }

    ],


    AIRTEL: [

        {
            data: "500MB",
            duration: "30 Days",
            price: 150
        },

        {
            data: "1GB",
            duration: "30 Days",
            price: 300
        },

        {
            data: "2GB",
            duration: "30 Days",
            price: 600
        },

        {
            data: "3GB",
            duration: "30 Days",
            price: 900
        },

        {
            data: "5GB",
            duration: "30 Days",
            price: 1500
        },

        {
            data: "10GB",
            duration: "30 Days",
            price: 3000
        }

    ],


    "9MOBILE": [

        {
            data: "500MB",
            duration: "30 Days",
            price: 150
        },

        {
            data: "1GB",
            duration: "30 Days",
            price: 300
        },

        {
            data: "2GB",
            duration: "30 Days",
            price: 600
        },

        {
            data: "3GB",
            duration: "30 Days",
            price: 900
        },

        {
            data: "5GB",
            duration: "30 Days",
            price: 1500
        },

        {
            data: "10GB",
            duration: "30 Days",
            price: 3000
        }

    ]

};


// =========================================================
// STATE
// =========================================================

let selectedNetwork = "";

let detectedNetworkValue = "";

let selectedPlan = null;

let currentUser = null;


// =========================================================
// GET CURRENT USER SAFELY
// =========================================================

try {

    currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

} catch (error) {

    currentUser = null;

}


// =========================================================
// MONEY FORMAT
// =========================================================

function formatMoney(amount) {

    return "₦" +
        Number(amount || 0).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =========================================================
// WALLET BALANCE
// =========================================================

function getWalletBalance() {

    if (!currentUser) {

        return 0;

    }

    return Number(

        currentUser.walletBalance ??
        currentUser.balance ??
        0

    );

}


// =========================================================
// UPDATE BALANCE
// =========================================================

function updateBalanceDisplay() {

    if (!headerBalance) {

        return;

    }

    headerBalance.textContent =
        formatMoney(
            getWalletBalance()
        );

}


// =========================================================
// NORMALIZE PHONE NUMBER
// =========================================================
//
// Accepts:
//
// 8012345678
// 08012345678
// +2348012345678
// 2348012345678
//
// Internally becomes:
//
// 08012345678
//
// =========================================================

function normalizePhoneNumber(value) {

    let digits =
        String(value || "")
            .replace(/\D/g, "");


    // +2348012345678
    if (
        digits.startsWith("234")
    ) {

        digits =
            "0" +
            digits.substring(3);

    }


    // 8012345678
    else if (
        digits.length === 10 &&
        digits.startsWith("8") ||
        digits.length === 10 &&
        digits.startsWith("7") ||
        digits.length === 10 &&
        digits.startsWith("9")
    ) {

        digits =
            "0" +
            digits;

    }


    // 08012345678
    // Keep as it is.


    if (
        digits.length !== 11 ||
        !digits.startsWith("0")
    ) {

        return null;

    }


    return digits;

}


// =========================================================
// DISPLAY PHONE
// =========================================================
//
// 08012345678
// becomes
// 8012345678
//
// =========================================================

function getPhoneDisplayNumber() {

    const normalized =
        normalizePhoneNumber(
            phoneNumber?.value
        );


    if (!normalized) {

        return "";

    }


    return normalized.substring(1);

}


// =========================================================
// DETECT NETWORK
// =========================================================

function detectNetwork(number) {

    const normalized =
        normalizePhoneNumber(number);


    if (!normalized) {

        return null;

    }


    const prefix =
        normalized.substring(0, 4);


    for (
        const network in networkPrefixes
    ) {

        if (
            networkPrefixes[network]
                .includes(prefix)
        ) {

            return network;

        }

    }


    return null;

}


// =========================================================
// SET VALIDATOR LOGO
// =========================================================

function setValidatorLogo(network) {

    if (!validatorLogo) {

        return;

    }


    if (
        network &&
        networkLogos[network]
    ) {

        validatorLogo.innerHTML = `

            <img
                src="${networkLogos[network]}"
                alt="${network}"
                class="validator-network-logo"
                onerror="
                    this.style.display='none';
                "
            >

        `;

    } else {

        validatorLogo.innerHTML = `

            <i class="fa-solid fa-mobile-screen"></i>

        `;

    }

}


// =========================================================
// PHONE ERROR
// =========================================================

function showPhoneError(message) {

    if (!phoneError) {

        return;

    }

    phoneError.textContent =
        message;

    phoneError.className =
        "error-message error";

}


// =========================================================
// PHONE SUCCESS
// =========================================================

function showPhoneSuccess(message) {

    if (!phoneError) {

        return;

    }

    phoneError.textContent =
        message;

    phoneError.className =
        "error-message success";

}


// =========================================================
// CLEAR PHONE MESSAGE
// =========================================================

function clearPhoneMessage() {

    if (!phoneError) {

        return;

    }

    phoneError.textContent =
        "";

    phoneError.className =
        "error-message";

}


// =========================================================
// RESET PLANS
// =========================================================

function resetPlans() {

    if (plansGrid) {

        plansGrid.innerHTML = `

            <div class="empty-plans">

                <i class="fa-solid fa-sim-card"></i>

                <p>
                    Enter a valid phone number
                    to see available plans.
                </p>

            </div>

        `;

    }


    if (summaryCard) {

        summaryCard.classList.remove(
            "show"
        );

    }


    if (purchaseBtn) {

        purchaseBtn.disabled = true;

    }


    selectedPlan = null;

}


// =========================================================
// LOAD PLANS
// =========================================================

function loadPlans(network) {

    if (!plansGrid) {

        return;

    }


    const plans =
        dataPlans[network];


    if (!plans) {

        resetPlans();

        return;

    }


    plansGrid.innerHTML = "";


    plans.forEach(
        function(plan, index) {

            const card =
                document.createElement("div");


            card.className =
                "plan-card";


            card.dataset.index =
                index;


            card.innerHTML = `

                <div>

                    <div class="plan-data">

                        ${plan.data}

                    </div>

                    <div class="plan-duration">

                        ${plan.duration}

                    </div>

                </div>


                <div class="plan-price">

                    ${formatMoney(plan.price)}

                </div>


                <div class="plan-check">

                    <i class="fa-solid fa-check"></i>

                </div>

            `;


            card.addEventListener(
                "click",
                function() {

                    selectPlan(
                        network,
                        plan,
                        card
                    );

                }
            );


            plansGrid.appendChild(
                card
            );

        }
    );

}


// =========================================================
// SELECT PLAN
// =========================================================

function selectPlan(
    network,
    plan,
    card
) {

    document
        .querySelectorAll(
            ".plan-card"
        )
        .forEach(
            function(item) {

                item.classList.remove(
                    "selected"
                );

            }
        );


    card.classList.add(
        "selected"
    );


    selectedPlan = {

        network:
            network,

        data:
            plan.data,

        duration:
            plan.duration,

        price:
            Number(plan.price)

    };


    updateSummary();

}


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateSummary() {

    if (!selectedPlan) {

        if (summaryCard) {

            summaryCard.classList.remove(
                "show"
            );

        }

        if (purchaseBtn) {

            purchaseBtn.disabled =
                true;

        }

        return;

    }


    const displayNumber =
        getPhoneDisplayNumber();


    if (summaryNetwork) {

        summaryNetwork.textContent =
            selectedPlan.network;

    }


    if (summaryPhone) {

        summaryPhone.textContent =
            "+234 " +
            displayNumber;

    }


    if (summaryPlan) {

        summaryPlan.textContent =
            selectedPlan.data +
            " • " +
            selectedPlan.duration;

    }


    if (summaryAmount) {

        summaryAmount.textContent =
            formatMoney(
                selectedPlan.price
            );

    }


    if (summaryCard) {

        summaryCard.classList.add(
            "show"
        );

    }


    if (purchaseBtn) {

        purchaseBtn.disabled =
            false;

    }

}


// =========================================================
// SET ACTIVE NETWORK
// =========================================================

function setActiveNetwork(network) {

    networkButtons.forEach(
        function(button) {

            button.classList.toggle(
                "active",
                button.dataset.network === network
            );

        }
    );

}


// =========================================================
// VALIDATE PHONE
// =========================================================

function validatePhoneNumber() {

    const normalized =
        normalizePhoneNumber(
            phoneNumber?.value
        );


    if (!normalized) {

        return {

            valid: false,

            network: null

        };

    }


    const network =
        detectNetwork(
            normalized
        );


    if (!network) {

        return {

            valid: false,

            network: null

        };

    }


    return {

        valid: true,

        network: network,

        normalized: normalized

    };

}


// =========================================================
// NETWORK BUTTONS
// =========================================================

networkButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const network =
                    button.dataset.network;


                if (!network) {

                    return;

                }


                const validation =
                    validatePhoneNumber();


                // Phone has not been entered yet
                if (!validation.valid) {

                    selectedNetwork =
                        network;


                    setActiveNetwork(
                        network
                    );


                    setValidatorLogo(
                        network
                    );


                    resetPlans();


                    showPhoneError(
                        "Enter a valid phone number first."
                    );


                    if (phoneNumber) {

                        phoneNumber.focus();

                    }

                    return;

                }


                // Phone belongs to another network
                if (
                    validation.network !==
                    network
                ) {

                    showPhoneError(

                        `This number belongs to ${validation.network}, not ${network}.`

                    );


                    setActiveNetwork(
                        validation.network
                    );


                    setValidatorLogo(
                        validation.network
                    );


                    selectedNetwork =
                        validation.network;


                    loadPlans(
                        validation.network
                    );


                    return;

                }


                selectedNetwork =
                    network;


                setActiveNetwork(
                    network
                );


                setValidatorLogo(
                    network
                );


                showPhoneSuccess(

                    `${network} number detected successfully.`

                );


                loadPlans(
                    network
                );

            }
        );

    }
);


// =========================================================
// PHONE INPUT
// =========================================================

if (phoneNumber) {

    phoneNumber.addEventListener(
        "input",
        function() {

            let raw =
                this.value;


            // Remove spaces, brackets,
            // hyphens and other characters.
            let digits =
                raw.replace(
                    /\D/g,
                    ""
                );


            // Handle 234XXXXXXXXXX
            if (
                digits.startsWith("234")
            ) {

                digits =
                    digits.substring(3);

            }


            // Handle 0XXXXXXXXXX
            if (
                digits.startsWith("0")
            ) {

                digits =
                    digits.substring(1);

            }


            // Keep only 10 subscriber digits
            digits =
                digits.substring(
                    0,
                    10
                );


            // Put back the clean 10-digit number
            this.value =
                digits;


            // Reset old selection
            resetPlans();


            if (detectedNetwork) {

                detectedNetwork.classList.remove(
                    "show"
                );

            }


            detectedNetworkValue =
                "";


            selectedNetwork =
                "";


            setActiveNetwork(
                ""
            );


            // Empty
            if (!digits.length) {

                clearPhoneMessage();

                setValidatorLogo(null);

                return;

            }


            // Not complete yet
            if (
                digits.length < 10
            ) {

                clearPhoneMessage();

                setValidatorLogo(null);

                return;

            }


            // Convert to Nigerian local format
            const normalized =
                "0" + digits;


            const network =
                detectNetwork(
                    normalized
                );


            // Network not found
            if (!network) {

                showPhoneError(

                    "We could not identify this Nigerian mobile network."

                );


                setValidatorLogo(
                    null
                );


                return;

            }


            // Valid network
            detectedNetworkValue =
                network;


            selectedNetwork =
                network;


            if (
                detectedNetwork
            ) {

                detectedNetwork.classList.add(
                    "show"
                );

            }


            if (
                detectedNetworkName
            ) {

                detectedNetworkName.textContent =
                    network;

            }


            setValidatorLogo(
                network
            );


            setActiveNetwork(
                network
            );


            showPhoneSuccess(

                `${network} number detected successfully.`

            );


            loadPlans(
                network
            );

        }
    );

}


// =========================================================
// PURCHASE BUTTON
// =========================================================

if (purchaseBtn) {

    purchaseBtn.addEventListener(
        "click",
        function() {

            // Login check
            if (!currentUser) {

                alert(
                    "Please login before making a purchase."
                );


                window.location.href =
                    "login.html";


                return;

            }


            // Phone validation
            const validation =
                validatePhoneNumber();


            if (!validation.valid) {

                showPhoneError(
                    "Please enter a valid Nigerian phone number."
                );

                if (phoneNumber) {

                    phoneNumber.focus();

                }

                return;

            }


            // Network validation
            if (
                selectedNetwork !==
                validation.network
            ) {

                showPhoneError(

                    `This number belongs to ${validation.network}.`

                );


                return;

            }


            // Plan validation
            if (!selectedPlan) {

                alert(
                    "Please select a data plan."
                );

                return;

            }


            // Balance validation
            const balance =
                getWalletBalance();


            if (
                balance <
                selectedPlan.price
            ) {

                alert(

                    `Insufficient wallet balance.\n\nRequired: ${formatMoney(selectedPlan.price)}\nAvailable: ${formatMoney(balance)}`

                );


                return;

            }


            // PIN modal
            if (!pinModal) {

                alert(
                    "Transaction PIN window is missing from the page."
                );

                return;

            }


            if (transactionPin) {

                transactionPin.value =
                    "";

            }


            if (pinError) {

                pinError.textContent =
                    "";

            }


            pinModal.classList.add(
                "show"
            );


            setTimeout(
                function() {

                    if (transactionPin) {

                        transactionPin.focus();

                    }

                },
                250
            );

        }
    );

}


// =========================================================
// CLOSE PIN MODAL
// =========================================================

if (closePinModal) {

    closePinModal.addEventListener(
        "click",
        function() {

            closePinWindow();

        }
    );

}


// =========================================================
// CLOSE PIN WINDOW
// =========================================================

function closePinWindow() {

    if (pinModal) {

        pinModal.classList.remove(
            "show"
        );

    }


    if (transactionPin) {

        transactionPin.value =
            "";

    }


    if (pinError) {

        pinError.textContent =
            "";

    }

}


// =========================================================
// CLICK OUTSIDE PIN MODAL
// =========================================================

if (pinModal) {

    pinModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                pinModal
            ) {

                closePinWindow();

            }

        }
    );

}


// =========================================================
// SHOW / HIDE PIN
// =========================================================

if (togglePin && transactionPin) {

    togglePin.addEventListener(
        "click",
        function() {

            if (
                transactionPin.type ===
                "password"
            ) {

                transactionPin.type =
                    "text";


                togglePin.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                transactionPin.type =
                    "password";


                togglePin.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

            }

        }
    );

}


// =========================================================
// PIN INPUT
// =========================================================

if (transactionPin) {

    transactionPin.addEventListener(
        "input",
        function() {

            this.value =
                this.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        6
                    );


            if (pinError) {

                pinError.textContent =
                    "";

            }

        }
    );

}


// =========================================================
// GET REGISTERED TRANSACTION PIN
// =========================================================

function getUserTransactionPin() {

    if (!currentUser) {

        return null;

    }


    return (

        currentUser.transactionPin ??
        currentUser.transactionPIN ??
        currentUser.transaction_pin ??
        currentUser.pin ??
        null

    );

}


// =========================================================
// CONFIRM PURCHASE
// =========================================================

if (confirmPurchaseBtn) {

    confirmPurchaseBtn.addEventListener(
        "click",
        function() {

            const enteredPin =
                transactionPin
                    ?.value
                    ?.trim() || "";


            // PIN length
            if (
                enteredPin.length !== 4 &&
                enteredPin.length !== 6
            ) {

                if (pinError) {

                    pinError.textContent =
                        "Enter your 4 or 6 digit transaction PIN.";

                }

                return;

            }


            // Get registered PIN
            const savedPin =
                getUserTransactionPin();


            if (!savedPin) {

                if (pinError) {

                    pinError.textContent =

                        "Transaction PIN was not found for this account. Please check your registration details.";

                }

                return;

            }


            // Compare PIN
            if (
                String(enteredPin) !==
                String(savedPin)
            ) {

                if (pinError) {

                    pinError.textContent =
                        "Incorrect transaction PIN.";

                }


                transactionPin.value =
                    "";


                transactionPin.focus();


                return;

            }


            // Check balance again
            const balance =
                getWalletBalance();


            if (
                balance <
                selectedPlan.price
            ) {

                if (pinError) {

                    pinError.textContent =
                        "Insufficient wallet balance.";

                }

                return;

            }


            completePurchase();

        }
    );

}


// =========================================================
// COMPLETE PURCHASE
// =========================================================

function completePurchase() {

    if (
        !currentUser ||
        !selectedPlan
    ) {

        return;

    }


    const currentBalance =
        getWalletBalance();


    const newBalance =
        currentBalance -
        Number(selectedPlan.price);


    if (
        newBalance < 0
    ) {

        if (pinError) {

            pinError.textContent =
                "Insufficient wallet balance.";

        }

        return;

    }


    // Disable button
    if (confirmPurchaseBtn) {

        confirmPurchaseBtn.disabled =
            true;


        confirmPurchaseBtn.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Processing...
            </span>

        `;

    }


    // Simulated processing
    setTimeout(
        function() {

            // =========================================
            // UPDATE USER BALANCE
            // =========================================

            currentUser.walletBalance =
                newBalance;


            currentUser.balance =
                newBalance;


            localStorage.setItem(

                "currentUser",

                JSON.stringify(
                    currentUser
                )

            );


            // =========================================
            // SAVE TRANSACTION
            // =========================================

            saveTransaction();


            // =========================================
            // UPDATE BALANCE
            // =========================================

            updateBalanceDisplay();


            // =========================================
            // CLOSE PIN
            // =========================================

            closePinWindow();


            // =========================================
            // SUCCESS DETAILS
            // =========================================

            const displayPhone =
                getPhoneDisplayNumber();


            const successNetwork =
                document.getElementById(
                    "successNetwork"
                );


            const successPhone =
                document.getElementById(
                    "successPhone"
                );


            const successPlan =
                document.getElementById(
                    "successPlan"
                );


            const successAmount =
                document.getElementById(
                    "successAmount"
                );


            const successMessage =
                document.getElementById(
                    "successMessage"
                );


            if (successNetwork) {

                successNetwork.textContent =
                    selectedPlan.network;

            }


            if (successPhone) {

                successPhone.textContent =
                    "+234 " +
                    displayPhone;

            }


            if (successPlan) {

                successPlan.textContent =
                    selectedPlan.data;

            }


            if (successAmount) {

                successAmount.textContent =
                    formatMoney(
                        selectedPlan.price
                    );

            }


            if (successMessage) {

                successMessage.textContent =

                    `${selectedPlan.data} data has been successfully processed for +234 ${displayPhone}.`;

            }


            // =========================================
            // RESET BUTTON
            // =========================================

            if (confirmPurchaseBtn) {

                confirmPurchaseBtn.disabled =
                    false;


                confirmPurchaseBtn.innerHTML = `

                    <span>
                        Confirm Purchase
                    </span>

                    <i class="fa-solid fa-check"></i>

                `;

            }


            if (transactionPin) {

                transactionPin.value =
                    "";

            }


            // =========================================
            // SHOW SUCCESS
            // =========================================

            if (successModal) {

                successModal.classList.add(
                    "show"
                );

            }

        },
        1500
    );

}


// =========================================================
// SAVE TRANSACTION
// =========================================================

function saveTransaction() {

    let transactions = [];


    try {

        transactions =
            JSON.parse(

                localStorage.getItem(
                    "transactions"
                )

            ) || [];

    } catch (error) {

        transactions = [];

    }


    const normalizedPhone =
        normalizePhoneNumber(
            phoneNumber.value
        );


    const transaction = {

        id:
            "TXN" +
            Date.now(),

        type:
            "Data Purchase",

        network:
            selectedPlan.network,

        phone:
            "+234" +
            normalizedPhone.substring(1),

        plan:
            selectedPlan.data,

        duration:
            selectedPlan.duration,

        amount:
            Number(selectedPlan.price),

        status:
            "Successful",

        date:
            new Date().toISOString()

    };


    transactions.unshift(
        transaction
    );


    localStorage.setItem(

        "transactions",

        JSON.stringify(
            transactions
        )

    );

}


// =========================================================
// DONE BUTTON
// =========================================================

if (doneBtn) {

    doneBtn.addEventListener(
        "click",
        function() {

            if (successModal) {

                successModal.classList.remove(
                    "show"
                );

            }


            if (phoneNumber) {

                phoneNumber.value =
                    "";

            }


            selectedNetwork =
                "";


            detectedNetworkValue =
                "";


            selectedPlan =
                null;


            if (detectedNetwork) {

                detectedNetwork.classList.remove(
                    "show"
                );

            }


            clearPhoneMessage();


            setValidatorLogo(
                null
            );


            setActiveNetwork(
                ""
            );


            resetPlans();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =========================================================
// INITIALIZE
// =========================================================

resetPlans();

updateBalanceDisplay();

setValidatorLogo(null);
