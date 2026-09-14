(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const html = document.documentElement;
        const themeBtn = document.getElementById("theme-toggle");
        const iconMoon = document.getElementById("icon-moon");
        const iconSun = document.getElementById("icon-sun");

        if (!themeBtn) return;

        const applyIcons = (theme) => {
            if (!iconMoon || !iconSun) return;
            iconMoon.classList.toggle("is-hidden", theme === "dark");
            iconSun.classList.toggle("is-hidden", theme !== "dark");
        };

        const setTheme = (theme) => {
            html.setAttribute("data-theme", theme);
            applyIcons(theme);
            themeBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
            try {
                localStorage.setItem("theme", theme);
            } catch (err) {
                console.warn("Could not save theme preference:", err);
            }
        };

        applyIcons(html.getAttribute("data-theme") || "light");
        themeBtn.setAttribute(
            "aria-pressed",
            html.getAttribute("data-theme") === "dark" ? "true" : "false"
        );

        themeBtn.addEventListener("click", () => {
            const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
            setTheme(next);
        });
    });
})();
