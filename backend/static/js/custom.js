(function($) {
    'use strict';
    
    // Document Ready
    $(document).ready(function() {
        
        // Initialize all components
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initLazyLoad();
        
        // Header scroll behavior
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 100) {
                $('#header').addClass('scrolled');
            } else {
                $('#header').removeClass('scrolled');
            }
        });
        
    });
    
    // Mobile Menu Toggle
    function initMobileMenu() {
        $('.mobile-menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('.main-navigation').toggleClass('active');
            $('body').toggleClass('menu-open');
        });
        
        // Close menu on link click
        $('.main-navigation a').on('click', function() {
            $('.mobile-menu-toggle').removeClass('active');
            $('.main-navigation').removeClass('active');
            $('body').removeClass('menu-open');
        });
    }
    
    // Smooth Scroll
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 100
                }, 1000);
            }
        });
    }
    
    // Scroll Animations
    function initScrollAnimations() {
        if (typeof IntersectionObserver !== 'undefined') {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('.fade-in-up, .slide-in-left').forEach(el => {
                observer.observe(el);
            });
        }
    }
    
    // Lazy Load Images
    function initLazyLoad() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }
    
})(jQuery);