document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Dark Mode Toggle (with LocalStorage)
    // ==========================================
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeBtn.querySelector('i');

    if(localStorage.getItem('theme') === 'dark') {
        html.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeBtn.addEventListener('click', () => {
        if (html.getAttribute('data-theme') === 'light') {
            html.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark'); 
        } else {
            html.setAttribute('data-theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light'); 
        }
    });

    // ==========================================
    // 2. Smart Capsule Navbar & Mobile Menu
    // ==========================================
    const navbar = document.querySelector('.capsule-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    const scrollTopBtn = document.querySelector('.scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        const i = menuBtn.querySelector('i');
        i.classList.toggle('fa-bars');
        i.classList.toggle('fa-xmark');
        
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) toggleMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // ==========================================
    // 3. Scroll Reveal Animations & Number Counters
    // ==========================================
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

    // ==========================================
    // 4. Initialize Swiper.js (Testimonials Carousel)
    // ==========================================
    if(typeof Swiper !== 'undefined') {
        const swiper = new Swiper(".mySwiper", {
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
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // ==========================================
    // 5. Admissions Form Submission Simulation
    // ==========================================
    const form = document.getElementById('applyForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = "Inquiry Sent Successfully!";
            btn.style.background = "linear-gradient(135deg, #10b981, #059669)"; 
            btn.style.boxShadow = "0 10px 20px rgba(16, 185, 129, 0.3)";
            e.target.reset(); 
            
            // Textarea height reset in case it auto-expanded
            const textarea = document.getElementById('inquiryText');
            if (textarea) textarea.style.height = 'auto';
            
            // Custom Select reset
            const customSelectTrigger = document.querySelector('.custom-select-trigger');
            const customSelectText = document.querySelector('.custom-select-text');
            const hiddenInput = document.getElementById('courseSelect');
            if (customSelectTrigger && customSelectText && hiddenInput) {
                customSelectText.innerText = "Select Course of Interest";
                hiddenInput.value = "";
                customSelectTrigger.classList.remove('filled');
            }
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = ""; 
                btn.style.boxShadow = "";
            }, 4000);
        });
    }

    // ==========================================
    // 6. Dynamic Footer Year
    // ==========================================
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.innerText = new Date().getFullYear();

    // ==========================================
    // 7. Auto-Select Course & Custom Dropdown Logic
    // ==========================================
    const courseButtons = document.querySelectorAll('.auto-select-btn');
    const customSelectWrapper = document.getElementById('customCourseSelect');
    const hiddenInput = document.getElementById('courseSelect');
    
    if (customSelectWrapper) {
        const trigger = customSelectWrapper.querySelector('.custom-select-trigger');
        const text = customSelectWrapper.querySelector('.custom-select-text');
        const options = customSelectWrapper.querySelectorAll('.custom-option');

        // Dropdown open/close logic
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            customSelectWrapper.classList.toggle('open');
            trigger.classList.toggle('active');
        });

        // Option click logic
        options.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const label = this.innerText;

                // Update text and hidden input
                text.innerText = label;
                hiddenInput.value = value;
                trigger.classList.add('filled');

                // Close dropdown
                customSelectWrapper.classList.remove('open');
                trigger.classList.remove('active');
                trigger.style.borderColor = "";
            });
        });

        // Click outside to close dropdown
        document.addEventListener('click', function(e) {
            if (!customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('open');
                trigger.classList.remove('active');
            }
        });

        // Update Auto-Select Logic from Course Cards
        courseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCourse = button.getAttribute('data-course');
                
                if (hiddenInput && text) {
                    hiddenInput.value = selectedCourse;
                    trigger.classList.add('filled');
                    
                    // Set matched text
                    if(selectedCourse === 'bsc') text.innerText = 'Bachelor of Science (B.Sc.)';
                    if(selectedCourse === 'ba') text.innerText = 'Bachelor of Arts (B.A.)';
                    if(selectedCourse === 'bcom') text.innerText = 'Bachelor of Commerce (B.Com)';
                    
                    // Highlight effect
                    trigger.style.borderColor = "var(--primary)";
                    setTimeout(() => { trigger.style.borderColor = ""; }, 2000);
                }
            });
        });
    }

    // ==========================================
    // 8. Auto-Resize Textarea
    // ==========================================
    const textarea = document.getElementById('inquiryText');
    if (textarea) {
        textarea.addEventListener('input', function() {
            // Reset height first to calculate correct scrollHeight if text is deleted
            this.style.height = 'auto';
            // Set the exact height based on the typed content
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
});