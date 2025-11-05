(function ($) {

  const wdtTabsWidgetHandler = function ($scope) {
    const instance = new wdtTabsWidgetHandlerInit($scope);
    instance.init();
  };

  const wdtTabsWidgetHandlerInit = function ($scope) {

    const $self = this;
    const $window = $(window);
    const $hunchBackItem = $scope.find('.wdt-template-hunch-back-icon');
    const $hunchBackItemType = $hunchBackItem.hasClass('wdt-layout-vertical') ? 'vertical' : 'horizontal';
    let $device = elementorFrontend.getCurrentDeviceMode();
    let $mobileToggleInitialized = false;
    let $activeItem;
    let $classes = $scope.find('.wdt-tabs-container:first').data('class-items').split(' ');
    let $tabInstance = false;
    let $scrollTabInstance = false;
    const $tabsContainer = $scope.find('.wdt-tabs-container');
    const isHoverMode = $tabsContainer.hasClass('wdt-tabs-hover');
    const isClickMode = $tabsContainer.hasClass('wdt-tabs-click');

    $self.init = function () {

      if ($device === 'mobile' || $device === 'mobile_extra') {
        $tabsContainer.addClass('wdt-tabs-toggle-mode');
        $.each($classes, function (key, value) {
          $tabsContainer.removeClass(value);
        });

        if (!$mobileToggleInitialized) {
          $self.mobileToggleInit();
        }
        $mobileToggleInitialized = true;

      } else {
        $self.tabInit();
        $self.hunchBackInit();
      }

      $window.on('resize', () => {

        $device = elementorFrontend.getCurrentDeviceMode();

        if ($device === 'mobile' || $device === 'mobile_extra') {

          setTimeout(function () {
            $tabInstance = $tabsContainer.tabs('instance');
            if (typeof $tabInstance !== 'undefined') {
              $tabsContainer.tabs('refresh');
              $tabsContainer.tabs('destroy');
            }

            $.each($classes, function (key, value) {
              $tabsContainer.removeClass(value);
            });

            $hunchBackItem.find('.wdt-hunch-back-icon-border').hide();

            $tabsContainer.addClass('wdt-tabs-toggle-mode');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');
            $scope.find('.wdt-tabs-list li:first').addClass('wdt-active');
            $scope.find('.wdt-tabs-content').hide();
            $scope.find('.wdt-tabs-content:first').show();

            if (!$mobileToggleInitialized) {
              $self.mobileToggleInit();
            }
            $mobileToggleInitialized = true;

          }, 400);

        } else {

          setTimeout(function () {

            $.each($classes, function (key, value) {
              $tabsContainer.addClass(value);
            });

            $tabsContainer.removeClass('wdt-tabs-toggle-mode');
            $scope.find('.wdt-tabs-list').removeClass('wdt-expanded');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');

            $self.tabInit();
            $self.hunchBackInit();

          }, 400);

        }

      });

    };

    $self.tabInit = function () {

      $tabsContainer.tabs({
        show: { effect: 'fadeIn', duration: 400 },
        hide: { effect: 'fadeOut', duration: 100 },
        activate: function (event, ui) {
          if ($hunchBackItem.length) {
            $activeItem = ui.newTab;
            $self.hunchBackIconAnimation($activeItem);
          }
        }
      });

      $tabInstance = $tabsContainer.tabs('instance');

      const $tabsListItems = $scope.find('.wdt-tabs-list li');

      if (isHoverMode) {
        $tabsListItems.off('mouseenter').on('mouseenter', function () {
          const index = $(this).index();
          $tabsContainer.tabs('option', 'active', index);
        });
      } else {
        $tabsListItems.off('click').on('click', function (e) {
          e.preventDefault();
          const index = $(this).index();
          $tabsContainer.tabs('option', 'active', index);
        });
      }

    };

    $self.hunchBackInit = function () {
      $hunchBackItem.find('.wdt-hunch-back-icon-border').show();

      if ($hunchBackItem.length) {
        $activeItem = $hunchBackItem.find('.wdt-tabs-list li:first');
        $self.hunchBackIconAnimation($activeItem);

        const $eventType = isHoverMode ? 'mouseenter' : 'click';

        $hunchBackItem.find('.ui-tabs-anchor').off($eventType).on($eventType, function () {
          $activeItem = $(this).closest('li');
          $self.hunchBackIconAnimation($activeItem);
        });

        $window.on('resize', () => {
          $activeItem = $hunchBackItem.find('.ui-state-active');
          if ($activeItem.length) {
            $self.hunchBackIconAnimation($activeItem);
          }
        });
      }
    };

    $self.hunchBackIconAnimation = function ($item) {
      $activeItem = $item;
      if ($hunchBackItemType === 'vertical') {
        const $top = Math.floor($activeItem.offset().top - $hunchBackItem.find('.wdt-tabs-list').offset().top - ($hunchBackItem.find('.wdt-hunch-back-icon-border').height() - $activeItem.height()) / 2) + "px";
        $hunchBackItem.find('.wdt-hunch-back-icon-border').css({
          'transform': `translateY(${$top})`
        });
      } else {
        const $left = Math.floor($activeItem.offset().left - $hunchBackItem.find('.wdt-tabs-list').offset().left - ($hunchBackItem.find('.wdt-hunch-back-icon-border').width() - $activeItem.width()) / 2) + "px";
        $hunchBackItem.find('.wdt-hunch-back-icon-border').css({
          'transform': `translate3d(${$left}, 0 , 0)`
        });
      }
    };

    $self.mobileToggleInit = function () {

      $scope.find('.wdt-tabs-list li:first').addClass('wdt-active');
      $scope.find('.wdt-tabs-content').fadeOut(100);
      $scope.find('.wdt-tabs-content:first').fadeIn(400);

      $scope.find('.wdt-tabs-list li').off('click').on('click', function (e) {
        e.preventDefault();

        if ($(this).parents('.wdt-tabs-container').hasClass('wdt-tabs-toggle-mode')) {
          if (!$(this).hasClass('wdt-active')) {
            $(this).parents('.wdt-tabs-list').removeClass('wdt-expanded');
            $scope.find('.wdt-tabs-list li').removeClass('wdt-active');
            $(this).addClass('wdt-active');
            $scope.find('.wdt-tabs-content').fadeOut(100);
            const id = $(this).find('a').attr('href');
            $scope.find(id).fadeIn(400);
          } else {
            $(this).parents('.wdt-tabs-list').toggleClass('wdt-expanded');
          }
        }
      });

    };

  };

  $(window).on('elementor/frontend/init', function () {
    elementorFrontend.hooks.addAction('frontend/element_ready/wdt-tabs.default', wdtTabsWidgetHandler);
  });

})(jQuery);
