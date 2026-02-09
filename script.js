// JACK Call Center - Main JavaScript File
// Additional functionality beyond inline scripts

console.log('JACK Call Center script loaded');

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    
    // 1. Mobile Navigation
    initMobileNav();
    
    // 2. Smooth Scrolling
    initSmoothScroll();
    
    // 3. Table Interactions
    initTableInteractions();
    
    // 4. Form Validations (if any forms)
    initForms();
    
    // 5. Performance Monitoring
    initPerformance();
});

// Mobile Navigation
function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
            
            // Prevent body scroll when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });
        });
    }
}

// Smooth Scrolling
function initSmoothScroll() {
    // For anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Check if element exists
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Table Interactions
function initTableInteractions() {
    const tableRows = document.querySelectorAll('.services-table tbody tr');
    
    tableRows.forEach(row => {
        // Hover effect
        row.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.backgroundColor = '#f0f9ff';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
        
        // Click effect for mobile
        row.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('active');
            }
        });
    });
}

// Form Handling
function initForms() {
    // If you add forms later, put validation here
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    
                    // Add error message
                    if (!field.nextElementSibling?.classList.contains('error')) {
                        const error = document.createElement('div');
                        error.className = 'error';
                        error.textContent = 'This field is required';
                        error.style.color = '#ef4444';
                        error.style.fontSize = '0.875rem';
                        error.style.marginTop = '5px';
                        field.parentNode.insertBefore(error, field.nextSibling);
                    }
                } else {
                    field.style.borderColor = '';
                    const error = field.nextElementSibling;
                    if (error && error.classList.contains('error')) {
                        error.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// Performance Monitoring
function initPerformance() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Send to analytics (if you have analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'page_load',
                value: loadTime,
                event_category: 'Performance'
            });
        }
    });
    
    // Track scroll depth
    let scrollDepthTracked = [];
    const scrollDepths = [25, 50, 75, 100];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTracked.includes(depth)) {
                scrollDepthTracked.push(depth);
                console.log(`Scroll depth: ${depth}%`);
                
                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        event_category: 'Engagement',
                        event_label: `Scrolled ${depth}%`,
                        value: depth
                    });
                }
            }
        });
    });
}

// Lazy Load Images (if you add images)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Cookie Consent (optional)
function initCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.id = 'cookieBanner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience on our website.</p>
                <div class="cookie-buttons">
                    <button id="acceptCookies" class="btn btn-primary">Accept</button>
                    <button id="declineCookies" class="btn btn-secondary">Decline</button>
                </div>
            </div>
        `;
        
        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            #cookieBanner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 30px rgba(0,0,0,0.2);
                z-index: 10000;
                max-width: 500px;
            }
            .cookie-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .cookie-buttons {
                display: flex;
                gap: 10px;
            }
            @media (max-width: 768px) {
                #cookieBanner {
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                }
                .cookie-buttons {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(cookieBanner);
        
        // Add event listeners
        document.getElementById('acceptCookies').addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.remove();
        });
        
        document.getElementById('declineCookies').addEventListener('click', function() {
            cookieBanner.remove();
        });
    }
}

// Initialize cookie consent on load
// initCookieConsent(); // Uncomment if you want cookie consent

// Export functions if needed
window.JACKCallCenter = {
    initMobileNav,
    initSmoothScroll,
    initTableInteractions,
    initForms,
    initPerformance
};
