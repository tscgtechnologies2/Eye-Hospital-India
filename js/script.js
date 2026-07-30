/**
 * Eye Hospital - Pure Vanilla JavaScript (ES6)
 * Features:
 * 1. Sticky Navigation & Active Scroll Spy
 * 2. Mobile Drawer Menu Toggle
 * 3. Animated Statistics Counter
 * 4. IntersectionObserver Scroll Reveal
 * 5. Interactive Before/After Vision Slider (Mouse & Touch)
 * 6. Testimonials Carousel Slider
 * 7. Gallery Filter & Modal Lightbox
 * 8. FAQ Accordion Toggle
 * 9. Appointment Modal & Form Validation with Toast Feedback
 * 10. Smooth Scrolling & Back-to-Top Button
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Sticky Header & Active Nav Link ScrollSpy
       ========================================================================== */
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.querySelector('.back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky Header shadow
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Active link scrollspy
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // Back to top button click event
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       2. Mobile Navigation Drawer Toggle
       ========================================================================== */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. Animated Statistics Counter (IntersectionObserver)
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // ms
            const stepTime = 20;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.innerHTML = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
            }, stepTime);
        });
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateCounters();
                    animatedStats = true;
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       4. Scroll Reveal Animations (IntersectionObserver)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ==========================================================================
       5. Vision Transformation Before & After Comparison Slider
       ========================================================================== */
    const baWrapper = document.querySelector('.ba-slider-wrapper');
    const baAfterImg = document.querySelector('.ba-image-after');
    const baHandle = document.querySelector('.ba-handle');

    if (baWrapper && baAfterImg && baHandle) {
        let isDragging = false;

        const setSliderPosition = (x) => {
            const rect = baWrapper.getBoundingClientRect();
            let offsetX = x - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percentage = (offsetX / rect.width) * 100;
            baAfterImg.style.width = `${percentage}%`;
            baHandle.style.left = `${percentage}%`;
        };

        const onStart = (e) => {
            isDragging = true;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setSliderPosition(x);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setSliderPosition(x);
        };

        const onEnd = () => {
            isDragging = false;
        };

        baWrapper.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        baWrapper.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);
    }

    /* ==========================================================================
       6. Testimonials Carousel Slider
       ========================================================================== */
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.testimonial-next');
    const prevBtn = document.querySelector('.testimonial-prev');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let autoplayTimer = null;

        // Create pagination dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testimonial-dot');

        const updateDots = () => {
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        };

        const goToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoplay();
            });
        }

        const startAutoplay = () => {
            autoplayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 6000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayTimer);
            startAutoplay();
        };

        startAutoplay();
    }

    /* ==========================================================================
       7. Hospital Gallery Filters & Lightbox Modal
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Filtering logic
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Lightbox modal logic
    if (galleryItems.length > 0 && lightboxModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-overlay h4')?.textContent || 'Hospital Facility';
                const desc = item.querySelector('.gallery-overlay p')?.textContent || 'Eye Hospital';

                if (img && lightboxImg) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt || title;
                }
                if (lightboxCaption) {
                    lightboxCaption.innerHTML = `<strong>${title}</strong> - ${desc}`;
                }

                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       8. FAQ Accordion Toggle
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other items for single accordion behavior
                faqItems.forEach(other => other.classList.remove('active'));

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       9. Modal & Appointment Form Handler + Validation + Toast
       ========================================================================== */
    const appointmentModal = document.querySelector('#appointmentModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const bookButtons = document.querySelectorAll('[data-open-modal="appointment"]');
    const toast = document.querySelector('.toast');

    // Toast Notice helper
    const showToast = (message = 'Appointment Request Received Successfully!') => {
        if (!toast) return;
        const toastMsg = toast.querySelector('.toast-message');
        if (toastMsg) toastMsg.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // Modal Triggers
    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (appointmentModal) {
                appointmentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalCloseBtn && appointmentModal) {
        modalCloseBtn.addEventListener('click', () => {
            appointmentModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        appointmentModal.addEventListener('click', (e) => {
            if (e.target === appointmentModal) {
                appointmentModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Generic Form Validation Handler
    const handleFormSubmit = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = form.querySelector('[name="name"]');
            const phoneInput = form.querySelector('[name="phone"]');
            const emailInput = form.querySelector('[name="email"]');
            let isValid = true;

            // Name check
            if (nameInput) {
                if (nameInput.value.trim().length < 2) {
                    nameInput.style.borderColor = '#EF4444';
                    isValid = false;
                } else {
                    nameInput.style.borderColor = '';
                }
            }

            // Phone check (digits length check)
            if (phoneInput) {
                const phoneRegex = /^[0-9]{10}$/;
                const cleanedPhone = phoneInput.value.replace(/\D/g, '');
                if (!phoneRegex.test(cleanedPhone)) {
                    phoneInput.style.borderColor = '#EF4444';
                    isValid = false;
                } else {
                    phoneInput.style.borderColor = '';
                }
            }

            // Email check
            if (emailInput && emailInput.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    emailInput.style.borderColor = '#EF4444';
                    isValid = false;
                } else {
                    emailInput.style.borderColor = '';
                }
            }

            if (isValid) {
                // If inside modal, close modal
                if (appointmentModal && appointmentModal.classList.contains('active')) {
                    appointmentModal.classList.remove('active');
                    document.body.style.overflow = '';
                }

                form.reset();
                showToast('Thank you! Our patient counselor will call you back shortly.');
            }
        });
    };

    handleFormSubmit('mainAppointmentForm');
    handleFormSubmit('modalAppointmentForm');

    /* Newsletter Form */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]');
            if (email && email.value.trim() !== '') {
                email.value = '';
                showToast('Subscribed to Eye Hospital updates successfully!');
            }
        });
    }

});
