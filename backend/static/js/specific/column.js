(function ($) {

	const wdtColumnWidgetHandler = function ($scope, $) {
        const $scopeColumn = $scope.find('.wdt-column-wrapper');
        const $deviceMode = elementorFrontend.getCurrentDeviceMode();
    
        if( $scopeColumn.data('column-settings') ) {
            const $customDevices = $scopeColumn.data('column-settings');
            const $get_user_devices = ($customDevices['columnDevices'] !== undefined) ? ($customDevices['columnDevices']) : '';

            if( $get_user_devices != undefined ) {
                if ( $get_user_devices.indexOf($deviceMode) > -1 ) {
                    $scopeColumn.addClass('wdt-snap-scroll');
                    $('.wdt-column-pagination .wdt-snap-scroll-pagination').css({ 'display': 'block' });
                } else {
                    $scopeColumn.removeClass('wdt-snap-scroll');
                    $('.wdt-column-pagination .wdt-snap-scroll-pagination').css({ 'display': 'none' });
                }
            }
        }
    
        function doLayout() {
            const $columns = $scope.find('.wdt-column');
            const $container = $scopeColumn[0];
        
            if (!$container || !$columns.length) {
                console.warn('Container or columns not found within scope:', $scope);
                return;
            }
        
            const $column_width = $columns.outerWidth(true);
            const $prevButton = $scope.find('.wdt-snap-scroll-pagination .wdt-pagination-prev');
            const $nextButton = $scope.find('.wdt-snap-scroll-pagination .wdt-pagination-next');
        
            const isRTL = $('html').attr('dir') === 'rtl';
        
            if (isRTL) {
                $container.scrollLeft = $container.scrollWidth;
                setTimeout(() => {
                    $container.scrollTo({ left: 0, behavior: 'auto' });
                }, 50);
            }
        
            function updateButtonState() {
                let scrollLeft = $container.scrollLeft;
                let maxScroll = $container.scrollWidth - $container.clientWidth;
        
                if (isRTL) {
                    scrollLeft = Math.abs(scrollLeft);
                    maxScroll = Math.abs(maxScroll);
                }
        
                $prevButton.toggleClass('disabled', scrollLeft <= 0).css('cursor', scrollLeft <= 0 ? 'not-allowed' : '');
                $nextButton.toggleClass('disabled', scrollLeft >= maxScroll).css('cursor', scrollLeft >= maxScroll ? 'not-allowed' : '');
            }
        
            updateButtonState();
        
            $prevButton.off('click').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    let newScrollLeft;
                    if (isRTL) {
                        newScrollLeft = $container.scrollLeft + $column_width;
                    } else {
                        newScrollLeft = Math.max($container.scrollLeft - $column_width, 0);
                    }
                    $container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
            });
        
            $nextButton.off('click').on('click', function () {
                if (!$(this).hasClass('disabled')) {
                    let newScrollLeft;
                    if (isRTL) {
                        newScrollLeft = $container.scrollLeft - $column_width;
                    } else {
                        newScrollLeft = Math.min($container.scrollLeft + $column_width, $container.scrollWidth - $container.clientWidth);
                    }
                    $container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
                }
            });
        
            $container.addEventListener('scroll', updateButtonState);
        }
    
        doLayout();
    };

	$(window).on('elementor/frontend/init', function () {

		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-image-box.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-specifications.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-advanced-carousel.default', wdtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-counter.default', wdtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-instagram.default', wdtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-team.default', wdtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-testimonial.default', wdtColumnWidgetHandler);
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-events.default', wdtColumnWidgetHandler);
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-donations.default', wdtColumnWidgetHandler);

  	});

})(jQuery);