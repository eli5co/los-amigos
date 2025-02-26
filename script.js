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

// Seasonal Service Indicator
const initSeasonalServices = () => {
    const currentMonth = new Date().getMonth(); // 0-11
    const seasonalServices = document.querySelectorAll('[data-seasonal]');

    seasonalServices.forEach(service => {
        const seasons = service.dataset.seasonal.split(',').map(Number);
        const isInSeason = seasons.includes(currentMonth);
        
        const badge = document.createElement('div');
        badge.className = `seasonal-badge ${isInSeason ? 'in-season' : 'off-season'}`;
        badge.textContent = isInSeason ? 'In Season' : 'Off Season';
        service.appendChild(badge);
    });
};

// Before/After Image Comparison
class BeforeAfterSlider {
    constructor(element) {
        this.container = element;
        this.before = element.querySelector('.before');
        this.slider = element.querySelector('.slider');
        this.isActive = false;
        this.containerWidth = 0;
        this.sliderPosition = 50;

        this.addLabels();
        this.setupEventListeners();
        this.initializeSlider();
    }

    addLabels() {
        const transformationType = this.container.dataset.transformation || 'Transformation';
        
        if (!this.container.querySelector('.before-label')) {
            const beforeLabel = document.createElement('div');
            beforeLabel.className = 'before-label';
            beforeLabel.textContent = `Before ${transformationType}`;
            this.container.appendChild(beforeLabel);
        }
        
        if (!this.container.querySelector('.after-label')) {
            const afterLabel = document.createElement('div');
            afterLabel.className = 'after-label';
            afterLabel.textContent = `After ${transformationType}`;
            this.container.appendChild(afterLabel);
        }
    }

    setupEventListeners() {
        // Mouse Events
        this.container.addEventListener('mousedown', this.startSliding.bind(this));
        document.addEventListener('mousemove', this.slide.bind(this));
        document.addEventListener('mouseup', this.stopSliding.bind(this));
        document.addEventListener('mouseleave', this.stopSliding.bind(this));

        // Touch Events
        this.container.addEventListener('touchstart', this.startSliding.bind(this));
        document.addEventListener('touchmove', this.slide.bind(this));
        document.addEventListener('touchend', this.stopSliding.bind(this));
        document.addEventListener('touchcancel', this.stopSliding.bind(this));

        // Keyboard Events for accessibility
        this.slider.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Window resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.initializeSlider(), 250);
        });
    }

    getPosition(event) {
        const rect = this.container.getBoundingClientRect();
        const pageX = event.type.includes('mouse') ? event.pageX : event.touches[0].pageX;
        const position = ((pageX - rect.left) / rect.width) * 100;
        return Math.min(Math.max(0, position), 100);
    }

    move(position) {
        this.sliderPosition = position;
        requestAnimationFrame(() => {
            this.before.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            this.slider.style.left = `${position}%`;
        });
    }

    startSliding(event) {
        if (event.type === 'touchstart') {
            event.preventDefault();
        }
        this.isActive = true;
        this.container.classList.add('active');
        this.move(this.getPosition(event));
    }

    slide(event) {
        if (!this.isActive) return;
        event.preventDefault();
        this.move(this.getPosition(event));
    }

    stopSliding() {
        this.isActive = false;
        this.container.classList.remove('active');
    }

    handleKeyboard(event) {
        const STEP = 1;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;

        if (event.keyCode === LEFT_ARROW || event.keyCode === RIGHT_ARROW) {
            event.preventDefault();
            const newPosition = this.sliderPosition + (event.keyCode === LEFT_ARROW ? -STEP : STEP);
            this.move(Math.min(Math.max(0, newPosition), 100));
        }
    }

    initializeSlider() {
        this.containerWidth = this.container.offsetWidth;
        this.move(50);
    }
}

// Testimonials Slider
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

        this.init();
    }

    init() {
        this.createNavigation();
        this.showSlide(0);
        this.startAutoPlay();
        this.handleHover();
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
}

// Contact Form with Seasonal Validation
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.seasonalServices = {
            'spring-cleanup': [2, 3, 4], // March to May
            'fall-cleanup': [8, 9, 10], // September to November
            'snow-removal': [11, 0, 1], // December to February
            'lawn-maintenance': [3, 4, 5, 6, 7, 8, 9], // April to October
            'planting': [3, 4, 5, 8, 9] // April to June, September to October
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.removeError(field));
        });

        // Add service availability checker
        const serviceSelect = this.form.querySelector('#service');
        if (serviceSelect) {
            serviceSelect.addEventListener('change', () => this.checkServiceAvailability(serviceSelect));
        }
    }

    checkServiceAvailability(select) {
        const selectedService = select.value;
        const currentMonth = new Date().getMonth();
        
        if (this.seasonalServices[selectedService]) {
            const isAvailable = this.seasonalServices[selectedService].includes(currentMonth);
            if (!isAvailable) {
                const months = this.seasonalServices[selectedService]
                    .map(m => new Date(0, m).toLocaleString('default', { month: 'long' }))
                    .join(', ');
                this.toggleError(select, true, `This service is typically scheduled during: ${months}`);
            } else {
                this.removeError(select);
            }
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = /^[\d\s-+()]{10,}$/.test(value);
                errorMessage = 'Please enter a valid phone number';
                break;
            case 'select-one':
                if (field.id === 'service') {
                    this.checkServiceAvailability(field);
                    return;
                }
                isValid = value !== '';
                errorMessage = 'Please select an option';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'This field is required';
        }

        this.toggleError(field, !isValid, errorMessage);
        return isValid;
    }

    toggleError(field, show, message) {
        const errorId = `${field.id}-error`;
        let errorElement = document.getElementById(errorId);

        if (show) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'form-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorId);
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
    }

    removeError(field) {
        this.toggleError(field, false);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            const firstError = this.form.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to your server
            console.log('Form submitted:', data);
            
            alert('Thank you for your message. We will contact you soon about your ' + 
                  data.service.replace('-', ' ') + ' request!');
            this.form.reset();
        } catch (error) {
            alert('There was an error submitting the form. Please try again.');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();

    // Initialize seasonal services
    initSeasonalServices();

    // Initialize before/after sliders
    document.querySelectorAll('.before-after').forEach(container => {
        new BeforeAfterSlider(container);
    });

    // Initialize testimonials slider
    new TestimonialSlider('testimonialSlider');

    // Initialize contact form
    new ContactForm('contactForm');

    // Initialize scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

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
