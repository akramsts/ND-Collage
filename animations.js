(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const reveals = document.querySelectorAll(".reveal");
        if (!reveals.length) return;

        const startCounters = (scope) => {
            const counters = scope.querySelectorAll(".counter");
            counters.forEach((counter) => {
                if (counter.dataset.counted === "true") return;
                counter.dataset.counted = "true";

                const target = +counter.getAttribute("data-target");
                const duration = 2000;
                const startTime = performance.now();

                const tick = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const current = Math.ceil(progress * target);
                    counter.innerText = current;
                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        counter.innerText = target;
                    }
                };
                requestAnimationFrame(tick);
            });
        };

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            reveals.forEach((el) => {
                el.classList.add("active");
                if (el.classList.contains("stats-grid")) {
                    el.querySelectorAll(".counter").forEach((counter) => {
                        counter.innerText = counter.getAttribute("data-target");
                    });
                }
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("active");
                    if (entry.target.classList.contains("stats-grid")) {
                        startCounters(entry.target);
                    }
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );

        reveals.forEach((el) => observer.observe(el));
    });
})();
