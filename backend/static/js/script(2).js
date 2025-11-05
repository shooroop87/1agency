(function ($) {

    const wdtHeadingWidgetHandler = function ($scope, $) {
        const settings = $scope.data('settings');
        if (settings && settings.subtitle_animate === "true") {
            const $subtitleWrapper = $scope.find('.wdt-heading-subtitle-wrapper');
            const $firstSpan = $subtitleWrapper.find('.wdt-heading-subtitle-animate').first();

            if ($firstSpan.length) {
                const spanWidth = $firstSpan.outerWidth(true);
                $subtitleWrapper.css('--subtitle-width', spanWidth + 'px');
            }
        }
    };


    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-heading.default', wdtHeadingWidgetHandler);
    });

})(jQuery);