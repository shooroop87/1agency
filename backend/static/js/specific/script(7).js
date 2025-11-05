// (function ($) {

//   const wdtAdvancedToggleWidgetHandler = function($scope, $) {

//     $toggle_button = $scope.find('.wdt-advanced-toggle-content-container .wdt-advanced-toggle-content-switcher-container .wdt-advanced-checkbox-toggle');
//     $toggle_section = $scope.find('.wdt-advanced-toggle-content-section .wdt-advanced-toggle-content-right-section');
//     $toggle_section.hide();
    
//     $toggle_button.each(function() {
//       var scope_val  = $scope;
//       var toggle_div = $(this);

//       $toggle_left_section = scope_val.find('.wdt-advanced-toggle-content-section .wdt-advanced-toggle-content-left-section');
//       $toggle_right_section = scope_val.find('.wdt-advanced-toggle-content-section .wdt-advanced-toggle-content-right-section');

//       toggle_div.click(function() {

//         if( toggle_div.is(":checked") == true ) {
//           $toggle_left_section.hide();
//           $toggle_right_section.show();
//         } else {
//           $toggle_left_section.show();
//           $toggle_right_section.hide();
//         }

//       });

//     });
    
//   };

//   $(window).on('elementor/frontend/init', function () {
// 		elementorFrontend.hooks.addAction('frontend/element_ready/wdt-advanced-toggle-content.default', wdtAdvancedToggleWidgetHandler);
//   });

// })(jQuery);
