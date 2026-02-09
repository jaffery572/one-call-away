/**
 * UK Call Center - Main JavaScript
 * Production-ready with error handling, performance monitoring, and analytics
 */

// IIFE to avoid polluting global scope
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        apiEndpoint: '/.netlify/functions',
        analyticsId: 'UA-XXXXXXXXX-X',
        recaptchaSiteKey: 'your-site-key',
        lazyLoadOffset: 200,
        debounceDelay: 250,
        throttleDelay: 1000
    };
    
    // Performance Monitoring
    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.observer = null;
            this.init();
        }
        
        init() {
            // Measure Largest Contentful Paint
            if ('PerformanceObserver' in window) {
                this.observer = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.recordMetric('LCP', lastEntry.startTime);
                });
                
                this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
            }
            
            // Measure First Input Delay
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.performance && performance.getEntriesByType) {
                        const navEntries = performance.getEntriesByType('navigation');
                        if (navEntries.length > 0) {
                            const navTiming = navEntries[0];
                            this.recordMetric('FCP', navTiming.domContentLoadedEventEnd);
                            this.recordMetric('TTI', navTiming.domInteractive);
                        }
                    }
                }, 0);
            });
        }
        
        recordMetric(name, value) {
            this.metrics.set(name, value);
            this.reportToAnalytics(name, value);
        }
        
        reportToAnalytics(name, value) {
            if (typeof gtag === 'function') {
                gtag('event', 'timing_complete', {
                    name: name,
                    value: Math.round(value),
                    event_category: 'Performance Metrics'
                });
            }
        }
    }
    
    // Form Handler with Validation
    class FormHandler {
        constructor(formSelector) {
            this.forms = document.querySelectorAll(formSelector);
            this.init();
        }
        
        init() {
            this.forms.forEach(form => {
                form.addEventListener('submit', this.handleSubmit.bind(this));
                this.setupValidation(form);
            });
        }
        
        setupValidation(form) {
            const inputs = form.querySelectorAll('[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearError.bind(this));
            });
        }
        
        validateField(e) {
            const field = e.target;
            const errorElement = field.nextElementSibling?.classList.contains('error-message') 
                ? field.nextElementSibling 
                : this.createErrorElement(field);
            
            if (!field.validity.valid) {
                errorElement.textContent = this.getErrorMessage(field);
                field.classList.add('invalid');
                return false;
            }
            
            field.classList.remove('invalid');
            errorElement.textContent = '';
            return true;
        }
        
        getErrorMessage(field) {
            if (field.validity.valueMissing) {
                return 'This field is required';
            }
            if (field.validity.typeMismatch) {
                if (field.type === 'email') return 'Please enter a valid email';
                if (field.type === 'tel') return 'Please enter a valid phone number';
            }
            if (field.validity.tooShort) {
                return `Minimum length is ${field.minLength} characters`;
            }
            return 'Please check this field';
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            
            if (!this.validateForm(form)) {
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Processing...';
            
            try {
                // Prepare form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Send to Netlify Functions
                const response = await fetch(`${CONFIG.apiEndpoint}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Show success message
                this.showSuccessMessage(form, 'Thank you! We\'ll contact you shortly.');
                
                // Reset form
                form.reset();
                
                // Track conversion
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', {
                        'send_to': CONFIG.analyticsId,
                        'value': 1.0,
                        'currency': 'GBP'
                    });
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showErrorMessage(form, 'Sorry, something went wrong. Please try again.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
        
        validateForm(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!this.validateField({ target: field })) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        showSuccessMessage(form, message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'alert alert-success';
            messageDiv.setAttribute('role', 'alert');
            messageDiv.textContent = message;
            
            form.insertAdjacentElement('beforebegin', messageDiv);
            
            // Auto remove after 5 seconds
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }
    
    // Lazy Load Images
    class LazyLoader {
        constructor() {
            this.observer = null;
            this.init();
        }
        
        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                this.loadImage(entry.target);
                                this.observer.unobserve(entry.target);
                            }
                        });
                    },
                    {
                        rootMargin: `${CONFIG.lazyLoadOffset}px`,
                        threshold: 0.1
                    }
                );
                
                document.querySelectorAll('[data-src]').forEach(img => {
                    this.observer.observe(img);
                });
            } else {
                // Fallback for older browsers
                this.loadAllImages();
            }
        }
        
        loadImage(img) {
            const src = img.getAttribute('data-src');
            if (!src) return;
            
            img.src = src;
            img.removeAttribute('data-src');
            
            if (img.getAttribute('data-srcset')) {
                img.srcset = img.getAttribute('data-srcset');
                img.removeAttribute('data-srcset');
            }
            
            img.onload = () => {
                img.classList.add('loaded');
            };
        }
        
        loadAllImages() {
            document.querySelectorAll('[data-src]').forEach(img => {
                this.loadImage(img);
            });
        }
    }
    
    // Analytics Manager
    class AnalyticsManager {
        constructor() {
            this.events = new Map();
            this.init();
        }
        
        init() {
            // Track page views
            this.trackPageView();
            
            // Track outbound links
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="http"]');
                if (link && !link.href.includes(window.location.hostname)) {
                    this.trackOutboundLink(link.href);
                }
            });
            
            // Track form interactions
            document.addEventListener('submit', (e) => {
                if (e.target.tagName === 'FORM') {
                    this.trackFormSubmission(e.target);
                }
            });
            
            // Track scroll depth
            this.trackScrollDepth();
        }
        
        trackPageView() {
            if (typeof gtag === 'function') {
                gtag('config', CONFIG.analyticsId, {
                    page_path: window.location.pathname,
                    page_title: document.title
                });
            }
        }
        
        trackEvent(category, action, label, value) {
            if (typeof gtag === 'function') {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value
                });
            }
        }
        
        trackScrollDepth() {
            const thresholds = [25, 50, 75, 100];
            let tracked = [];
            
            window.addEventListener('scroll', () => {
                const scrollPercent = this.getScrollPercentage();
                
                thresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !tracked.includes(threshold)) {
                        this.trackEvent('Engagement', 'scroll_depth', `Scrolled ${threshold}%`);
                        tracked.push(threshold);
                    }
                });
            }, { passive: true });
        }
        
        getScrollPercentage() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            return Math.round(scrollPercent);
        }
    }
    
    // Main Application
    class UKCallCenterApp {
        constructor() {
            this.performanceMonitor = null;
            this.formHandler = null;
            this.lazyLoader = null;
            this.analyticsManager = null;
            this.init();
        }
        
        init() {
            try {
                // Initialize modules
                this.performanceMonitor = new PerformanceMonitor();
                this.formHandler = new FormHandler('form[data-netlify="true"]');
                this.lazyLoader = new LazyLoader();
                this.analyticsManager = new AnalyticsManager();
                
                // Setup event listeners
                this.setupEventListeners();
                
                // Initialize components
                this.initNavigation();
                this.initTestimonials();
                this.initCounters();
                this.initChatWidget();
                
                console.log('UK Call Center App initialized successfully');
            } catch (error) {
                console.error('Failed to initialize app:', error);
                this.handleError(error);
            }
        }
        
        setupEventListeners() {
            // Debounced resize handler
            window.addEventListener('resize', this.debounce(() => {
                this.handleResize();
            }, CONFIG.debounceDelay));
            
            // Throttled scroll handler
            window.addEventListener('scroll', this.throttle(() => {
                this.handleScroll();
            }, CONFIG.throttleDelay));
        }
        
        initNavigation() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                    navToggle.setAttribute('aria-expanded', !expanded);
                    navMenu.classList.toggle('show');
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('show');
                    }
                });
                
                // Handle dropdowns
                const dropdowns = document.querySelectorAll('.has-dropdown');
                dropdowns.forEach(dropdown => {
                    const button = dropdown.querySelector('button');
                    const menu = dropdown.querySelector('.dropdown');
                    
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const expanded = button.getAttribute('aria-expanded') === 'true';
                        button.setAttribute('aria-expanded', !expanded);
                        menu.classList.toggle('show');
                    });
                });
            }
        }
        
        initTestimonials() {
            const testimonials = [
                {
                    name: "Sarah Johnson",
                    role: "Owner, London Pizza Co.",
                    content: "Our orders increased by 45% within 3 months. The professional service transformed our business.",
                    rating: 5
                },
                // More testimonials...
            ];
            
            const container = document.querySelector('.testimonials-slider');
            if (container) {
                testimonials.forEach(testimonial => {
                    const testimonialElement = this.createTestimonial(testimonial);
                    container.appendChild(testimonialElement);
                });
                
                this.initSwiper(container);
            }
        }
        
        initCounters() {
            const counters = document.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                // Start when in viewport
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        observer.unobserve(counter);
                    }
                });
                
                observer.observe(counter);
            });
        }
        
        initChatWidget() {
            const chatToggle = document.querySelector('.chat-toggle');
            const chatContainer = document.querySelector('.chat-container');
            
            if (chatToggle && chatContainer) {
                chatToggle.addEventListener('click', () => {
                    const isHidden = chatContainer.hidden;
                    chatContainer.hidden = !isHidden;
                    chatToggle.setAttribute('aria-expanded', !isHidden);
                    
                    if (!isHidden) {
                        this.analyticsManager.trackEvent('Engagement', 'chat_opened');
                    }
                });
            }
        }
        
        // Utility Methods
        debounce(func, wait) {
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
        
        throttle(func, limit) {
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
        
        handleError(error) {
            // Send error to analytics
            if (typeof gtag === 'function') {
                gtag('event', 'exception', {
                    description: error.message,
                    fatal: false
                });
            }
            
            // Show user-friendly error message
            const errorContainer = document.createElement('div');
            errorContainer.className = 'global-error';
            errorContainer.innerHTML = `
                <p>We're experiencing technical difficulties. Please refresh the page or try again later.</p>
                <button onclick="location.reload()">Refresh Page</button>
            `;
            
            document.body.prepend(errorContainer);
        }
    }
    
    // Initialize app when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new UKCallCenterApp();
    });
    
    // Export for debugging
    window.UKCallCenter = {
        PerformanceMonitor,
        FormHandler,
        LazyLoader,
        AnalyticsManager
    };
    
})();
