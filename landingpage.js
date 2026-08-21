










const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.onclick = () => {
    sidebar.classList.add("active");
};

closeBtn.onclick = () => {
    sidebar.classList.remove("active");
};

document.addEventListener("click", (e) => {
    if (
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {
        sidebar.classList.remove("active");
    }
});



// Close sidebar when any menu item is clicked
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });
});