(function ($) {

  const wdtAccordionToggleWidgetHandler = function ($scope, $) {

    // Accordion
    const $accordionItem = $scope.find('.wdt-accordion-toggle-holder.wdt-module-accordion');
    const $options = {
      header: '.wdt-accordion-toggle-wrapper > .wdt-accordion-toggle-title-holder',
      animate: 'swing',
      collapsible: false,
      active: 0,
      heightStyle: 'content',
      icons: '',
      // Add create and activate callbacks to fix ARIA attributes
      create: function (event, ui) {
        // Remove incorrect ARIA roles
        $(this).removeAttr('role');

        // Set correct ARIA attributes on headers
        $(this).find('.wdt-accordion-toggle-title-holder').each(function (index) {
          $(this).removeAttr('role');
          const isActive = index === 0 && !$options.collapsible;
          $(this).attr('aria-expanded', isActive ? 'true' : 'false');
        });

        // Remove incorrect role from panels
        $(this).find('.wdt-accordion-toggle-description').each(function () {
          $(this).removeAttr('role');
        });
      },
      activate: function (event, ui) {
        // Update aria-expanded when panel changes
        if (ui.newHeader.length) {
          ui.newHeader.attr('aria-expanded', 'true');
          ui.oldHeader.attr('aria-expanded', 'false');
        } else {
          ui.oldHeader.attr('aria-expanded', 'false');
        }
      }
    };
    $accordionItem.accordion($options);

    // Add keyboard support for accordion
    $accordionItem.find('.wdt-accordion-toggle-title-holder').on('keydown', function (e) {
      // Enter or Space key
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Toggle
    const $toggleItem = $scope.find('.wdt-accordion-toggle-holder.wdt-module-toggle');
    const $toggleItemTitleHolder = $toggleItem.find('.wdt-accordion-toggle-title-holder');
    const $toggleItemContentHolder = $toggleItem.find('.wdt-accordion-toggle-description');

    $toggleItem.addClass('accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset');
    // Remove role="tablist" that might be added by jQuery UI classes
    $toggleItem.removeAttr('role');

    $toggleItemTitleHolder.addClass('ui-accordion-header ui-state-default ui-corner-top ui-corner-bottom');
    // Remove role="tab" that might be added by jQuery UI classes
    $toggleItemTitleHolder.removeAttr('role');
    // Add proper aria attributes
    $toggleItemTitleHolder.attr('aria-expanded', 'false');

    $toggleItemContentHolder.addClass('ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom').hide();
    // Remove role="tabpanel" that might be added by jQuery UI classes
    $toggleItemContentHolder.removeAttr('role');

    $toggleItemTitleHolder.hover(
      function () {
        $(this).toggleClass('ui-state-hover');
      }
    );

    $toggleItemTitleHolder.on(
      'click',
      function () {
        const $this = $(this);
        const $content = $this.next();
        const isExpanded = $this.hasClass('ui-accordion-header-active');

        $this.toggleClass('ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom');
        // Update aria-expanded attribute
        $this.attr('aria-expanded', !isExpanded);

        $content.toggleClass('ui-accordion-content-active').slideToggle(400);
      }
    );

    // Add keyboard support for toggle
    $toggleItemTitleHolder.on('keydown', function (e) {
      // Enter or Space key
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        $(this).trigger('click');
      }
    });

    // Ensure toggle items have tabindex if they're not buttons
    if (!$toggleItemTitleHolder.is('button')) {
      $toggleItemTitleHolder.attr('tabindex', '0');
    }
  };

  $(window).on('elementor/frontend/init', function () {
    elementorFrontend.hooks.addAction('frontend/element_ready/wdt-accordion-and-toggle.default', wdtAccordionToggleWidgetHandler);
  });

})(jQuery);