const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");

menuBtn.addEventListener("click", navToggle)

function navToggle() {
    menuBtn.classList.toggle("open");
    mobileNav.classList.toggle("flex");
    mobileNav.classList.toggle("hidden");
}

const themeToggle = document.getElementById("theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme() {
    let theme;
    try { theme = localStorage.getItem("theme"); } catch (e) {}
    const dark = theme ? theme === "dark" : darkQuery.matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

// Click flips the theme; picking the same one as the OS drops the override,
// so the site goes back to following the system.
themeToggle.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    const system = darkQuery.matches ? "dark" : "light";
    try {
        if (next === system) localStorage.removeItem("theme");
        else localStorage.setItem("theme", next);
    } catch (e) {}
    applyTheme();
});

darkQuery.addEventListener("change", applyTheme);
