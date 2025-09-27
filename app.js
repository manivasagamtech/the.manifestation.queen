// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initSmoothScroll();
    initScrollAnimations();
    initTestimonialSlider();
    initContactForm();
    initMobileNav();
    initParallax();
});

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Add fade-in to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let slideInterval;
    
    // Show specific slide
    function showSlide(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
            navDots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }
    
    // Auto-rotate testimonials
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Navigation dots event listeners
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });
    
    // Start the slideshow
    startSlideShow();
    
    // Pause on hover
    const testimonialContainer = document.querySelector('.written-testimonials');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', stopSlideShow);
        testimonialContainer.addEventListener('mouseleave', startSlideShow);
    }
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                showFormMessage('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Add sparkle effect
                createSparkleEffect(submitBtn);
            }, 2000);
        });
    }
    
    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Fade in animation
        formMessage.style.opacity = '0';
        formMessage.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            formMessage.style.transition = 'all 0.3s ease';
            formMessage.style.opacity = '1';
            formMessage.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 300);
        }, 5000);
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
        });
        
        // Close mobile nav when clicking on a link
        const mobileLinks = navLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-active');
            });
        });
    }
}

// Parallax Effect for Hero Section
function initParallax() {
    const hero = document.querySelector('.hero');
    const sparkles = document.querySelectorAll('.sparkle');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            // Move sparkles at different speeds
            sparkles.forEach((sparkle, index) => {
                const speed = 0.2 + (index * 0.1);
                sparkle.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            // Fade out hero content on scroll
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const opacity = 1 - (scrolled / window.innerHeight);
                heroContent.style.opacity = Math.max(opacity, 0);
            }
        });
    }
}

// Create Sparkle Effect
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'temp-sparkle';
        sparkle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #ffd700 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
        `;
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        const angle = (360 / sparkleCount) * i;
        const distance = 100;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        
        sparkle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            sparkle.remove();
        };
    }
}

// Header Background Change on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(255, 182, 193, 0.2)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(255, 182, 193, 0.1)';
    }
});

// Video Testimonial Placeholder Interaction
document.addEventListener('click', function(e) {
    if (e.target.closest('.video-placeholder')) {
        const videoItem = e.target.closest('.video-placeholder');
        videoItem.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            videoItem.style.transform = 'scale(1)';
            // Here you would typically load the actual video
            alert('Video testimonial would play here. Replace this with actual video integration.');
        }, 150);
    }
});

// Smooth Number Animation for Stats
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = current.toFixed(0) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
        }, 20);
    });
}

// Trigger number animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}
