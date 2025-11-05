(function($) {
    'use strict';
    
    // Tabs functionality
    class Tabs {
        constructor(element) {
            this.tabsWrapper = element;
            this.navItems = this.tabsWrapper.querySelectorAll('.tabs-nav li');
            this.panes = this.tabsWrapper.querySelectorAll('.tab-pane');
            this.init();
        }
        
        init() {
            this.navItems.forEach((item, index) => {
                const link = item.querySelector('a');
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchTab(index);
                });
            });
        }
        
        switchTab(index) {
            // Remove active classes
            this.navItems.forEach(item => item.classList.remove('active'));
            this.panes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.navItems[index].classList.add('active');
            this.panes[index].classList.add('active');
            
            // Animate content
            this.panes[index].style.animation = 'fadeIn 0.5s ease';
        }
    }
    
    // Initialize tabs
    $(document).ready(function() {
        const tabsWrappers = document.querySelectorAll('.tabs-wrapper');
        tabsWrappers.forEach(wrapper => {
            new Tabs(wrapper);
        });
    });
    
})(jQuery);