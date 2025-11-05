var wdtPortfolioFrontendUtils = {

	wdtPortfolioListingsListingIsotope : function($appended = false) {

	    jQuery('.wdt-listings-item-apply-isotope .wdt-listings-item-container').each(function() {

	    	var this_item = jQuery(this);

	        var $grid = this_item.isotope({
				itemSelector: '.wdt-column',
				percentPosition: true,
				masonry: {
					columnWidth: '.grid-sizer'
				}
	        });

            if($appended) {
                $grid.isotope('reloadItems');
            }

			window.setTimeout(function(){
				this_item.isotope();
			}, 1400);

	    });

        jQuery('.wdt-listings-item-apply-isotope .wdt-listings-item-container').each(function() {

	    	var this_item = jQuery(this);

	        this_item.isotope();

	    });

	    jQuery('.wdt-listings-item-apply-isotope .wdt-listings-item-isotope-filter').each(function() {

	    	var isotope_filter = jQuery(this);

			isotope_filter.find('a').on('click', function() {

				isotope_filter.find('a').removeClass('active-sort');
				var selector = jQuery(this).attr('data-filter');
				jQuery(this).addClass('active-sort');

				wdtPortfolioFrontendUtils.wdtPortfolioImagePopup();

				jQuery(this).parents('.wdt-listings-item-apply-isotope').find('.wdt-listings-item-container').isotope({ filter: selector, masonry: {  }, animationEngine : 'jquery' });

				return false;

			});

	    });


	},

	wdtPortfolioListingCarousel : function($scope, $) {

		const $carouselItem = $scope.find('.wdt-listing-output-data-holder');
		const $moduleId = $carouselItem.data('moduleid');
		const $carouselresponsive = $carouselItem.data('carouselresponsive');
	
		const $carouselcarouseleffect = $scope.data('carouseleffect');
		const $carouselcarouselautoplay = $scope.data('carouselautoplay');
		const $carouselcenteredslides = $scope.data('carouselcenteredslides');
		const $carouselslidesperview = $scope.data('carouselslidesperview');
		const $carouselloopmode = $scope.data('carouselloopmode');
		const $carouselmousewheelcontrol = $scope.data('carouselmousewheelcontrol');
		const $carouselbulletpagination = $scope.data('carouselbulletpagination');
		const $carouselarrowpagination = $scope.data('carouselarrowpagination');
		const $carouselprogressbar = $scope.data('carouselprogressbar');
		const $carouselspacebetween = $scope.data('carouselspacebetween');	
		const $carouseloverflowopacity = $scope.data('carouseloverflowopacity');

		const swiperOptions = {
			initialSlide: 0,
			simulateTouch: true,
			// roundLengths: true,
			spaceBetween: $carouselspacebetween,
			keyboardControl: true,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			paginationClickable: true,
			autoHeight: true,
			grabCursor: true,

			autoplay: {
				enabled: autoplay_enable,
				delay: $carouselcarouselautoplay,
			},

			slidesPerView: $carouselslidesperview,
			loop:$carouselloopmode,
			mousewheel: $carouselmousewheelcontrol,
			centeredSlides: $carouselcenteredslides,

			effect: $carouselcarouseleffect,
			coverflowEffect: {
				slideShadows: false,
				rotate: 0,
				stretch: 0,
				depth: 200,
				modifier: 1,
			},
			cubeEffect: {
				slideShadows: true,
				shadow: true,
				shadowOffset: 20,
				shadowScale: 0.94
			},
			
		}

		// Update breakpoints
		const $responsiveSettings = $carouselresponsive['responsive'];
		const $responsiveData = {};
		jQuery.each($responsiveSettings, function (index, value) {
		$responsiveData[value.breakpoint] = {
			slidesPerView: value.toshow,
		};
		});
		swiperOptions['breakpoints'] = $responsiveData;

		// Arrow pagination
		if ($carouselarrowpagination == true) {
			swiperOptions.navigation = {
				prevEl: '.wdt-swiper-arrow-prev-'+$moduleId,
				nextEl: '.wdt-swiper-arrow-next-'+$moduleId
			};
		}

		// Bullets pagination
		if ($carouselbulletpagination == true) {
			swiperOptions.pagination = {
				el: ".wdt-swiper-bullet-pagination",
				type: 'bullets',
				clickable: true,
			};
		}
		// Progress bar pagination
		if ($carouselprogressbar == true) {
			swiperOptions.pagination = {
				el: '.wdt-swiper-progress-bar-' + $moduleId,
				type: 'progressbar'
			};
			console.log(swiperOptions);
		}

		//Autoplay
		var autoplay_enable = '';
		if($carouselcarouselautoplay > 0) {
			autoplay_enable = true;	
		} else {
			autoplay_enable = false;	
		}

		if ($carouseloverflowopacity === "yes") {
			swiperOptions.on = {
				init: function () {
					const $swiperContainer = jQuery(this.el);
					const $slides = $swiperContainer.find('.swiper-slide');
					$slides.css({ opacity: 0.4 }); // default all to 0.5

					// Set opacity 1 for visible slides
					$swiperContainer.find('.swiper-slide.swiper-slide-visible').css({ opacity: 1 });
				},
				slideChangeTransitionEnd: function () {
					const $swiperContainer = jQuery(this.el);
					const $slides = $swiperContainer.find('.swiper-slide');
					$slides.css({ opacity: 0.4 });

					// Set opacity 1 for visible slides only
					$swiperContainer.find('.swiper-slide.swiper-slide-visible').css({ opacity: 1 });
				}
			};

			$scope.find('.swiper').css({ 'overflow': 'visible' });
		}


		const swiperGallery = new Swiper('.wdt-portfolio-module-id-'+$moduleId, swiperOptions);

	
	},

	wdtPortfolioFilterOptions : function() {

		// Keyword
		var keyword = jQuery('.wdt-sf-keyword').val();

    	// Location
		var user_latitude = jQuery('.wdt-sf-location-latitude').val();
		var user_longitude = jQuery('.wdt-sf-location-longitude').val();

		var radius = radius_unit = '';
		if(user_latitude != '' && user_latitude != '') {
			if(jQuery('.wdt-sf-radius').length > 0 && jQuery('.wdt-sf-radius-unit').length > 0) {
				var radius      = jQuery('.wdt-sf-radius').val();
				var radius_unit = jQuery('.wdt-sf-radius-unit').val();
			} else if(jQuery('.wdt-sf-location-max-radius').length > 0 && jQuery('.wdt-sf-location-radius-unit').length > 0) {
				var radius      = jQuery('.wdt-sf-location-max-radius').val();
				var radius_unit = jQuery('.wdt-sf-location-radius-unit').val();
			}
		}

		// Categories
		var categories = jQuery('.wdt-sf-categories option:selected').map(function(){
			if(this.value != '') {
				return this.value;
			}
		}).get();
		if(categories.length === 0) {
			var categories = jQuery('.wdt-sf-categories:checked').map(function(){
				if(this.value != '') {
					return this.value;
				}
			}).get();
		}

		// Tags
		var tags = jQuery('.wdt-sf-tags option:selected').map(function(){
			if(this.value != '') {
				return this.value;
			}
		}).get();
		if(tags.length === 0) {
			var tags = jQuery('.wdt-sf-tags:checked').map(function(){
				if(this.value != '') {
					return this.value;
				}
			}).get();
		}

		// Start Date
		var startdate = jQuery('.wdt-sf-startdate').val();

		// Features
		var features_query = {};
		var features_total_query = 0;
		jQuery('.wdt-sf-features-field-holder').each(function () {

			var field_type = jQuery(this).find('.wdt-sf-features-field-type').val();

			var tab_id = jQuery(this).find('.wdt-sf-features-tab-id').val();

			var features_item_data = {};

			features_item_data['field_type'] = field_type;

			if(field_type == 'dropdown' || field_type == 'list') {

				var item_values = jQuery(this).find('.wdt-sf-features option:selected').map(function(){
					if(this.value != '') {
						return this.value;
					}
				}).get();
				if(item_values.length === 0) {
					var item_values = jQuery(this).find('.wdt-sf-features:checked').map(function(){
						if(this.value != '') {
							return this.value;
						}
					}).get();
				}

				features_item_data['item_values'] = item_values;

				if(item_values.length != 0) {
					features_total_query = features_total_query + 1;
				}

			} else if(field_type == 'range') {

				var start = jQuery(this).find('.wdt-sf-features-start').val();
				var end = jQuery(this).find('.wdt-sf-features-end').val();

				features_item_data['start'] = start;
				features_item_data['end'] = end;

				features_total_query = features_total_query + 1;

			}

			features_query[tab_id] = features_item_data;

		});


		// Order By
		var orderby = jQuery('.wdt-sf-orderby option:selected').val();
		if(orderby === undefined) {
			var orderby = jQuery('.wdt-sf-orderby-list a.active').attr('data-itemvalue');
		}

		// Others
		var others = jQuery('.wdt-sf-others-list-item.active').map(function(){
			if(jQuery(this).attr('data-itemvalue') != '') {
				return jQuery(this).attr('data-itemvalue');
			}
		}).get();


		// Radius

		if(jQuery.inArray( 'nearby', others ) > -1) {

			if((radius == '' && radius_unit == '') || (radius == undefined && radius_unit == undefined)) {
				var radius = jQuery('.wdt-sf-location-max-radius').val();
				var radius_unit = jQuery('.wdt-sf-location-radius-unit').val();
			}

			if(radius == undefined && radius_unit == undefined) {
				var radius = 100;
				var radius_unit = 'km';
			}

		}

		var use_radius = '';
		if((radius != '' && radius_unit != '') && (radius != undefined && radius_unit != undefined)) {
			var use_radius = 'true';
		}


		// Create array
		var filter_data = {};
		filter_data['keyword']              = keyword;
		filter_data['user_latitude']        = user_latitude;
		filter_data['user_longitude']       = user_longitude;
		filter_data['use_radius']           = use_radius;
		filter_data['radius']               = radius;
		filter_data['radius_unit']          = radius_unit;
		filter_data['categories']           = categories;
		filter_data['tags']                 = tags;
		filter_data['startdate']            = startdate;
		filter_data['features_query']       = features_query;
		filter_data['features_total_query'] = features_total_query;
		filter_data['orderby']              = orderby;
		filter_data['others']               = others;

		return filter_data;

	},

	wdtPortfolioImagePopup : function() {

		var enable_gallery_popup = jQuery('.wdt-listings-item-image-gallery-popup-enable');
		var repeater_items = enable_gallery_popup.find('.wdt-listings-item-container .wdt-listings-item-wrapper');
		
		jQuery(repeater_items).each(function() {
			var $this_item = jQuery(this);
			var $image_gallery = $this_item.find('.wdt-listings-item-image-gallery').attr('data-media-gallery');
			// var $image_src = $this_item.find('img');
			var $image_click = $this_item.find('.wdt-listings-hover-image-icon');
			var $image_type = 'image';	

			if( $image_gallery !== undefined ) {
				$image_gallery = jQuery.parseJSON($image_gallery);

				var $gallery_data = [];
				jQuery.each( $image_gallery, function( key, value ) {

					var $gallery_fields = {};
					$gallery_fields['src'] = value;
					$gallery_fields['type'] = $image_type;

					$gallery_data.push($gallery_fields);

				} );
			}
			wdtPortfolioFrontendUtils.wdtPortfolioLoadPopup($gallery_data, $image_type, $image_click);
		});

	},

	wdtPortfolioLoadPopup : function($gallery_data, $image_type, $image_click) {

		$image_click.magnificPopup({
			items: $gallery_data,
			gallery: {
			enabled: true
			},
			removalDelay: 500,
			showCloseBtn: true,
			enableEscapeKey: true,
			closeOnBgClick: true,
			mainClass: 'wdt-portfolio-listing-image-box-popup wdt-portfolio-image-popup-window',
			type: $image_type // this is default type
		});
	},

	wdtPortfolioLoadDataOutput : function(output_container) {

		var load_data = 'false';

		if(output_container == undefined) {

			var output_container = '';
			if(jQuery('.wdt-listing-output-data-container.wdt-search-list-items').length) {
				var output_container = jQuery('.wdt-listing-output-data-container.wdt-search-list-items');
				load_data = 'true';
			}

			if(load_data == 'false') {
				alert(wdtfrontendobject.outputDivAlert);
				return;
			}

		} else {

			if(output_container.hasClass('wdt-listing-output-data-container')) {
				load_data = 'true';
			} 

		}

		if(load_data == 'true') {
			var parent_item = output_container;
		}

		// Default options

		var enable_carousel = keyword = user_latitude = user_longitude = use_radius = radius = radius_unit = list_items = categories = tags = startdate = features_query = features_total_query = orderby = others = module_id = '';

		var type = gallery = post_per_page = columns = apply_isotope = excerpt_length = features_image_or_icon = features_include = no_of_cat_to_display = apply_equal_height = '';

		var isotope_filter = apply_child_of = show_isotope_filter_count = featured_items = custom_options = show_image_popup = enable_view_details_btn = '';

        var masonary_one_items = masonary_one_half_items = masonary_one_third_items = masonary_two_third_items = masonary_one_fourth_items = masonary_three_fourth_items = masonary_two_five_items = '';

		if(load_data == 'true') {

			type                               = output_container.find('.wdt-listing-output-data-holder').attr('data-type');
			gallery                            = output_container.find('.wdt-listing-output-data-holder').attr('data-gallery');
			post_per_page                      = output_container.find('.wdt-listing-output-data-holder').attr('data-postperpage');
			columns                            = output_container.find('.wdt-listing-output-data-holder').attr('data-columns');
			apply_isotope                      = output_container.find('.wdt-listing-output-data-holder').attr('data-applyisotope');
			excerpt_length                     = output_container.find('.wdt-listing-output-data-holder').attr('data-excerptlength');
			features_image_or_icon             = output_container.find('.wdt-listing-output-data-holder').attr('data-featuresimageoricon');
			features_include                   = output_container.find('.wdt-listing-output-data-holder').attr('data-featuresinclude');
			no_of_cat_to_display               = output_container.find('.wdt-listing-output-data-holder').attr('data-noofcattodisplay');
			apply_equal_height                 = output_container.find('.wdt-listing-output-data-holder').attr('data-applyequalheight');
			pagination_type                    = output_container.find('.wdt-listing-output-data-holder').attr('data-paginationtype');

			isotope_filter                     = output_container.find('.wdt-listing-output-data-holder').attr('data-isotopefilter');
            show_isotope_filter_count          = output_container.find('.wdt-listing-output-data-holder').attr('data-showisotopefiltercount');
			apply_child_of                     = output_container.find('.wdt-listing-output-data-holder').attr('data-applychildof');
			featured_items                     = output_container.find('.wdt-listing-output-data-holder').attr('data-featureditems');
			custom_options                     = output_container.find('.wdt-listing-output-data-holder').attr('data-customoptions');

			show_image_popup 				   = output_container.find('.wdt-listing-output-data-holder').attr('data-showimagepopup');
			enable_view_details_btn     	   = output_container.find('.wdt-listing-output-data-holder').attr('data-enableviewdetailsbtn');

		}

		// Direct item listings

		if((load_data == 'true' && output_container.hasClass('wdt-direct-list-items')) ) {

			var item_type = output_holder_type = '';
			if(load_data == 'true') {
				item_type = 'data';
				output_holder_type = output_container;
			}

			// Filters

			var list_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-listitemids');
			if(list_item_ids != undefined && list_item_ids != '') {
				list_items = list_item_ids.split(',');
			}

			var category_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-categoryids');
			if(category_ids != undefined && category_ids != '') {
				categories = category_ids.split(',');
			}

			var tag_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-tagids');
			if(tag_ids != undefined && tag_ids != '') {
				tags = tag_ids.split(',');
			}

            // Masonary

            var masonary_one_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonaryoneitems');
			if(masonary_one_item_ids != undefined && masonary_one_item_ids != '') {
				masonary_one_items = masonary_one_item_ids.split(',');
			}

            var masonary_one_half_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonaryonehalfitems');
			if(masonary_one_half_item_ids != undefined && masonary_one_half_item_ids != '') {
				masonary_one_half_items = masonary_one_half_item_ids.split(',');
			}

            var masonary_one_third_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonaryonethirditems');
			if(masonary_one_third_item_ids != undefined && masonary_one_third_item_ids != '') {
				masonary_one_third_items = masonary_one_third_item_ids.split(',');
			}

            var masonary_two_third_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonarytwothirditems');
			if(masonary_two_third_item_ids != undefined && masonary_two_third_item_ids != '') {
				masonary_two_third_items = masonary_two_third_item_ids.split(',');
			}

            var masonary_one_fourth_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonaryonefourthitems');
			if(masonary_one_fourth_item_ids != undefined && masonary_one_fourth_item_ids != '') {
				masonary_one_fourth_items = masonary_one_fourth_item_ids.split(',');
			}

            var masonary_three_fourth_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonarythreefourthitems');
			if(masonary_three_fourth_item_ids != undefined && masonary_three_fourth_item_ids != '') {
				masonary_three_fourth_items = masonary_three_fourth_item_ids.split(',');
			}

			var masonary_two_five_item_ids = output_holder_type.find('.wdt-listing-output-'+item_type+'-holder').attr('data-masonarytwofiveitems');
			if(masonary_two_five_item_ids != undefined && masonary_two_five_item_ids != '') {
				masonary_two_five_items = masonary_two_five_item_ids.split(',');
			}

			// Carousel

			var enable_carousel = output_holder_type.attr('data-enablecarousel');
			var module_id = output_holder_type.attr('data-moduleid');


		} else {

			// Filter options

			var filter_data      = wdtPortfolioFrontendUtils.wdtPortfolioFilterOptions();
			keyword              = filter_data.keyword;
			user_latitude        = filter_data.user_latitude;
			user_longitude       = filter_data.user_longitude;
			use_radius           = filter_data.use_radius;
			radius               = filter_data.radius;
			radius_unit          = filter_data.radius_unit;
			categories           = filter_data.categories;
			tags                 = filter_data.tags;
			startdate            = filter_data.startdate;
			features_query       = filter_data.features_query;
			features_total_query = filter_data.features_total_query;
			orderby              = filter_data.orderby;
			others               = filter_data.others;

			// Filter Option in Output Data Container
			if(categories == '') {
				if(load_data == 'true') {
					var category_ids = output_container.find('.wdt-listing-output-data-holder').attr('data-categoryids');
				} 
				if(category_ids != undefined && category_ids != '') {
					categories = category_ids.split(',');
				}
			}

		}

		var data_apply_isotope = apply_isotope;

		jQuery.ajax({
			type: "POST",
			url: wdtfrontendobject.ajaxurl,
			dataType: "JSON",
			data:
			{
				action                               : 'wdt_generate_load_search_data_ouput',
				current_page                         : 1,
				offset                               : 0,
				type                                 : type,
				gallery                              : gallery,
				post_per_page                        : post_per_page,
				columns                              : columns,
				apply_isotope                        : apply_isotope,
				isotope_filter                       : isotope_filter,
                show_isotope_filter_count            : show_isotope_filter_count,
				apply_child_of                       : apply_child_of,
				featured_items                       : featured_items,
				excerpt_length                       : excerpt_length,
				features_image_or_icon               : features_image_or_icon,
				features_include                     : features_include,
				no_of_cat_to_display                 : no_of_cat_to_display,
				apply_equal_height                   : apply_equal_height,
				pagination_type                      : pagination_type,

				custom_options                       : custom_options,

				keyword                              : keyword,
				user_latitude                        : user_latitude,
				user_longitude                       : user_longitude,
				use_radius                           : use_radius,
				radius                               : radius,
				radius_unit                          : radius_unit,
				list_items                           : list_items,
				categories                           : categories,
				tags                                 : tags,

				show_image_popup 					 : show_image_popup,
				enable_view_details_btn 			 : enable_view_details_btn,

                masonary_one_items         : masonary_one_items,
                masonary_one_half_items    : masonary_one_half_items,
                masonary_one_third_items   : masonary_one_third_items,
                masonary_two_third_items   : masonary_two_third_items,
                masonary_one_fourth_items  : masonary_one_fourth_items,
                masonary_three_fourth_items: masonary_three_fourth_items,
                masonary_two_five_items	   : masonary_two_five_items,

				startdate             : startdate,
				features_query        : features_query,
				features_total_query  : features_total_query,
				orderby               : orderby,
				others                : others,
				module_id 		      : module_id,

				enable_carousel       : enable_carousel,
				load_data             : load_data
			},
			beforeSend: function(){
				wdtPortfolioCommonUtils.wdtPortfolioAjaxBeforeSend(parent_item);
			},
			success: function (response) {

				// Load data
				if(load_data == 'true') {

					output_container.find('.wdt-listing-output-data-holder').html(response.data);

					if(data_apply_isotope == 'true') {
						// Isotope
						wdtPortfolioFrontendUtils.wdtPortfolioListingsListingIsotope(false);
					} else if(enable_carousel == 'true') {
						// Carousel
						wdtPortfolioFrontendUtils.wdtPortfolioListingCarousel(output_container);
					} else if(apply_equal_height == 'true') {
						//Equal Height
						output_container.find('.wdt-listings-item-wrapper').matchHeight({ property:"min-height" });
					}

					setTimeout(function(){
						wdtPortfolioFrontendUtils.wdtPortfolioListingImageSwiperGallery();
						if(jQuery.fn.niceScroll !== undefined) {
							jQuery('html').getNiceScroll().resize();
						}

						wdtPortfolioFrontendUtils.wdtPortfolioImagePopup();
						wdtPortfolioFrontendUtils.wdtPortfolioImageHoverContent();
					},1000);

				}

			},
			complete: function(){
				wdtPortfolioCommonUtils.wdtPortfolioAjaxAfterSend(parent_item);
			}
		});


	},

	wdtPortfolioImageHoverContent : function() {
		jQuery('.wdt-listings-item-wrapper').mousemove(function(event) {
			x = event.offsetX;
			y = event.offsetY;
			jQuery(this).find('.wdt-listings-item-hover-section').css('transform', 'translate3d(' + x + 'px, '+ y +'px, 0)');
		});
	},

	wdtPortfolioAjaxPagination : function() {

		jQuery( 'body' ).delegate( '.wdt-listing-pagination a:not(.disabled)', 'click', function(e) {

			wdtPortfolioFrontendUtils.wdtPortfolioImageHoverContent();

            e.preventDefault();

			var this_item = jQuery(this);

            if(this_item.parents('.wdt-listing-pagination').hasClass('wdt-loadmore-pagination loaded')){
                return false;
            }

			var listing_options = this_item.parents('.wdt-pagination').attr('data-listing-options');
			listing_options = jQuery.parseJSON(listing_options);

            var pagination_type = listing_options['pagination_type'];

			// Pagination Data
            var current_page;
            if(pagination_type == 'numbered') {
                var dynamic_pagination = false;
                if(this_item.parent().hasClass('prev-post')) {
                    current_page = parseInt(this_item.attr('data-currentpage'), 10)-1;
                } else if(this_item.parent().hasClass('next-post')) {
                    current_page = parseInt(this_item.attr('data-currentpage'), 10)+1;
                } else {
                    current_page = this_item.text();
                }
            } else if(pagination_type == 'loadmore' || pagination_type == 'infinity') {
                var dynamic_pagination = true;
                current_page = parseInt(this_item.attr('data-currentpage'), 10) + 1;
            }

			var post_per_page = listing_options['post_per_page'];

			if(current_page == 1) {
				var offset = 0;
			} else if(current_page > 1) {
				var offset = ((current_page-1)*post_per_page);
			}

			var function_call      = this_item.parents('.wdt-pagination').attr('data-functioncall');
			var output_div         = this_item.parents('.wdt-pagination').attr('data-outputdiv');

			var apply_isotope                      = listing_options['apply_isotope'];
            var show_isotope_filter_count          = listing_options['show_isotope_filter_count'];
			var enable_carousel                    = listing_options['enable_carousel'];
			var loader                             = listing_options['loader'];
			var loader_parent                      = listing_options['loader_parent'];
			var apply_equal_height                 = listing_options['apply_equal_height'];
			var parent_item                        = this_item.parents(loader_parent);

			var default_options =
			{
                dynamic_pagination: dynamic_pagination,
				action       : function_call,
				current_page : current_page,
				offset       : offset
			};

			var list_items = categories = tags = keyword = user_latitude = user_longitude = use_radius = radius = radius_unit = startdate = features_query = features_total_query = orderby = others = '';


			if(this_item.parents().hasClass('wdt-direct-list-items')) {

				var item_type = '';
				if(this_item.parents('.wdt-direct-list-items').hasClass('wdt-listing-output-data-container')) {
					var output_container = this_item.parents('.wdt-direct-list-items');
					item_type = 'data';
				}

				// Filters

				var list_item_ids = output_container.find('.wdt-listing-output-'+item_type+'-holder').attr('data-listitemids');
				if(list_item_ids != undefined && list_item_ids != '') {
					list_items = list_item_ids.split(',');
				}

				var category_ids = output_container.find('.wdt-listing-output-'+item_type+'-holder').attr('data-categoryids');
				if(category_ids != undefined && category_ids != '') {
					categories = category_ids.split(',');
				}

				var tag_ids = output_container.find('.wdt-listing-output-'+item_type+'-holder').attr('data-tagids');
				if(tag_ids != undefined && tag_ids != '') {
					tags = tag_ids.split(',');
				}

				var unique_options =
				{
					list_items          : list_items,
					categories          : categories,
					tags                : tags
				};

			} else {

				var output_container = jQuery('.wdt-listing-output-data-container');


				// Filter options

				var filter_data      = wdtPortfolioFrontendUtils.wdtPortfolioFilterOptions();
				keyword              = filter_data.keyword;
				user_latitude        = filter_data.user_latitude;
				user_longitude       = filter_data.user_longitude;
				use_radius           = filter_data.use_radius;
				radius               = filter_data.radius;
				radius_unit          = filter_data.radius_unit;
				categories           = filter_data.categories;
				tags                 = filter_data.tags;
				startdate            = filter_data.startdate;
				features_query       = filter_data.features_query;
				features_total_query = filter_data.features_total_query;
				orderby              = filter_data.orderby;
				others               = filter_data.others;

				// Filter Option in Output Data Container
				if(categories == '') {
					var category_ids = output_container.find('.wdt-listing-output-data-holder').attr('data-categoryids');
					if(category_ids != undefined && category_ids != '') {
						categories = category_ids.split(',');
					}
				}

				var unique_options =
				{
					keyword             : keyword,
					user_latitude       : user_latitude,
					user_longitude      : user_longitude,
					use_radius          : use_radius,
					radius              : radius,
					radius_unit         : radius_unit,
					categories          : categories,
					tags                : tags,
					startdate           : startdate,
					features_query      : features_query,
					features_total_query: features_total_query,
					orderby             : orderby,
					others              : others,
				};

			}

			var consolidated_options = Object.assign(default_options, listing_options, unique_options);
			consolidated_options['custom_options'] = consolidated_options['custom_options'] ? JSON.stringify(consolidated_options['custom_options']) : '';

			// ajax call
			jQuery.ajax({
				type: "POST",
				url: wdtcommonobject.ajaxurl,
				dataType: "JSON",
				data: consolidated_options,
				beforeSend: function() {
					if(loader == 'true') {
						wdtPortfolioCommonUtils.wdtPortfolioAjaxBeforeSend(parent_item);
					}
                    if(pagination_type == 'loadmore') {
                        this_item.prepend( '<span><i class="fa fa-spinner fa-spin"></i></span>' );
                    }
				},
				success: function (response) {

                    if(pagination_type == 'numbered') {

                        var offset_top = this_item.parents('.'+output_div).offset().top;

                        this_item.parents('.'+output_div).html(response.data);

                        if(apply_isotope == 'true') {
                            // Isotope
                            wdtPortfolioFrontendUtils.wdtPortfolioListingsListingIsotope(false);
                        } else if(enable_carousel == 'true') {
                            // Carousel
                            wdtPortfolioFrontendUtils.wdtPortfolioListingCarousel(output_container);
                        } else if(apply_equal_height == 'true') {
                            //Equal Height
                            output_container.find('.wdt-listings-item-wrapper').matchHeight({ property:"min-height" });
                        }

                        setTimeout(function(){
                            wdtPortfolioFrontendUtils.wdtPortfolioListingImageSwiperGallery();
                            if(jQuery.fn.niceScroll !== undefined) {
                                jQuery('html').getNiceScroll().resize();
                            }
                        },1000);

                        // Scroll to top
                        jQuery('html, body').animate({
                            scrollTop: parseInt(offset_top, 10)-60
                        }, 600);

						wdtPortfolioFrontendUtils.wdtPortfolioImagePopup();

                    } else if(pagination_type == 'loadmore' || pagination_type == 'infinity') {

                        if(response.dataids.length) {

                            this_item.parents('.'+output_div).find('.wdt-listings-item-container').append(response.data);
                            this_item.attr('data-currentpage', current_page);

                            if(apply_isotope == 'true') {
                                // Isotope
                                wdtPortfolioFrontendUtils.wdtPortfolioListingsListingIsotope(true);

                                if(show_isotope_filter_count) {
                                    var taxcounts = response.taxcounts;
                                    jQuery('.wdt-listings-item-isotope-filter a').each(function () {
                                        var cat_id = parseInt(jQuery(this).data('catid'), 10);
                                        var existing_count = parseInt(jQuery(this).find('span').html(), 10);
                                        var current_page_count = 0;
                                        var total_count = 0;
                                        if(cat_id == -1) {
                                            total_count = jQuery('.wdt-listings-item-container .wdt-column:not(.grid-sizer)').length;
                                        } else {
                                            if(typeof(taxcounts[cat_id]) != "undefined" && taxcounts[cat_id] !== null) {
                                                current_page_count = taxcounts[cat_id];
                                            }
                                            total_count = current_page_count + existing_count;
                                        }
                                        jQuery(this).find('span').html(total_count);
                                    });
                                }

                            } else if(enable_carousel == 'true') {
                                // Carousel
                                wdtPortfolioFrontendUtils.wdtPortfolioListingCarousel(output_container);
                            } else if(apply_equal_height == 'true') {
                                //Equal Height
                                output_container.find('.wdt-listings-item-wrapper').matchHeight({ property:"min-height" });
                            }

                            setTimeout(function(){
                                wdtPortfolioFrontendUtils.wdtPortfolioListingImageSwiperGallery();
                                if(jQuery.fn.niceScroll !== undefined) {
                                    jQuery('html').getNiceScroll().resize();
                                }
                            },1000);

							wdtPortfolioFrontendUtils.wdtPortfolioImagePopup();

                        } else {
                            this_item.html(wdtfrontendobject.noMorePosts);
                            this_item.parents('.wdt-loadmore-pagination').addClass('loaded');

							wdtPortfolioFrontendUtils.wdtPortfolioImageHoverContent();
                        }

                    }

				},
				complete: function() {
					if(loader == 'true') {
						wdtPortfolioCommonUtils.wdtPortfolioAjaxAfterSend(parent_item);
					}
                    if(pagination_type == 'loadmore') {
                        this_item.find('span').remove();
                    }
				}
			});

		});

        window.addEventListener('scroll', () => {

            let infinityItem = jQuery('.wdt-infinity-pagination');

            if(infinityItem.length) {

                const scrollTop = document.documentElement.scrollTop;

                let infinityItemOffset = infinityItem.offset();
                let infinityItemOffsetTop = Math.floor(infinityItemOffset.top - 400);

                if(scrollTop >= infinityItemOffsetTop) {
                    jQuery('.wdt-listing-pagination a').trigger('click');
                    jQuery('.wdt-listing-pagination a').addClass('disabled');

					this_item.parents('.wdt-loadmore-pagination').addClass('loaded');
                } else {
                    jQuery('.wdt-listing-pagination a').removeClass('disabled');
                }

            }

        });

	},

	wdtPortfolioListingImageSwiperGallery: function () {
		jQuery('.wdt-listings-image-gallery-container').each(function () {
			var $swiperItem = jQuery(this);

			const $mediamoduleId = $swiperItem.data('moduleid');
			const $mediaenablecarousel = $swiperItem.data('enablecarousel');
			const $mediacarouselautoplay = $swiperItem.data('carouselautoplay');
			const $mediacarouselslidesperview = $swiperItem.data('carouselslidesperview');
			const $mediacarouselloopmode = $swiperItem.data('carouselloopmode');
			const $mediacarouselmousewheelcontrol = $swiperItem.data('carouselmousewheelcontrol');
			const $mediacarouselverticaldirection = $swiperItem.data('carouselverticaldirection');
			const $mediacarouselpaginationtype = $swiperItem.data('carouselpaginationtype');
			const $mediacarouselnumberofthumbnails = $swiperItem.data('carouselnumberofthumbnails');
			const $mediacarouselarrowpagination = $swiperItem.data('carouselarrowpagination');
			const $mediacarouselspacebetween = $swiperItem.data('carouselspacebetween');
			const $mediacarouselnoofimages = $swiperItem.data('carouselnoofimages');
			const $carouselresponsive = $swiperItem.data('carouselresponsive');
			const $mediacarouseleffect = $swiperItem.data('carouseleffect');

			let initialSlide = 1;
			let direction = $mediacarouselverticaldirection === true ? 'vertical' : 'horizontal';

			// Swiper thumbnails (if any)
			const mediathumbswiperOptions = {
				initialSlide: initialSlide,
				simulateTouch: true,
				spaceBetween: 10,
				keyboard: {
					enabled: true,
				},
				grabCursor: true,
				slidesPerView: $mediacarouselnumberofthumbnails,
				loop: true,
				mousewheel: true,
			};
			const swiperThumbGallery = new Swiper('.wdt-media-thumb-carousel-module-id', mediathumbswiperOptions);

			// Main swiper options
			const mediaswiperOptions = {
				initialSlide: initialSlide,
				simulateTouch: true,
				keyboard: {
					enabled: true,
				},
				grabCursor: true,
				slidesPerView: $mediacarouselslidesperview,
				loop: $mediacarouselloopmode,
				direction: direction,
			};

			// Optional: Autoplay
			if ($mediacarouselautoplay && parseInt($mediacarouselautoplay) > 0) {
				mediaswiperOptions.autoplay = {
					enabled: true,
					delay: parseInt($mediacarouselautoplay),
				};
			}

			// Optional: Space between slides
			if (typeof $mediacarouselspacebetween !== 'undefined') {
				mediaswiperOptions.spaceBetween = parseInt($mediacarouselspacebetween);
			}

			// Optional: Mousewheel
			if ($mediacarouselmousewheelcontrol === true) {
				mediaswiperOptions.mousewheel = {
					forceToAxis: true,
				};
			}

			// Optional: Effect
			if ($mediacarouseleffect && typeof $mediacarouseleffect === 'string') {
				mediaswiperOptions.effect = $mediacarouseleffect;
				if ($mediacarouseleffect === 'coverflow') {
					mediaswiperOptions.coverflowEffect = {
						slideShadows: false,
						rotate: 0,
						stretch: 0,
						depth: 200,
						modifier: 1,
					};
				}
				if ($mediacarouseleffect === 'cube') {
					mediaswiperOptions.cubeEffect = {
						slideShadows: true,
						shadow: true,
						shadowOffset: 20,
						shadowScale: 0.94,
					};
				}
			}

			// Optional: Pagination
			let pagination_class = '';
			let pagination_type = '';
			if ($mediacarouselpaginationtype === 'bullets') {
				pagination_class = '.wdt-swiper-bullet-pagination';
				pagination_type = 'bullets';
			} else if ($mediacarouselpaginationtype === 'fraction') {
				pagination_class = '.wdt-swiper-fraction-pagination';
				pagination_type = 'fraction';
			} else if ($mediacarouselpaginationtype === 'progressbar') {
				pagination_class = '.wdt-swiper-progress-pagination';
				pagination_type = 'progressbar';
			}

			if (pagination_class && pagination_type) {
				mediaswiperOptions.pagination = {
					el: pagination_class,
					type: pagination_type,
					clickable: true,
				};
			}

			// Optional: Scrollbar
			if ($mediacarouselpaginationtype === 'scrollbar') {
				mediaswiperOptions.scrollbar = {
					el: '.wdt-swiper-scrollbar',
					hide: false,
					draggable: true,
					dragSize: 30,
				};
			}

			// Optional: Responsive breakpoints
			if ($carouselresponsive && $carouselresponsive['responsive']) {
				const $responsiveData = {};
				jQuery.each($carouselresponsive['responsive'], function (index, value) {
					$responsiveData[value.breakpoint] = {
						slidesPerView: value.toshow,
					};
				});
				mediaswiperOptions.breakpoints = $responsiveData;
			}

			// Optional: Arrow navigation
			if ($mediacarouselarrowpagination === true) {
				mediaswiperOptions.navigation = {
					prevEl: '.wdt-swiper-arrow-prev-' + $mediamoduleId,
					nextEl: '.wdt-swiper-arrow-next-' + $mediamoduleId,
				};
			}

			// Optional: Thumbnail swiper
			if ($mediacarouselpaginationtype === 'thumbnail') {
				mediaswiperOptions.thumbs = {
					swiper: swiperThumbGallery,
				};
			}

			console.log('mediaswiperOptions', mediaswiperOptions);

			// Initialize main Swiper
			new Swiper('.wdt-media-carousel-module-id-' + $mediamoduleId, mediaswiperOptions);
		});
	},

	wdtPortfolioContentScroll: function () {
		if (!jQuery('.wdt-content-scroll').length) {
			return;
		}
		function initNiceScroll() {
			if (typeof jQuery.fn.niceScroll === 'function') {
				jQuery('.wdt-content-scroll').niceScroll({
					cursorcolor: wdtfrontendobject.primaryColor,
					cursorwidth: '5px',
					background: wdtfrontendobject.tertiaryColor,
					cursorborder: 'none'
				});
			} else {
				console.warn('niceScroll plugin did not become available after loading.');
			}
		}
		if (typeof jQuery.fn.niceScroll === 'function') {
			initNiceScroll();
			return;
		}

		var scriptId = 'wdt-nicescroll-script';

		if (document.getElementById(scriptId)) {
			var retries = 0;
			var maxRetries = 15;
			var interval = setInterval(function () {
				if (typeof jQuery.fn.niceScroll === 'function') {
					clearInterval(interval);
					initNiceScroll();
				} else if (++retries >= maxRetries) {
					clearInterval(interval);
					console.warn('Timed out waiting for niceScroll to load.');
				}
			}, 200);
			return;
		}

		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.id = scriptId;
		script.src = wdtfrontendobject.pluginPath + 'assets/js/jquery.nicescroll.js';
		script.type = 'text/javascript';
		script.onload = function () {
			initNiceScroll();
		};
		script.onerror = function () {
			console.error('Failed to load niceScroll script from', script.src);
		};
		head.appendChild(script);
	},
	wdtPortfolioResponsiveMortageCalculator : function() {

		if(jQuery('.lidd_mc_form').length) {

			jQuery('.lidd_mc_input input[type="text"]').each(function() {
				jQuery( this ).wrap( '<div class="wdt-rmc-field-wrap"></div>' );
				jQuery( '<span></span>' ).insertAfter( jQuery(this) );
			});

		}

	}

};

var wdtPortfolioFrontend = {

	dtInit : function() {

		var isMobile = (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/Blackberry/i)) || (navigator.userAgent.match(/Windows Phone/i)) ? true : false;
		var currentWidth = window.innerWidth || document.documentElement.clientWidth;

		wdtPortfolioFrontend.wdtPortfolio(isMobile, currentWidth);
		wdtPortfolioFrontend.dtLoadData();

	},

	wdtPortfolio : function(isMobile, currentWidth) {

		jQuery(window).on('resize', function() {
			wdtPortfolioFrontendUtils.wdtPortfolioListingsListingIsotope(false);
			wdtPortfolioFrontendUtils.wdtPortfolioContentScroll();
		});

		wdtPortfolioFrontendUtils.wdtPortfolioListingsListingIsotope(false);

		wdtPortfolioFrontendUtils.wdtPortfolioAjaxPagination();

		// Image Swiper Gallery for Listings & Single Page
			wdtPortfolioFrontendUtils.wdtPortfolioListingImageSwiperGallery();

		wdtPortfolioFrontendUtils.wdtPortfolioContentScroll();

		wdtPortfolioFrontendUtils.wdtPortfolioResponsiveMortageCalculator();

	},

	dtLoadData : function() {

		jQuery('.wdt-direct-list-items').each(function() {
			wdtPortfolioFrontendUtils.wdtPortfolioLoadDataOutput(jQuery(this));
		});

	},

};

jQuery(document).ready(function() {

	if(!wdtfrontendobject.elementorPreviewMode) {
		wdtPortfolioFrontend.dtInit();
	}

});

( function( $ ) {

	var wdtPortfolioFrontendJs = function($scope, $){
		wdtPortfolioFrontend.dtInit();
	};

    $(window).on('elementor/frontend/init', function(){
		if(wdtfrontendobject.elementorPreviewMode) {
			elementorFrontend.hooks.addAction('frontend/element_ready/wdt-widget-df-listings-listing.default', wdtPortfolioFrontendJs);
		}
	});

} )( jQuery );