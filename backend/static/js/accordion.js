(function($) {
    'use strict';
    
    // Accordion functionality
    class Accordion {
        constructor(element) {
            this.accordion = element;
            this.items = this.accordion.querySelectorAll('.accordion-item');
            this.init();
        }
        
        init() {
            this.items.forEach((item, index) => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                
                header.addEventListener('click', () => {
                    this.toggle(item, content);
                });
                
                // Open first item by default
                if (index === 0) {
                    item.classList.add('active');
                    content.classList.add('show');
                }
            });
        }
        
        toggle(item, content) {
            const isActive = item.classList.contains('active');
            
            // Close all items
            this.items.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.classList.remove('show');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                content.classList.add('show');
            }
        }
    }
    
    // Initialize accordions
    $(document).ready(function() {
        const accordions = document.querySelectorAll('.accordion');
        accordions.forEach(accordion => {
            new Accordion(accordion);
        });
    });
    
})(jQuery);