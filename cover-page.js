(function () {
    "use strict";

    // Map each form input (by ID) to its output class (shared across every template).
    // addPrefix=true prepends a label before the raw value (used for Session).
    const fieldMap = [
        ["in-topic", ".out-topic", "Assignment / Project"],
        ["in-session", ".out-session", "Session: 2024-2028", true],
        ["in-name", ".out-name", "Student Name"],
        ["in-sem", ".out-sem", "Semester - I"],
        ["in-roll", ".out-roll", "Roll Number"],
        ["in-reg", ".out-reg", "Registration No"],
        ["in-subject", ".out-subject", "Subject Name"],
        ["in-paper", ".out-paper", "Paper Code/Name"],
    ];

    const A4_WIDTH_PX = 793.7;
    const A4_HEIGHT_PX = 1122.5;

    // Shrinks every template on screen to fit narrow (mobile) viewports.
    function fitA4Preview() {
        const wrappers = document.querySelectorAll(".a4-scale-wrapper");
        wrappers.forEach((wrapper) => {
            const sheet = wrapper.querySelector(".a4-sheet");
            if (!sheet) return;

            if (window.innerWidth > 768) {
                sheet.style.transform = "";
                wrapper.style.height = "";
                return;
            }

            const scale = wrapper.clientWidth / A4_WIDTH_PX;
            sheet.style.transform = `scale(${scale})`;
            wrapper.style.height = `${A4_HEIGHT_PX * scale}px`;
        });
    }

    function formatDate(dateStr) {
        if (!dateStr) return "DD / MM / YYYY";
        const parts = dateStr.split("-");
        return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
    }

    function goToStep2() {
        // Read the form once, then push each value into every matching output class,
        // across every template on the page, in one pass.
        fieldMap.forEach(([inputId, outputSelector, fallback, addPrefix]) => {
            const inputEl = document.getElementById(inputId);
            const outputElements = document.querySelectorAll(outputSelector);
            if (!inputEl || outputElements.length === 0) return;

            let val = inputEl.value.trim();
            if (val && addPrefix) val = "Session: " + val;

            outputElements.forEach((el) => {
                el.innerText = val || fallback;
            });
        });

        // Date is formatted separately and applied to every .out-date across all templates.
        const dateInput = document.getElementById("in-date");
        const dateOutputs = document.querySelectorAll(".out-date");
        if (dateInput && dateOutputs.length > 0) {
            const formattedDate = formatDate(dateInput.value);
            dateOutputs.forEach((el) => (el.innerText = formattedDate));
        }

        const step1 = document.getElementById("step-1");
        const step2 = document.getElementById("step-2");
        step1.classList.remove("active");
        step1.setAttribute("aria-hidden", "true");
        step2.classList.add("active");
        step2.setAttribute("aria-hidden", "false");

        step2.setAttribute("tabindex", "-1");
        step2.focus({ preventScroll: true });

        fitA4Preview();
        window.scrollTo(0, 0);
    }

    function goToStep1() {
        const step1 = document.getElementById("step-1");
        const step2 = document.getElementById("step-2");
        step2.classList.remove("active");
        step2.setAttribute("aria-hidden", "true");
        step1.classList.add("active");
        step1.setAttribute("aria-hidden", "false");
        window.scrollTo(0, 0);
    }

    // Marks only the clicked template's wrapper as print-active, waits 50ms for the
    // DOM/class change to actually paint, then opens the browser print dialog.
    window.printTemplate = function (btnElement) {
        document.querySelectorAll(".template-wrapper").forEach((w) => w.classList.remove("print-active"));
        const currentWrapper = btnElement.closest(".template-wrapper");
        if (!currentWrapper) return;

        currentWrapper.classList.add("print-active");

        // Critical fix: give the browser a tick to apply the print-active class
        // before triggering print, otherwise Safari/Chrome can print a blank page.
        window.setTimeout(() => {
            window.print();
        }, 50);
    };

    // Critical fix: if the user prints via Ctrl+P / browser menu instead of a
    // template's own button, no wrapper will have .print-active yet — default
    // to the first template so print never produces a blank page.
    window.addEventListener("beforeprint", () => {
        const hasActive = document.querySelector(".template-wrapper.print-active");
        if (!hasActive) {
            const firstWrapper = document.querySelector(".template-wrapper");
            if (firstWrapper) firstWrapper.classList.add("print-active");
        }
    });

    // Clean up after printing so a later Ctrl+P doesn't stick to whichever
    // template was printed last.
    window.addEventListener("afterprint", () => {
        document.querySelectorAll(".template-wrapper").forEach((w) => w.classList.remove("print-active"));
    });

    document.addEventListener("DOMContentLoaded", () => {
        const generateBtn = document.getElementById("generate-btn");
        const editBtn = document.getElementById("edit-btn");

        if (generateBtn) generateBtn.addEventListener("click", goToStep2);
        if (editBtn) editBtn.addEventListener("click", goToStep1);

        window.addEventListener("resize", fitA4Preview);
    });
})();