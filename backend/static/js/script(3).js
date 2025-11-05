(function ($) {

  const wdtCounterWidgetHandler = function($scope, $) {

    $scope.find('.wdt-content-counter-number').countTo({
      decimals: 2,
      formatter: function (value, options) {
      let toValue = jQuery(this).data('to');
      if(Number.isInteger(toValue)) {
        return value.toFixed(0);
      } else {
        return value.toFixed(options.decimals);
      }
      }
    });

    $scope.find('.wdt-counter-holder.wdt-rc-template-custom-block .wdt-content-detail-group').each(function() {
      var $desc = $(this).find('.wdt-content-description');
      if ($desc.length) {
      var descHeight = $desc.outerHeight();
      $(this).css('--height', descHeight + 'px');
      }
    });

  };

  $(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-counter.default', wdtCounterWidgetHandler);
  });

})(jQuery);
