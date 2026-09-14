(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const navbar = document.querySelector(".capsule-nav");
        const scrollTopBtn = document.querySelector(".scroll-top");
        const menuBtn = document.querySelector(".mobile-menu-btn");
        const navLinks = document.querySelector(".nav-links");
        const overlay = document.querySelector(".menu-overlay");
        const iconBars = document.getElementById("icon-bars");
        const iconClose = document.getElementById("icon-close");

        if (navbar || scrollTopBtn) {
            let ticking = false;

            const updateOnScroll = () => {
                const scrolled = window.scrollY > 50;
                if (navbar) navbar.classList.toggle("scrolled", scrolled);
                if (scrollTopBtn) scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
                ticking = false;
            };

            window.addEventListener(
                "scroll",
                () => {
                    if (!ticking) {
                        requestAnimationFrame(updateOnScroll);
                        ticking = true;
                    }
                },
                { passive: true }
            );

            updateOnScroll();
        }

        if (menuBtn && navLinks) {
            const toggleMenu = () => {
                const isOpen = navLinks.classList.toggle("active");
                if (overlay) overlay.classList.toggle("active");

                if (iconBars && iconClose) {
                    iconBars.classList.toggle("is-hidden", isOpen);
                    iconClose.classList.toggle("is-hidden", !isOpen);
                }

                menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
                document.body.style.overflow = isOpen ? "hidden" : "";
            };

            menuBtn.addEventListener("click", toggleMenu);
            if (overlay) overlay.addEventListener("click", toggleMenu);

            navLinks.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    if (navLinks.classList.contains("active")) toggleMenu();
                });
            });

            window.addEventListener("resize", () => {
                if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
                    toggleMenu();
                }
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && navLinks.classList.contains("active")) {
                    toggleMenu();
                    menuBtn.focus();
                }
            });
        }
    });
})();
