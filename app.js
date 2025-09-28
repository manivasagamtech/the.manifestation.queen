// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    initNavigation();
    initScrollAnimations();
    initTestimonialSlider();
    initContactForm();
    initStatsAnimation();
    initFloatingSparkles();
    initParallaxEffects();
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = 80;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(212, 175, 55, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section:not(.hero-section)');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe service cards individually
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// Testimonial slider
function initTestimonialSlider() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const controlDots = document.querySelectorAll('.control-dot');
    let currentSlide = 0;
    let slideInterval;
    
    if (testimonialItems.length === 0) return;
    
    function showSlide(index) {
        // Hide all slides
        testimonialItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Remove active state from all dots
        controlDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (testimonialItems[index]) {
            testimonialItems[index].classList.add('active');
            controlDots[index]?.classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialItems.length;
        showSlide(currentSlide);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 6000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Add click handlers to control dots
    controlDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide(); // Restart auto-slide
        });
    });
    
    // Pause auto-slide on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider?.addEventListener('mouseenter', stopAutoSlide);
    testimonialSlider?.addEventListener('mouseleave', startAutoSlide);
    
    // Start the slideshow
    startAutoSlide();
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        
        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('.form-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent. I\'ll respond within 24 hours with love and light. ✨', 'success');
            form.reset();
            
            // Reset button
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            
            // Add sparkle effect
            createSparkleEffect(submitBtn);
        }, 2000);
    });
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Animate in
        formMessage.style.opacity = '0';
        formMessage.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            formMessage.style.transition = 'all 0.3s ease';
            formMessage.style.opacity = '1';
            formMessage.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto hide after 6 seconds
        setTimeout(() => {
            formMessage.style.opacity = '0';
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 300);
        }, 6000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Animated statistics counter
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.achievement-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 40);
        });
    }
}

// Floating sparkles animation
function initFloatingSparkles() {
    const sparkles = document.querySelectorAll('.sparkle');
    
    sparkles.forEach((sparkle, index) => {
        // Random delay for natural effect
        sparkle.style.animationDelay = `${index * 1.5}s`;
        
        // Restart animation when it ends
        sparkle.addEventListener('animationend', function() {
            setTimeout(() => {
                sparkle.style.animation = 'none';
                setTimeout(() => {
                    sparkle.style.animation = `sparkleFloat 8s linear infinite`;
                    sparkle.style.animationDelay = `${Math.random() * 3}s`;
                }, 100);
            }, Math.random() * 2000);
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const sparkles = document.querySelectorAll('.sparkle');
        
        // Hero parallax
        if (heroSection) {
            const heroContent = heroSection.querySelector('.hero-content');
            const heroImage = heroSection.querySelector('.hero-image');
            
            if (scrolled < window.innerHeight) {
                const opacity = 1 - (scrolled / window.innerHeight) * 1.5;
                heroContent.style.opacity = Math.max(opacity, 0);
                heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
        
        // Sparkle parallax
        sparkles.forEach((sparkle, index) => {
            const speed = 0.1 + (index * 0.05);
            sparkle.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }
}

// Sparkle effect for interactions
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 12;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'interaction-sparkle';
        
        const size = Math.random() * 10 + 5;
        sparkle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
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
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        
        const animation = sparkle.animate([
            { 
                transform: 'translate(0, 0) scale(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${x}px, ${y}px) scale(1) rotate(180deg)`, 
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => sparkle.remove();
    }
}

// Video testimonial interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('.video-item')) {
        const videoItem = e.target.closest('.video-item');
        const playBtn = videoItem.querySelector('.video-play-btn');
        
        // Scale animation
        videoItem.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            videoItem.style.transform = 'scale(1)';
            
            // Here you would implement actual video loading
            // For now, show a placeholder message
            showVideoMessage(videoItem);
        }, 150);
    }
});

function showVideoMessage(videoItem) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(45, 55, 72, 0.95);
        color: white;
        padding: 2rem;
        border-radius: 15px;
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    
    message.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #ffd700;">Video Testimonial</h3>
        <p>This is where the video testimonial would play. Replace this with your actual video integration (YouTube, Vimeo, or direct video file).</p>
        <button onclick="this.parentElement.remove()" style="
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #d4af37;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Close</button>
    `;
    
    document.body.appendChild(message);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 5000);
}

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialize reveal on scroll
window.addEventListener('scroll', revealOnScroll);

// Service card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Enhanced loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const ctaBtn = document.querySelector('.cta-btn');
        
        if (heroTitle) heroTitle.style.animation = 'fadeInLeft 1s ease-out';
        if (heroSubtitle) heroSubtitle.style.animation = 'fadeInLeft 1s ease-out 0.3s both';
        if (heroDescription) heroDescription.style.animation = 'fadeInLeft 1s ease-out 0.6s both';
        if (ctaBtn) ctaBtn.style.animation = 'fadeInLeft 1s ease-out 0.9s both';
    }, 100);
});
