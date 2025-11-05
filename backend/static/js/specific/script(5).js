(function ($) {
    "use strict";

    var wdtServicesWidgetHandler = function ($scope, $) {
        var services_box_wdt_column = $scope.find('.wdt-services-holder .wdt-column-wrapper .wdt-column, .wdt-services-holder .wdt-column-wrapper .wdt-column');
        $scope.find('.wdt-services-holder .wdt-column-wrapper .wdt-column:first-child, .wdt-services-holder .wdt-column-wrapper .wdt-column:first-child').addClass('wdt-active');
        services_box_wdt_column.mouseover(function () {
            if (!$(this).hasClass('wdt-active')) {
                $scope.find('.wdt-services-holder .wdt-column-wrapper .wdt-column').removeClass('wdt-active');
                $(this).addClass('wdt-active');
            }
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/wdt-services.default', wdtServicesWidgetHandler);
    });

})(jQuery);
  