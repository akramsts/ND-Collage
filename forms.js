(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const courseSelect = document.getElementById("courseSelect");
        const courseLabels = {
            bsc: "Bachelor of Science (B.Sc.)",
            ba: "Bachelor of Arts (B.A.)",
            bcom: "Bachelor of Commerce (B.Com)",
        };

        const flagFieldError = (el) => {
            if (!el) return;
            el.classList.add("field-error");
            window.setTimeout(() => el.classList.remove("field-error"), 2000);
        };

        document.querySelectorAll(".auto-select-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const selectedCourse = button.getAttribute("data-course");
                if (!courseSelect || !courseLabels[selectedCourse]) return;

                courseSelect.value = selectedCourse;
                courseSelect.classList.add("field-flash");
                window.setTimeout(() => courseSelect.classList.remove("field-flash"), 2000);
            });
        });

        const form = document.getElementById("applyForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const nameInput = form.querySelector('[name="fullName"]');
                const phoneInput = form.querySelector('[name="mobileNumber"]');

                const nameValid = !!(nameInput && nameInput.value.trim());
                
                let rawPhone = phoneInput ? phoneInput.value.trim() : "";
                let cleanPhone = rawPhone.replace(/[\s\-\(\)]/g, ''); 
                
                if (cleanPhone.startsWith('+91')) cleanPhone = cleanPhone.slice(3);
                else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
                else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);
                
                const phoneValid = /^[0-9]{10}$/.test(cleanPhone);
                if (phoneValid && phoneInput) phoneInput.value = cleanPhone;

                const courseValid = !!(courseSelect && courseSelect.value);

                if (!nameValid) flagFieldError(nameInput);
                
                if (!phoneValid) {
                    flagFieldError(phoneInput);
                    if (phoneInput) {
                        phoneInput.value = "";
                        phoneInput.placeholder = "Enter valid 10 digits";
                        setTimeout(() => phoneInput.placeholder = "Mobile Number", 3000);
                    }
                }
                
                if (!courseValid) flagFieldError(courseSelect);

                if (!nameValid || !phoneValid || !courseValid) {
                    const firstInvalid = !nameValid ? nameInput : (!phoneValid ? phoneInput : courseSelect);
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                const btn = e.target.querySelector("button");
                const originalText = btn.innerText;

                btn.innerText = "Inquiry Sent Successfully!";
                btn.classList.add("btn-success");
                e.target.reset();

                const textarea = document.getElementById("inquiryText");
                if (textarea) textarea.style.height = "auto";

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