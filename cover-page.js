(function () {
    "use strict";

    const fieldMap = [
        ["in-topic", "out-topic", "Assignment / Project"],
        ["in-session", "out-session", "Session: 2024-2028", true],
        ["in-name", "out-name", "Student Name"],
        ["in-sem", "out-sem", "Semester - I"],
        ["in-roll", "out-roll", "Roll Number"],
        ["in-reg", "out-reg", "Registration No"],
        ["in-subject", "out-subject", "Subject Name"],
        ["in-paper", "out-paper", "Paper Code/Name"],
    ];

    const A4_WIDTH_PX = 793.7;
    const A4_HEIGHT_PX = 1122.5;

    function fitA4Preview() {
        const wrapper = document.getElementById("a4ScaleWrapper");
        const sheet = document.getElementById("print-area");
        if (!wrapper || !sheet) return;

        if (window.innerWidth > 768) {
            sheet.style.transform = "";
            wrapper.style.height = "";
            return;
        }

        const scale = wrapper.clientWidth / A4_WIDTH_PX;
        sheet.style.transform = `scale(${scale})`;
        wrapper.style.height = `${A4_HEIGHT_PX * scale}px`;
    }

    function formatDate(dateStr) {
        if (!dateStr) return "DD / MM / YYYY";
        const parts = dateStr.split("-");
        return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
    }

    function goToStep2() {
        fieldMap.forEach(([inputId, outputId, fallback, addPrefix]) => {
            const inputEl = document.getElementById(inputId);
            const outputEl = document.getElementById(outputId);
            if (!inputEl || !outputEl) return;

            let val = inputEl.value.trim();
            if (val && addPrefix) val = "Session: " + val;
            outputEl.innerText = val || fallback;
        });

        const dateInput = document.getElementById("in-date");
        const dateOutput = document.getElementById("out-date");
        if (dateInput && dateOutput) dateOutput.innerText = formatDate(dateInput.value);

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

    document.addEventListener("DOMContentLoaded", () => {
        const generateBtn = document.getElementById("generate-btn");
        const editBtn = document.getElementById("edit-btn");
        const printBtn = document.getElementById("print-btn");

        if (generateBtn) generateBtn.addEventListener("click", goToStep2);
        if (editBtn) editBtn.addEventListener("click", goToStep1);
        if (printBtn) printBtn.addEventListener("click", () => window.print());

        window.addEventListener("resize", fitA4Preview);
    });
})();