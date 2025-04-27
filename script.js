// Utility Functions
const elementExists = (id) => document.getElementById(id) !== null;
const isMobile = () => window.innerWidth <= 768;

// Mobile Menu
const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (!mobileMenuBtn || !navLinks) return;

    const toggleMenu = (show) => {
        mobileMenuBtn.classList.toggle('active', show);
        navLinks.classList.toggle('active', show);
        body.style.overflow = show ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.contains('active');
        toggleMenu(!isActive);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-content') && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
};

// Dropdown Menu Functionality
const initDropdownMenu = () => {
    // Only apply this on mobile
    if (isMobile()) {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            });
        });
    }
};

// Testimonials Slider with Swipe Support
class TestimonialSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.testimonial');
        if (this.slides.length <= 1) return;

        this.currentSlide = 0;
        this.total = this.slides.length;
        this.interval = null;
        this.isHovered = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.createNavigation();
        this.showSlide(0);
        this.startAutoPlay();
        this.handleHover();
        this.handleSwipe();
    }

    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        
        const dots = document.createElement('div');
        dots.className = 'testimonial-dots';
        
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dots.appendChild(dot);
        }
        
        nav.appendChild(dots);
        this.container.appendChild(nav);
        this.dots = dots.children;
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            if (this.dots) {
                this.dots[i].classList.toggle('active', i === index);
            }
        });
        this.currentSlide = index;
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    nextSlide() {
        this.showSlide((this.currentSlide + 1) % this.total);
        this.resetAutoPlay();
    }

    prevSlide() {
        this.showSlide((this.currentSlide - 1 + this.total) % this.total);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.interval = setInterval(() => {
            if (!this.isHovered) {
                this.showSlide((this.currentSlide + 1) % this.total);
            }
        }, 5000);
    }

    resetAutoPlay() {
        clearInterval(this.interval);
        this.startAutoPlay();
    }

    handleHover() {
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });
    }

    handleSwipe() {
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture();
        }, { passive: true });
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0) {
            // Swiped left - next slide
            this.nextSlide();
        } else {
            // Swiped right - previous slide
            this.prevSlide();
        }
    }
}

// Gallery Slider with Swipe Support
class GallerySlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.gallery-slide');
        if (this.slides.length <= 1) return;
        
        this.currentSlide = 0;
        this.total = this.slides.length;
        this.interval = null;
        this.isHovered = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createNavigation();
        this.showSlide(0);
        this.startAutoPlay();
        this.handleHover();
        this.handleNavigation();
        this.handleSwipe();
    }
    
    createNavigation() {
        const dotsContainer = document.querySelector('.gallery-dots');
        if (!dotsContainer) return;
        
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        this.dots = dotsContainer.children;
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            if (this.dots) {
                this.dots[i].classList.toggle('active', i === index);
            }
        });
        this.currentSlide = index;
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }
    
    nextSlide() {
        this.showSlide((this.currentSlide + 1) % this.total);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.showSlide((this.currentSlide - 1 + this.total) % this.total);
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        this.interval = setInterval(() => {
            if (!this.isHovered) {
                this.nextSlide();
            }
        }, 5000);
    }
    
    resetAutoPlay() {
        clearInterval(this.interval);
        this.startAutoPlay();
    }
    
    handleHover() {
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });
    }
    
    handleNavigation() {
        const prevButton = document.querySelector('.gallery-prev');
        const nextButton = document.querySelector('.gallery-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.nextSlide();
            });
        }
    }

    handleSwipe() {
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture();
        }, { passive: true });
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0) {
            // Swiped left - next slide
            this.nextSlide();
        } else {
            // Swiped right - previous slide
            this.prevSlide();
        }
    }
}

// Initialize FAQ Accordion
const initFaqAccordion = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Close all other items
            faqQuestions.forEach(item => {
                if (item !== question) {
                    item.classList.remove('active');
                    const answer = item.nextElementSibling;
                    answer.style.maxHeight = null;
                }
            });
            
            // Toggle current item
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
};

// Initialize scroll animations
const initScrollAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        }
    );

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDropdownMenu();
    new TestimonialSlider('testimonialSlider');
    if (elementExists('gallerySlider')) {
        new GallerySlider('gallerySlider');
    }
    initFaqAccordion();
    initScrollAnimations();

    // Update copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Handle window resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (isMobile()) {
            document.body.style.overflow = '';
        }
    }, 250);
});
