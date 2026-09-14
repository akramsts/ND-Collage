(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const wrapper = document.getElementById("customCourseSelect");
        const hiddenInput = document.getElementById("courseSelect");
        const courseLabels = {
            bsc: "Bachelor of Science (B.Sc.)",
            ba: "Bachelor of Arts (B.A.)",
            bcom: "Bachelor of Commerce (B.Com)",
        };

        let trigger, triggerText, options, listbox;

        const clearFieldError = () => {
            if (trigger) trigger.classList.remove("field-error");
            if (triggerText) triggerText.classList.remove("field-error");
        };

        const flagFieldError = () => {
            if (trigger) trigger.classList.add("field-error");
            if (triggerText) triggerText.classList.add("field-error");
            window.setTimeout(clearFieldError, 2000);
        };

        const closeDropdown = ({ focusTrigger = false } = {}) => {
            wrapper.classList.remove("open");
            trigger.classList.remove("active");
            trigger.setAttribute("aria-expanded", "false");
            if (focusTrigger) trigger.focus();
        };

        const openDropdown = () => {
            wrapper.classList.add("open");
            trigger.classList.add("active");
            trigger.setAttribute("aria-expanded", "true");
        };

        const focusOption = (index) => {
            const clamped = Math.max(0, Math.min(index, options.length - 1));
            options[clamped].focus();
        };

        const selectOption = (option) => {
            triggerText.innerText = option.innerText;
            hiddenInput.value = option.getAttribute("data-value");
            trigger.classList.add("filled");
            options.forEach((o) => o.setAttribute("aria-selected", o === option ? "true" : "false"));
            closeDropdown({ focusTrigger: true });
        };

        const resetCustomSelect = () => {
            if (!triggerText || !hiddenInput || !trigger) return;
            triggerText.innerText = "Select Course of Interest";
            hiddenInput.value = "";
            trigger.classList.remove("filled");
            if (options) options.forEach((o) => o.setAttribute("aria-selected", "false"));
        };

        if (wrapper && hiddenInput) {
            trigger = wrapper.querySelector(".custom-select-trigger");
            triggerText = wrapper.querySelector(".custom-select-text");
            listbox = wrapper.querySelector(".custom-select-options");
            options = Array.from(wrapper.querySelectorAll(".custom-option"));

            trigger.setAttribute("role", "button");
            trigger.setAttribute("tabindex", "0");
            trigger.setAttribute("aria-haspopup", "listbox");
            trigger.setAttribute("aria-expanded", "false");
            trigger.setAttribute("aria-label", "Course of interest");
            if (listbox) {
                listbox.setAttribute("role", "listbox");
                listbox.setAttribute("aria-label", "Course options");
            }
            options.forEach((option) => {
                option.setAttribute("role", "option");
                option.setAttribute("tabindex", "-1");
                option.setAttribute("aria-selected", "false");
            });

            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                if (wrapper.classList.contains("open")) {
                    closeDropdown();
                } else {
                    openDropdown();
                }
            });

            trigger.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                    e.preventDefault();
                    openDropdown();
                    focusOption(0);
                } else if (e.key === "Escape") {
                    closeDropdown();
                }
            });

            options.forEach((option, index) => {
                option.addEventListener("click", () => selectOption(option));

                option.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        focusOption(index + 1);
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        focusOption(index - 1);
                    } else if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectOption(option);
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        closeDropdown({ focusTrigger: true });
                    } else if (e.key === "Tab") {
                        closeDropdown();
                    }
                });
            });

            document.addEventListener("click", (e) => {
                if (!wrapper.contains(e.target)) closeDropdown();
            });

            // Quick-select buttons on each program card ("Apply for B.Sc." etc.)
            document.querySelectorAll(".auto-select-btn").forEach((button) => {
                button.addEventListener("click", () => {
                    const selectedCourse = button.getAttribute("data-course");
                    if (!courseLabels[selectedCourse]) return;

                    hiddenInput.value = selectedCourse;
                    triggerText.innerText = courseLabels[selectedCourse];
                    trigger.classList.add("filled");
                    options.forEach((o) =>
                        o.setAttribute(
                            "aria-selected",
                            o.getAttribute("data-value") === selectedCourse ? "true" : "false"
                        )
                    );
                    trigger.classList.add("field-flash");
                    window.setTimeout(() => trigger.classList.remove("field-flash"), 2000);
                });
            });
        }

        const form = document.getElementById("applyForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                if (!hiddenInput || !hiddenInput.value) {
                    flagFieldError();
                    if (trigger) trigger.focus();
                    return;
                }

                const btn = e.target.querySelector("button");
                const originalText = btn.innerText;

                btn.innerText = "Inquiry Sent Successfully!";
                btn.classList.add("btn-success");
                e.target.reset();

                const textarea = document.getElementById("inquiryText");
                if (textarea) textarea.style.height = "auto";

                resetCustomSelect();

                window.setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove("btn-success");
                }, 4000);
            });
        }

        const textarea = document.getElementById("inquiryText");
        if (textarea) {
            textarea.addEventListener("input", function () {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            });
        }
    });
})();
