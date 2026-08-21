// =====================================================
// DANKAKADATA BUY AIRTIME JAVASCRIPT
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const networkButtons =
    document.querySelectorAll(".network-btn");

const amountButtons =
    document.querySelectorAll(".amount-btn");

const phoneInput =
    document.getElementById("phoneNumber");

const validatorLogo =
    document.getElementById("validatorLogo");

const detectedNetwork =
    document.getElementById("detectedNetwork");

const detectedNetworkName =
    document.getElementById("detectedNetworkName");

const phoneError =
    document.getElementById("phoneError");

const customAmountBox =
    document.getElementById("customAmountBox");

const customAmount =
    document.getElementById("customAmount");

const summaryCard =
    document.getElementById("summaryCard");

const summaryNetwork =
    document.getElementById("summaryNetwork");

const summaryPhone =
    document.getElementById("summaryPhone");

const summaryAmount =
    document.getElementById("summaryAmount");

const summaryBalance =
    document.getElementById("summaryBalance");

const summaryTotal =
    document.getElementById("summaryTotal");

const purchaseBtn =
    document.getElementById("purchaseBtn");

const pinModal =
    document.getElementById("pinModal");

const transactionPin =
    document.getElementById("transactionPin");

const confirmPurchaseBtn =
    document.getElementById("confirmPurchaseBtn");

const closePinModal =
    document.getElementById("closePinModal");

const pinError =
    document.getElementById("pinError");

const togglePin =
    document.getElementById("togglePin");

const successModal =
    document.getElementById("successModal");

const doneBtn =
    document.getElementById("doneBtn");

const headerBalance =
    document.getElementById("headerBalance");



// =====================================================
// VARIABLES
// =====================================================

let selectedNetwork = "";

let selectedAmount = 0;

let isProcessing = false;



// =====================================================
// NETWORK LOGOS
// =====================================================

const networkImages = {

    MTN: "images/mtn.png",

    GLO: "images/glo.png",

    AIRTEL: "images/airtel.png",

    "9MOBILE": "images/9mobile.png"

};



// =====================================================
// NIGERIAN NETWORK PREFIXES
// =====================================================
//
// We use FOUR digits instead of only
// 080 / 081 / 090.
//
// This prevents the wrong network from
// being detected.
//

const networkPrefixes = {

    MTN: [

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
        "0907",

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



// =====================================================
// GET CURRENT USER
// =====================================================

let currentUser = null;


try {

    currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );

} catch (error) {

    console.error(
        "Unable to read current user:",
        error
    );

}



// =====================================================
// GET MAIN WALLET BALANCE
// =====================================================

let walletBalance = 0;


if (currentUser) {

    walletBalance =
        Number(
            currentUser.walletBalance || 0
        );

}


updateBalanceDisplay();



// =====================================================
// BALANCE DISPLAY
// =====================================================

function updateBalanceDisplay() {

    const formattedBalance =
        "₦" + 
        walletBalance.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    if (headerBalance) {

        headerBalance.textContent =
            formattedBalance;

    }


    if (summaryBalance) {

        summaryBalance.textContent =
            formattedBalance;

    }

}



// =====================================================
// NETWORK SELECTION
// =====================================================

networkButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            if (isProcessing) {
                return;
            }


            networkButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add("active");


            selectedNetwork =
                this.dataset.network;


            validateAndUpdate();


        }
    );

});



// =====================================================
// PHONE INPUT
// =====================================================

phoneInput.addEventListener(
    "input",
    function () {

        if (isProcessing) {
            return;
        }


        let value =
            this.value.replace(/\D/g, "");


        // Remove Nigeria country code
        // if user pastes 2348012345678

        if (
            value.startsWith("234")
        ) {

            value =
                value.substring(3);

        }


        // If user enters 080...
        // convert it to 80...

        if (
            value.startsWith("0")
        ) {

            value =
                value.substring(1);

        }


        // Maximum 10 digits after +234

        value =
            value.substring(0, 10);


        this.value = value;


        validateAndUpdate();

    }
);



// =====================================================
// PHONE VALIDATION
// =====================================================

function validatePhone() {

    const rawPhone =
        phoneInput.value.trim();


    // Empty

    if (!rawPhone) {

        showPhoneError(
            "Enter your phone number."
        );

        resetValidator();

        return false;

    }



    // Must be exactly 10 digits

    if (!/^\d{10}$/.test(rawPhone)) {

        showPhoneError(
            "Enter a valid 10-digit phone number."
        );

        resetValidator();

        return false;

    }



    // Convert 8012345678
    // to 08012345678

    const fullPhone =
        "0" + rawPhone;



    // Detect network

    const detected =
        detectNetwork(fullPhone);



    if (!detected) {

        showPhoneError(
            "We couldn't identify this network."
        );

        resetValidator();

        return false;

    }



    // If user selected a network,
    // make sure the number belongs to it.

    if (
        selectedNetwork &&
        selectedNetwork !== detected
    ) {

        showPhoneError(
            "This number belongs to " +
            detected +
            ", not " +
            selectedNetwork +
            "."
        );


        showDetectedNetwork(
            detected
        );


        return false;

    }



    // If no network was manually selected,
    // automatically select detected network.

    if (!selectedNetwork) {

        selectedNetwork =
            detected;


        setActiveNetwork(
            detected
        );

    }



    showDetectedNetwork(
        detected
    );


    showPhoneSuccess(
        "Valid " +
        detected +
        " phone number."
    );


    return true;

}



// =====================================================
// DETECT NETWORK
// =====================================================

function detectNetwork(phone) {

    // phone example:
    // 08031234567

    const prefix =
        phone.substring(0, 4);


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



// =====================================================
// SET ACTIVE NETWORK
// =====================================================

function setActiveNetwork(network) {

    networkButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.network === network
            );

        }
    );

}



// =====================================================
// DETECTED NETWORK DISPLAY
// =====================================================

function showDetectedNetwork(
    network
) {

    detectedNetworkName.textContent =
        network;


    detectedNetwork.classList.add(
        "show"
    );


    validatorLogo.innerHTML = `
        <img
            src="${networkImages[network]}"
            alt="${network}"
        >
    `;

}



// =====================================================
// RESET VALIDATOR
// =====================================================

function resetValidator() {

    detectedNetwork.classList.remove(
        "show"
    );


    validatorLogo.innerHTML =
        '<i class="fa-solid fa-mobile-screen"></i>';

}



// =====================================================
// ERROR
// =====================================================

function showPhoneError(message) {

    phoneError.textContent =
        message;


    phoneError.className =
        "error-message error";

}



// =====================================================
// SUCCESS
// =====================================================

function showPhoneSuccess(message) {

    phoneError.textContent =
        message;


    phoneError.className =
        "error-message success";

}



// =====================================================
// AMOUNT BUTTONS
// =====================================================

amountButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            if (isProcessing) {
                return;
            }


            amountButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            const amount =
                this.dataset.amount;


            if (amount === "custom") {

                customAmountBox.classList.add(
                    "show"
                );


                selectedAmount = 0;


                customAmount.focus();

            } else {

                customAmountBox.classList.remove(
                    "show"
                );


                selectedAmount =
                    Number(amount);

            }


            updateSummary();

        }
    );

});



// =====================================================
// CUSTOM AMOUNT
// =====================================================

customAmount.addEventListener(
    "input",
    function () {

        let value =
            this.value.replace(
                /[^\d]/g,
                ""
            );


        this.value = value;


        selectedAmount =
            Number(value || 0);


        updateSummary();

    }
);



// =====================================================
// VALIDATE AMOUNT
// =====================================================

function validateAmount() {

    if (!selectedAmount) {

        return false;

    }


    if (selectedAmount < 50) {

        return false;

    }


    if (selectedAmount > 50000) {

        return false;

    }


    return true;

}



// =====================================================
// UPDATE EVERYTHING
// =====================================================

function validateAndUpdate() {

    validatePhone();

    updateSummary();

}



// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary() {

    const phoneValid =
        validatePhoneSilently();


    summaryNetwork.textContent =
        selectedNetwork || "-";


    summaryPhone.textContent =
        phoneInput.value
            ? "+234" + phoneInput.value
            : "-";


    summaryAmount.textContent =
        formatMoney(
            selectedAmount
        );


    summaryBalance.textContent =
        formatMoney(
            walletBalance
        );


    summaryTotal.textContent =
        formatMoney(
            selectedAmount
        );



    const valid =
        phoneValid &&
        selectedNetwork &&
        validateAmount();



    if (valid) {

        summaryCard.classList.add(
            "show"
        );


        purchaseBtn.disabled =
            false;

    } else {

        summaryCard.classList.remove(
            "show"
        );


        purchaseBtn.disabled =
            true;

    }

}



// =====================================================
// SILENT PHONE VALIDATION
// =====================================================

function validatePhoneSilently() {

    const phone =
        phoneInput.value.trim();


    if (
        !/^\d{10}$/.test(phone)
    ) {

        return false;

    }


    const detected =
        detectNetwork(
            "0" + phone
        );


    if (!detected) {

        return false;

    }


    if (
        selectedNetwork &&
        selectedNetwork !== detected
    ) {

        return false;

    }


    return true;

}



// =====================================================
// MONEY FORMAT
// =====================================================

function formatMoney(amount) {

    return (
        "₦" +
        Number(amount || 0)
            .toLocaleString(
                "en-NG",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
    );

}



// =====================================================
// PURCHASE BUTTON
// =====================================================

purchaseBtn.addEventListener(
    "click",
    function () {

        if (isProcessing) {
            return;
        }


        // Final validation

        if (!validatePhone()) {

            return;

        }


        if (!validateAmount()) {

            pinError.textContent =
                "Enter a valid airtime amount.";

            return;

        }


        if (
            walletBalance <
            selectedAmount
        ) {

            pinError.textContent =
                "Insufficient wallet balance.";

            return;

        }


        // Reset PIN

        transactionPin.value = "";

        pinError.textContent = "";


        // Reset button

        confirmPurchaseBtn.disabled =
            false;


        confirmPurchaseBtn.innerHTML = `
            <span>Confirm Purchase</span>
            <i class="fa-solid fa-check"></i>
        `;


        pinModal.classList.add(
            "show"
        );


        setTimeout(() => {

            transactionPin.focus();

        }, 200);

    }
);



// =====================================================
// CLOSE PIN MODAL
// =====================================================

closePinModal.addEventListener(
    "click",
    function () {

        if (isProcessing) {
            return;
        }


        pinModal.classList.remove(
            "show"
        );

    }
);



// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

pinModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === pinModal &&
            !isProcessing
        ) {

            pinModal.classList.remove(
                "show"
            );

        }

    }
);



// =====================================================
// SHOW / HIDE PIN
// =====================================================

togglePin.addEventListener(
    "click",
    function () {

        if (
            transactionPin.type ===
            "password"
        ) {

            transactionPin.type =
                "text";


            this.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            transactionPin.type =
                "password";


            this.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }
);



// =====================================================
// PIN INPUT
// =====================================================

transactionPin.addEventListener(
    "input",
    function () {

        this.value =
            this.value
                .replace(/\D/g, "")
                .substring(0, 6);


        pinError.textContent = "";

    }
);



// =====================================================
// CONFIRM PURCHASE
// =====================================================

confirmPurchaseBtn.addEventListener(
    "click",
    async function () {

        if (isProcessing) {
            return;
        }


        const pin =
            transactionPin.value.trim();



        // =============================================
        // PIN VALIDATION
        // =============================================

        if (!pin) {

            pinError.textContent =
                "Enter your transaction PIN.";

            return;

        }


        if (pin.length < 4) {

            pinError.textContent =
                "Enter a valid transaction PIN.";

            return;

        }



        // =============================================
        // USER CHECK
        // =============================================

        if (!currentUser) {

            pinError.textContent =
                "Your session has expired. Please login again.";

            return;

        }



        // =============================================
        // CHECK PIN
        // =============================================
        //
        // This is only for your current
        // LocalStorage prototype.
        //
        // When backend is connected,
        // PIN verification MUST happen
        // on the server.
        //

        const savedPin =
            String(
                currentUser.transactionPin || ""
            );


        if (pin !== savedPin) {

            pinError.textContent =
                "Incorrect transaction PIN.";

            transactionPin.value = "";

            transactionPin.focus();

            return;

        }



        // =============================================
        // BALANCE CHECK
        // =============================================

        if (
            walletBalance <
            selectedAmount
        ) {

            pinError.textContent =
                "Insufficient wallet balance.";

            return;

        }



        // =============================================
        // START PROCESSING
        // =============================================

        isProcessing = true;


        confirmPurchaseBtn.disabled =
            true;


        confirmPurchaseBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Processing...</span>
        `;



        try {

            // =================================================
            // TEMPORARY FRONTEND DEMO
            // =================================================
            //
            // REMOVE THIS BLOCK when your backend API
            // is connected.
            //
            // =================================================

            await wait(2000);



            // Deduct from main wallet

            walletBalance -=
                selectedAmount;



            // Update current user

            currentUser.walletBalance =
                walletBalance;



            localStorage.setItem(
                "currentUser",
                JSON.stringify(
                    currentUser
                )
            );



            // Update UI

            updateBalanceDisplay();



            // Close PIN

            pinModal.classList.remove(
                "show"
            );


            // Show success

            showSuccess();



        } catch (error) {

            console.error(
                "Airtime purchase error:",
                error
            );


            pinError.textContent =
                "Something went wrong. Please try again.";


        } finally {

            isProcessing = false;


            confirmPurchaseBtn.disabled =
                false;


            confirmPurchaseBtn.innerHTML = `
                <span>Confirm Purchase</span>
                <i class="fa-solid fa-check"></i>
            `;

        }

    }
);



// =====================================================
// WAIT FUNCTION
// =====================================================

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}



// =====================================================
// SUCCESS
// =====================================================

function showSuccess() {

    const reference =
        "DANK" +
        Date.now();



    document.getElementById(
        "successNetwork"
    ).textContent =
        selectedNetwork;



    document.getElementById(
        "successPhone"
    ).textContent =
        "+234" +
        phoneInput.value;



    document.getElementById(
        "successAmount"
    ).textContent =
        formatMoney(
            selectedAmount
        );



    document.getElementById(
        "successReference"
    ).textContent =
        reference;



    successModal.classList.add(
        "show"
    );

}



// =====================================================
// DONE
// =====================================================

doneBtn.addEventListener(
    "click",
    function () {

        successModal.classList.remove(
            "show"
        );


        window.location.href =
            "dashboard.html";

    }
);



// =====================================================
// INITIAL STATE
// =====================================================

updateSummary();