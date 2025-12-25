/**
 * Pranav Pawale Portfolio - Main JavaScript
 * Enhanced with better organization, error handling, and performance optimizations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio initialized');
    
    // Initialize all modules
    initNavigation();
    initCurrentYear();
    initProjectsFilter();
    initFAQAccordion();
    initFormSubmission();
    initSmoothScroll();
    initScrollAnimations();
    initBackToTop();
    initNavScrollEffect();
    initMobileMenuClose();
    initImageOptimization();
    initSkillBarAnimations();
    initProjectCardHover();
    
    // Set up initial animations
    setTimeout(() => {
        animateOnScroll();
    }, 300);
});

// ===== MODULE: NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Update icon
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
        }
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu function
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// ===== MODULE: CURRENT YEAR =====
function initCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('#currentYear').forEach(element => {
        element.textContent = currentYear;
    });
}

// ===== MODULE: PROJECTS FILTER =====
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filterButtons.length === 0 || projectItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects with animation
            projectItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'grid';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update URL without page reload
            const url = new URL(window.location);
            if (filterValue === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filterValue);
            }
            window.history.replaceState({}, '', url);
        });
    });
    
    // Check URL for filter parameter
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const filterButton = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (filterButton) {
            setTimeout(() => {
                filterButton.click();
            }, 100);
        }
    }
}

// ===== MODULE: FAQ ACCORDION =====
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', () => {
            // Toggle current item
            const isActive = item.classList.contains('active');
            
            // Close all items if current is already active, otherwise close all and open current
            if (isActive) {
                item.classList.remove('active');
            } else {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Open current item
                item.classList.add('active');
            }
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// ===== MODULE: FORM SUBMISSION =====
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) {
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = Object.fromEntries(formData.entries());
            
            // Show success message
            if (successModal) {
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
            
            // Reset form
            this.reset();
            
            // Log submission (in production, you would send this to a server)
            console.log('Form submitted:', formDataObj);
            
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        window.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal.classList.contains('active')) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Form validation function
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            // Reset error state
            field.style.borderColor = '';
            const errorMessage = field.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
            
            // Validate required fields
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            }
            
            // Validate email format
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email address');
                }
            }
        });
        
        return isValid;
    }
    
    function showError(field, message) {
        field.style.borderColor = 'var(--secondary-color)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: var(--secondary-color);
            font-size: 0.85rem;
            margin-top: 0.25rem;
            text-align: left;
        `;
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.focus();
    }
}

// ===== MODULE: SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only process if it's a hash link (not external)
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed navbar
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page reload
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
}

// ===== MODULE: SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll(
        '.project-item, .skill-category, .certificate-card, ' +
        '.project-card, .timeline-item, .feature-item, .experience-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation check on load and scroll
    window.addEventListener('load', () => {
        setTimeout(animateOnScroll, 300);
    });
    window.addEventListener('scroll', animateOnScroll);
    
    // Animation function
    function animateOnScroll() {
        const elements = document.querySelectorAll(
            '.project-item, .skill-category, .certificate-card, ' +
            '.project-card, .timeline-item, .feature-item, .experience-card'
        );
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
}

// ===== MODULE: BACK TO TOP BUTTON =====
function initBackToTop() {
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    
    // Add styles
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color, #4361ee);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip, 1070);
        transition: all var(--transition-normal, 300ms ease);
        opacity: 0;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Hover effects
    backToTopButton.addEventListener('mouseenter', () => {
        backToTopButton.style.backgroundColor = 'var(--primary-dark, #3a0ca3)';
        backToTopButton.style.transform = 'translateY(-5px)';
        backToTopButton.style.boxShadow = 'var(--shadow-xl)';
    });
    
    backToTopButton.addEventListener('mouseleave', () => {
        backToTopButton.style.backgroundColor = 'var(--primary-color, #4361ee)';
        backToTopButton.style.transform = 'translateY(0)';
        backToTopButton.style.boxShadow = 'var(--shadow-lg)';
    });
    
    // Click handler
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
            setTimeout(() => {
                backToTopButton.classList.add('visible');
            }, 10);
        } else {
            backToTopButton.classList.remove('visible');
            setTimeout(() => {
                if (!backToTopButton.classList.contains('visible')) {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });
}

// ===== MODULE: NAVBAR SCROLL EFFECT =====
function initNavScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MODULE: MOBILE MENU CLOSE ON RESIZE =====
function initMobileMenuClose() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    const icon = navToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
            }
        }
    });
}

// ===== MODULE: IMAGE OPTIMIZATION =====
function initImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.getAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for better loading
        if (!img.getAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${this.src}`);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            this.alt = 'Image not available';
        });
    });
}

// ===== MODULE: SKILL BAR ANIMATIONS =====
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.competency-level, .skill-level');
    
    if (skillBars.length === 0) return;
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            }
        });
    };
    
    // Add scroll event for skill bars
    window.addEventListener('scroll', animateSkillBars);
    
    // Initial check
    animateSkillBars();
}

// ===== MODULE: PROJECT CARD HOVER EFFECTS =====
function initProjectCardHover() {
    const projectCards = document.querySelectorAll('.project-card, .project-item');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-md)';
        });
    });
}

// ===== MODULE: TYPEWRITER EFFECT =====
function initTypewriterEffect() {
    const typingElements = document.querySelectorAll('.typewriter');
    
    if (typingElements.length === 0) return;
    
    typingElements.forEach(element => {
        const text = element.textContent || element.innerText;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const speed = 100;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid var(--primary-color)' 
                        : 'none';
                }, 500);
            }
        }
        
        // Start typewriter after delay
        setTimeout(typeWriter, 1000);
    });
}

// ===== MODULE: ACTIVE NAV LINK ON SCROLL =====
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const highlightNavOnScroll = () => {
        const scrollY = window.pageYOffset;
        let current = '';
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavOnScroll);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
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

// Throttle function for resize events
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
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, e.filename, e.lineno);
});

// ===== PWA READINESS (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== LOADING STATE MANAGEMENT =====
document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
        // Remove loading state if any
        document.body.classList.remove('loading');
        
        // Dispatch custom event for when everything is loaded
        window.dispatchEvent(new CustomEvent('portfolioLoaded'));
    }
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE (if needed) =====
window.Portfolio = {
    initProjectsFilter,
    initFAQAccordion,
    initFormSubmission,
    initSmoothScroll,
    initScrollAnimations,
    initBackToTop
};