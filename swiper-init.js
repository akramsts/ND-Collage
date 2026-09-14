(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const el = document.querySelector(".mySwiper");
        if (!el || typeof Swiper === "undefined") return;

        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            a11y: {
                enabled: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            },
        });
    });
})();
