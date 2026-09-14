(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const yearEl = document.getElementById("year");
        if (yearEl) yearEl.innerText = new Date().getFullYear();
    });
})();
