(function ($) {

    const wdtColumnsHandler = function($scope) {
        const instance = new wdtColumnsHandlerInit($scope);
    };

    const wdtColumnsHandlerInit = function($scope) {

		$('.wdt-sticky-css').each(function() {
			const $stickyClass = $(this);
			const stickySettings = $stickyClass.data('wdt-settings');
			if (stickySettings && stickySettings.sticky === true) {
				const container_id = stickySettings.id; 
				const selector = `.wdt-sticky-column-css-${container_id}`;

                var wdt_stickyColumns = document.querySelectorAll(selector);
                
                wdt_stickyColumns.forEach(function(wdt_column) {

                    if (wdt_column.querySelector('.wdt-sticky-inner-wrapper')) {
                        return; 
                    }

                    var wdt_inner__Wrapper = document.createElement('div');
                    wdt_inner__Wrapper.className = 'wdt-sticky-inner-wrapper e-con-inner';
                
                    while (wdt_column.firstChild) {
                        wdt_inner__Wrapper.appendChild(wdt_column.firstChild);
                    }
                
                    wdt_column.appendChild(wdt_inner__Wrapper);
                });
            }

		});
    };

    $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/container', wdtColumnsHandler );
    });

})(jQuery);