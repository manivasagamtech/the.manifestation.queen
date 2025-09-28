// Mental Health Professional Website - JavaScript
// Author: Professional Web Developer
// Description: Interactive functionality for healing-focused website

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize AOS (Animate On Scroll) library
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navigation functionality
    initializeNavigation();

    // Form functionality
    initializeForm();

    // Smooth scrolling and animations
    initializeSmoothScrolling();

    // Loading animations
    initializePageAnimations();

    // Initialize interactive elements
    initializeInteractiveElements();

    console.log('🌟 Healing website initialized successfully!');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active nav link highlighting
    window.addEventListener('scroll', function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
            }
        });
    });
}

/**
 * Form functionality with validation and submission
 */
function initializeForm() {
    const form = document.getElementById('intakeForm');
    const successMessage = document.getElementById('successMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Form validation patterns
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid full name (letters and spaces only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\d\s\+\-\(\)]+$/,
            minLength: 10,
            message: 'Please enter a valid phone number'
        },
        age: {
            required: true,
            min: 16,
            max: 100,
            message: 'Age must be between 16 and 100'
        },
        cityState: {
            required: true,
            minLength: 2,
            message: 'Please enter your city and state'
        },
        reasonForCounseling: {
            required: true,
            minLength: 10,
            message: 'Please provide at least 10 characters describing your reason for seeking counseling'
        },
        expectations: {
            required: true,
            minLength: 10,
            message: 'Please share your expectations from counseling (at least 10 characters)'
        }
    };

    // Real-time form validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(field, validationRules[fieldName]);
            });

            field.addEventListener('input', function() {
                clearFieldError(field);
                // Real-time validation for better UX
                if (field.value.length > 0) {
                    setTimeout(() => validateField(field, validationRules[fieldName]), 500);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate entire form
        let isFormValid = true;
        const formData = new FormData(form);
        const submissionData = {};

        // Validate all required fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField(field, validationRules[fieldName])) {
                isFormValid = false;
            } else if (field) {
                submissionData[fieldName] = field.value;
            }
        });

        // Validate radio buttons and checkboxes
        const previousTherapy = document.querySelector('input[name="previousTherapy"]:checked');
        const consent = document.getElementById('consent');

        if (!previousTherapy) {
            showFieldError(document.querySelector('input[name="previousTherapy"]'), 'Please select whether you have taken therapy before');
            isFormValid = false;
        } else {
            submissionData.previousTherapy = previousTherapy.value;
        }

        if (!consent.checked) {
            showFieldError(consent, 'Please provide your consent to start therapy');
            isFormValid = false;
        }

        // Additional fields
        submissionData.gender = document.getElementById('gender').value;
        submissionData.emergencyContact = document.getElementById('emergencyContact').value;

        if (isFormValid) {
            submitForm(submissionData);
        } else {
            // Smooth scroll to first error
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    /**
     * Validate individual field
     */
    function validateField(field, rules) {
        const value = field.value.trim();

        if (rules.required && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        if (value && rules.minLength && value.length < rules.minLength) {
            showFieldError(field, `Minimum ${rules.minLength} characters required`);
            return false;
        }

        if (value && rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, rules.message);
            return false;
        }

        if (rules.min && parseFloat(value) < rules.min) {
            showFieldError(field, rules.message);
            return false;
        }

        if (rules.max && parseFloat(value) > rules.max) {
            showFieldError(field, rules.message);
            return false;
        }

        clearFieldError(field);
        return true;
    }

    /**
     * Show field error
     */
    function showFieldError(field, message) {
        field.classList.add('is-invalid');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);

        // Add error styling
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 0.25rem rgba(220, 53, 69, 0.25)';
    }

    /**
     * Clear field error
     */
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    /**
     * Submit form data
     */
    function submitForm(data) {
        // Show loading spinner
        showLoadingSpinner(true);

        // Simulate form submission (replace with actual endpoint)
        console.log('Form submission data:', data);

        // Simulate API call delay
        setTimeout(() => {
            showLoadingSpinner(false);

            // Hide form and show success message
            form.style.display = 'none';
            successMessage.classList.remove('d-none');

            // Smooth scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Optional: Send email notification (implement server-side)
            sendEmailNotification(data);

            // Show celebration animation
            showSuccessAnimation();

        }, 2000); // 2 second delay to simulate processing
    }

    /**
     * Send email notification (placeholder - implement server-side)
     */
    function sendEmailNotification(data) {
        // This would typically be handled by your backend
        // Example implementation:
        /*
        fetch('/api/send-intake-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Email sent successfully:', result);
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });
        */
        console.log('Email notification would be sent with data:', data);
    }
}

/**
 * Loading spinner functionality
 */
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        spinner.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Success animation
 */
function showSuccessAnimation() {
    // Create floating hearts animation
    const heartsContainer = document.createElement('div');
    heartsContainer.style.position = 'fixed';
    heartsContainer.style.top = '0';
    heartsContainer.style.left = '0';
    heartsContainer.style.width = '100%';
    heartsContainer.style.height = '100%';
    heartsContainer.style.pointerEvents = 'none';
    heartsContainer.style.zIndex = '1000';

    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💚';
        heart.style.position = 'absolute';
        heart.style.fontSize = '2rem';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.animation = 'floatUp 3s ease-out forwards';

        heartsContainer.appendChild(heart);
    }

    document.body.appendChild(heartsContainer);

    // Remove hearts after animation
    setTimeout(() => {
        heartsContainer.remove();
    }, 4000);

    // Add CSS for floating animation
    if (!document.querySelector('#floatUpAnimation')) {
        const style = document.createElement('style');
        style.id = 'floatUpAnimation';
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 1;
                    transform: translateY(100vh) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateY(50vh) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-10vh) scale(0.5);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Smooth scrolling functionality
 */
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Page animations and interactive elements
 */
function initializePageAnimations() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Counter animation for stats (if you add stats later)
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe counter elements
    document.querySelectorAll('.counter').forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Interactive elements initialization
 */
function initializeInteractiveElements() {
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Testimonial card interactions
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // Video testimonial placeholders
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // Placeholder for video modal or inline player
            console.log('Video testimonial clicked - implement video player');
            showVideoModal(this);
        });
    });

    // Form field animations
    const formControls = document.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentNode.classList.add('field-focused');
            this.style.transform = 'scale(1.02)';
        });

        control.addEventListener('blur', function() {
            this.parentNode.classList.remove('field-focused');
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Video modal functionality (placeholder)
 */
function showVideoModal(videoElement) {
    // Create modal for video testimonials
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Client Testimonial</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Video testimonial would be embedded here.</p>
                    <p><small>This is a placeholder for actual video content.</small></p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // Remove modal after hiding
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

/**
 * Counter animation for statistics
 */
function animateCounter(element) {
    const target = parseInt(element.dataset.target || element.textContent);
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    const stepTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, stepTime);
}

/**
 * Utility functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Accessibility enhancements
 */
function initializeAccessibility() {
    // Keyboard navigation for custom elements
    document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Screen reader announcements
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-9999px';
        announcement.textContent = message;

        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    };

    // Announce form submission success
    document.getElementById('successMessage').addEventListener('DOMNodeInserted', function() {
        announceToScreenReader('Form submitted successfully! Mrunal will contact you within 24 hours.');
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

/**
 * Error handling and logging
 */
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // Optionally send error reports to monitoring service
});

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
    // Page load performance
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);

    // Lazy loading for images (if needed)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeForm,
        initializeSmoothScrolling,
        debounce,
        throttle
    };
}
