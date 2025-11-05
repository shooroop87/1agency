(function ($) {
  "use strict";

  const wdtAdvancedToggleSwitchWidgetHandler = function ($scope) {
    // Make sure jQuery is available
    if (typeof $ === 'undefined') {
      return;
    }

    var $toggle_button = $scope.find('.wdt-advanced-toggle-switch-container .wdt-advanced-toggle-switch-switcher-container .wdt-advanced-checkbox-toggle');

    $toggle_button.each(function () {
      var toggle_div = $(this);
      var toggle_id = toggle_div.data('toggle-id');

      toggle_div.change(function () {
        // Find content sections with matching toggle ID
        var $content_container = $('.wdt-advanced-toggle-content-container[data-toggle-id="' + toggle_id + '"]');
        var $left_section = $content_container.find('.wdt-advanced-toggle-content-left-section');
        var $right_section = $content_container.find('.wdt-advanced-toggle-content-right-section');

        if (toggle_div.is(":checked")) {
          // Checked (1) - show right section, hide left section
          $right_section.show();
          $left_section.hide();
        } else {
          // Unchecked (0) - show left section, hide right section
          $left_section.show();
          $right_section.hide();
        }
      });

      // Initialize - show left section by default for this specific toggle
      var toggle_id = toggle_div.data('toggle-id');
      var $content_container = $('.wdt-advanced-toggle-content-container[data-toggle-id="' + toggle_id + '"]');
      var $left_section = $content_container.find('.wdt-advanced-toggle-content-left-section');
      var $right_section = $content_container.find('.wdt-advanced-toggle-content-right-section');

      $left_section.show();
      $right_section.hide();
    });
  };

  $(window).on('elementor/frontend/init', function () {
    elementorFrontend.hooks.addAction(
      'frontend/element_ready/wdt-advanced-toggle-switch.default',
      wdtAdvancedToggleSwitchWidgetHandler
    );
  });

})(jQuery);