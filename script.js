document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const iconMoon = document.getElementById('icon-moon');
    const iconSun = document.getElementById('icon-sun');

    const setTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        if (iconMoon && iconSun) {
            iconMoon.style.display = theme === 'dark' ? 'none' : 'block';
            iconSun.style.display = theme === 'dark' ? 'block' : 'none';
        }
        localStorage.setItem('theme', theme);
    };

    if (localStorage.getItem('theme') === 'dark') {
        setTheme('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
        });
    }

    const navbar = document.querySelector('.capsule-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const iconBars = document.getElementById('icon-bars');
    const iconClose = document.getElementById('icon-close');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        if (iconBars && iconClose) {
            iconBars.style.display = isOpen ? 'none' : 'block';
            iconClose.style.display = isOpen ? 'block' : 'none';
        }
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) toggleMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - 50) {
                reveal.classList.add('active');
                if (reveal.classList.contains('stats-grid') && !countersStarted) {
                    startCounters();
                    countersStarted = true;
                }
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    setTimeout(revealOnScroll, 100);

    if (typeof Swiper !== 'undefined') {
        new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    const customSelectWrapper = document.getElementById('customCourseSelect');
    const courseHiddenInput = document.getElementById('courseSelect');
    const courseLabels = {
        bsc: 'Bachelor of Science (B.Sc.)',
        ba: 'Bachelor of Arts (B.A.)',
        bcom: 'Bachelor of Commerce (B.Com)'
    };
    let customSelectTrigger, customSelectText;

    const resetCustomSelect = () => {
        if (customSelectText) customSelectText.innerText = "Select Course of Interest";
        if (courseHiddenInput) courseHiddenInput.value = "";
        if (customSelectTrigger) customSelectTrigger.classList.remove('filled');
    };

    if (customSelectWrapper) {
        customSelectTrigger = customSelectWrapper.querySelector('.custom-select-trigger');
        customSelectText = customSelectWrapper.querySelector('.custom-select-text');
        const options = customSelectWrapper.querySelectorAll('.custom-option');

        customSelectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelectWrapper.classList.toggle('open');
            customSelectTrigger.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', function () {
                customSelectText.innerText = this.innerText;
                courseHiddenInput.value = this.getAttribute('data-value');
                customSelectTrigger.classList.add('filled');
                customSelectWrapper.classList.remove('open');
                customSelectTrigger.classList.remove('active');
                customSelectTrigger.style.borderColor = "";
                customSelectText.style.color = "";
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('open');
                customSelectTrigger.classList.remove('active');
            }
        });

        document.querySelectorAll('.auto-select-btn').forEach(button => {
            button.addEventListener('click', () => {
                const selectedCourse = button.getAttribute('data-course');
                if (!courseHiddenInput || !customSelectText || !courseLabels[selectedCourse]) return;

                courseHiddenInput.value = selectedCourse;
                customSelectText.innerText = courseLabels[selectedCourse];
                customSelectTrigger.classList.add('filled');
                customSelectTrigger.style.borderColor = "var(--primary)";
                setTimeout(() => { customSelectTrigger.style.borderColor = ""; }, 2000);
            });
        });
    }

    const form = document.getElementById('applyForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Hidden <input required> is NOT enforced by browsers, so validate manually here.
            if (!courseHiddenInput || !courseHiddenInput.value) {
                if (customSelectTrigger) {
                    customSelectTrigger.style.borderColor = "#ef4444";
                    setTimeout(() => { customSelectTrigger.style.borderColor = ""; }, 2000);
                }
                if (customSelectText) {
                    customSelectText.style.color = "#ef4444";
                    setTimeout(() => { customSelectText.style.color = ""; }, 2000);
                }
                return;
            }

            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = "Inquiry Sent Successfully!";
            btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
            btn.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
            e.target.reset();

            const textarea = document.getElementById('inquiryText');
            if (textarea) textarea.style.height = 'auto';

            resetCustomSelect();

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.boxShadow = "";
            }, 4000);
        });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();

    const textarea = document.getElementById('inquiryText');
    if (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});