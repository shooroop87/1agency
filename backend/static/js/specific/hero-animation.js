(function() {
    'use strict';
    
    // Wait for full page load
    if (document.readyState === 'complete') {
        initHeroEffect();
    } else {
        window.addEventListener('load', initHeroEffect, { once: true });
    }
    
    function initHeroEffect() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping hero animation');
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        const heroSection = document.querySelector('#hero-section');
        if (!heroSection) return;
        
        // Prevent re-initialization
        if (heroSection.dataset.heroInit === '1') return;
        heroSection.dataset.heroInit = '1';
        
        // Collect columns and images
        const columns = gsap.utils.toArray('.hero-column');
        if (!columns.length) return;
        
        const columnPairs = columns.map((col, i) => {
            const top = col.querySelector('.hero-image-top');
            const bottom = col.querySelector('.hero-image-bottom');
            const topEl = top && (top.querySelector('img') || top);
            const botEl = bottom && (bottom.querySelector('img') || bottom);
            return { topEl, botEl, i };
        }).filter(p => p.topEl && p.botEl);
        
        // Set initial state
        gsap.set(columnPairs.flatMap(p => [p.topEl, p.botEl]), {
            willChange: 'transform',
            transformOrigin: '50% 50%',
            overwrite: 'auto',
            force3D: true
        });
        
        // Responsive animations
        ScrollTrigger.matchMedia({
            // Desktop (≥ 768px)
            "(min-width: 768px)": function() {
                buildTimeline({ pin: true, end: '+=150%' });
            },
            // Mobile (< 768px)
            "(max-width: 767px)": function() {
                buildTimeline({ pin: false, end: '+=90%' });
            }
        });
function buildTimeline(opts) {
            // Kill previous timeline if exists
            if (heroSection._heroTl) {
                heroSection._heroTl.kill();
                heroSection._heroTl = null;
            }
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: opts.end,
                    scrub: 1.2,
                    pin: !!opts.pin,
                    pinSpacing: true,
                    anticipatePin: 1,
                    markers: false
                },
                defaults: { ease: 'none' }
            });
            
            // Parallax for each column
            columnPairs.forEach(({ topEl, botEl, i }) => {
                const dir = i % 2 === 0 ? 1 : -1;
                tl.to(topEl, { yPercent: dir * 12 }, 0);
                tl.to(botEl, { yPercent: -dir * 12 }, 0);
                tl.to([topEl, botEl], { scale: 1.08 }, 0);
            });
            
            heroSection._heroTl = tl;
            setTimeout(() => ScrollTrigger.refresh(), 50);
        }
        
        // Custom cursor (desktop only)
        const isTouch = matchMedia('(pointer: coarse)').matches;
        if (!isTouch) {
            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            cursor.innerHTML = '<div class="cursor-inner">View project</div>';
            document.body.appendChild(cursor);
            
            let mouseX = 0, mouseY = 0, cx = 0, cy = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }, { passive: true });
            
            function loop() {
                cx += (mouseX - cx) * 0.15;
                cy += (mouseY - cy) * 0.15;
                cursor.style.transform = `translate(${cx}px, ${cy}px)`;
                requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
            
            const wrappers = document.querySelectorAll('.hero-image-wrap');
            wrappers.forEach(w => {
                w.style.cursor = 'none';
                w.addEventListener('mouseenter', () => cursor.classList.add('active'));
                w.addEventListener('mouseleave', () => cursor.classList.remove('active'));
            });
        }
        
        // Accessibility
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.globalTimeline.timeScale(0.7);
        }
        
        requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    
})();