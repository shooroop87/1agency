jQuery(document).ready(function($) { 
     
    var $document = jQuery(document);
    var $body = jQuery('body');
    var $swiperContainer = jQuery('.wdt-product-image-gallery').closest('.swiper-container');
    var swiper = $swiperContainer[0]?.swiper; 
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    } 
    var optionTextSplitRegex = /,\s*/;
    
    var swatchVar = $('.swatch');
    if(swatchVar){
        swatchVar.each(function() {
        var newStyle = $(this).find('div').attr('data-newstyle');
        if (newStyle) {
          $(this).find('div').attr('style', newStyle);
          $(this).find('div').removeAttr('data-newstyle');
        }
      });
    }
      
    
    $document.on('click', '.product_swatch', debounce(function(e) {
        e.preventDefault();
        var $this = jQuery(this); 
        if ($this.hasClass('selected')) {
            return;
        } 
        var swatchData = $this.data();
        var productId = swatchData.product;
        var swatchProductId = ".proswatch-" + productId;
        var $attributeGroup = $this.closest('.attribute-swatches'); 
        $this.addClass('available attribute-selectedswatches selected')
             .siblings('.product_swatch').removeClass('attribute-selectedswatches'); 
        if (swiper && swatchData.attachId) {
            try {
                var $targetSlide = jQuery('.wdt-product-image.swiper-slide:not(.swiper-slide-duplicate)[data-variant_id="' + swatchData.attachId + '"]');
                if (!$targetSlide.length) {
                    $targetSlide = jQuery('.wdt-product-image[data-variant_id="' + swatchData.attachId + '"]');
                }
                
                if ($targetSlide.length) {
                    var slideIndex = $targetSlide.data('swiper-slide-index') || $targetSlide.index();
                    swiper.slideTo(slideIndex, 300);
                }
            } catch (error) {
                console.error('Swiper error:', error);
            }
        }
     
        var selectedAttributes = {};
        var selectedValues = [];
        jQuery('.product_swatch.selected').each(function() {
            var data = jQuery(this).data();
            selectedAttributes[data.attributeName] = data.attributeValue;
            selectedValues.push(data.attributeValue.toLowerCase());
        });
        var selectedValuesStr = selectedValues.join(', '); 
        var $attributeSelect = jQuery('#all-attributes-' + productId);
        var $priceDisplay = jQuery('.wdt-swatch-product-price');
        var $addToCartBtn = jQuery('.woocommerce-variation-add-to-cart button'); 
        var options = $attributeSelect.find('option');
        var matchedOption = null;
        var matchedOptionTexts = [];
        
        options.each(function() {
            var $option = jQuery(this);
            var optionText = $option.text().trim().toLowerCase(); 
            if (optionText === selectedValuesStr) {
                matchedOption = $option;
                return false;  
            } 
            var optionParts = optionText.split(optionTextSplitRegex);
            var allMatch = selectedValues.every(function(val) {
                return optionParts.includes(val);
            });
            
            if (allMatch) {
                matchedOptionTexts.push(optionText);
                $option.prop('selected', true);
            }
        }); 
        if (matchedOption) {
            $priceDisplay.text(matchedOption.data('price'));
            matchedOption.prop('selected', true).trigger('change'); 
        } 
        jQuery(swatchProductId).each(function() {
            var $swatch = jQuery(this);
            var swatchValue = $swatch.data('attribute-value')?.toLowerCase();
            var isAvailable = matchedOptionTexts.some(function(optionText) {
                var parts = optionText.split(optionTextSplitRegex);
                return parts.includes(swatchValue);
            });
            $swatch.toggleClass('available', isAvailable);
        }); 
    
    
        var attributeName = $this.data('attribute-name');
        var attributeValue = $this.data('attribute-value'); 
        var productId = $this.data('product');
        var attach_imageid = $this.data('attach-id');
    
       
        try { 
            var swiperContainer = $('.wdt-product-image-gallery').closest('.swiper-container');
            var swiper = swiperContainer[0]?.swiper;
         
            if (!swiper) {
                swiper = document.querySelector('.swiper-container')?.swiper;
            }
         
            if (!swiper) {
                swiper = document.querySelector('.wdt-product-image-gallery')?.swiper;
            }
        
            if (!swiper) {
                throw new Error("Swiper instance not found");
            }
        
            
            var targetSlide = $('.wdt-product-image.swiper-slide:not(.swiper-slide-duplicate)[data-variant_id="' + attach_imageid + '"]');
            
            if (!targetSlide.length) { 
                targetSlide = $('.wdt-product-image[data-variant_id="' + attach_imageid + '"]');
            }
        
            if (targetSlide.length) {
                var slideIndex; 
                if (targetSlide.attr('data-swiper-slide-index')) {
                    slideIndex = parseInt(targetSlide.attr('data-swiper-slide-index'));
                }  
                else {
                    slideIndex = targetSlide.index();
                }
        
                console.log('Navigating to slide', slideIndex, 'for variant', attach_imageid);
                swiper.slideTo(slideIndex, 300); 
            } else {
                console.warn('No slide found for variant ID:', attach_imageid);
            }
        } catch (error) {
            console.error('Swiper navigation error:', error);
            console.debug('Debug info:', {
                attach_imageid,
                swiper: window.swiper, 
                slides: $('.wdt-product-image').length
            });
        }
    
        jQuery.ajax({
            url: ajax_object.ajaxurl,
            type: 'POST',
            data: {
                action: 'swatches_shop',
                attribute_name: swatchData.attributeName,
                attribute_value: swatchData.attributeValue,
                selected_attributes: selectedAttributes,
                product_id: productId
            },
            success: function(response) {
                if (response.success) {
                    $addToCartBtn.removeClass('disabled');
                }
            }
        });
    }, 100));  
    
    
    
   // $document.on('change', '.attribute-swatchesselect select', debounce(function(e) {
    $(document).on('change', '.attribute-swatchesselect select, .attribute-swatchesselectbox select', debounce(function(e) {
        
      
        
        if (jQuery(this).find('option:selected').is(':first-child')) {
           
              jQuery('.product_swatch').addClass('available');
          } else { 
                jQuery('.product_swatch').removeClass('available'); 
          } 
    
    var productId = jQuery(this).closest('.attribute-swatchesselectbox').data('product-id'); 
    var product_image = '.post-' + productId + ' .primary-image img'; 
    var imageUrl = jQuery(this).find('option:selected').data('variantimage');
    jQuery(product_image).attr("src", imageUrl);  
    
    var main_div = '.post-' + productId;
    var $container = jQuery(main_div);
    var $buttonLink = $container.find('a.wdt-button.too-small.button.product_type_variable');  
    $buttonLink.text('loading');  
              var product_price = '.wdt-swatch-product-price'; 
              
              var variantId = jQuery(this).find('option:selected').val(); 
              jQuery('.variation-id-field').val(variantId); 
              var $clickedElement = jQuery(this); 
              jQuery.ajax({
                  url: ajax_object.ajaxurl,
                  type: 'POST',
                  data: {
                      action: 'getproduct_details', 
                      variant_id: variantId,
                      product_id: productId 
                  },
                  success: function(response) {
                      if (response.success) {  
                          var attributes = response.data.attributes; 
                          $buttonLink.attr('data-variant_id',variantId);
                          if (attributes && typeof attributes === 'object') {
                              let attributeParams = '';
                              for (const [key, value] of Object.entries(attributes)) {
                                  attributeParams += `&attribute_${key}=${encodeURIComponent(value)}`;
                              }
                              var addToCartUrl = `?add-to-cart=${productId}`;
                          
                              $buttonLink
                                .attr('href', addToCartUrl)
                                .text('Add to Cart');
                                $buttonLink.hide();
                               
                              var $existingButton = $buttonLink.next('.add_to_cart_variantbutton');
    
                              if ($existingButton.length === 0) { 
                                  $buttonLink.after(
                                      `<button class="add_to_cart_variantbutton" data-product_id="${productId}" data-variant_id="${variantId}">Add to Cart</button>`
                                  );
                              } else { 
                                  $existingButton
                                      .attr('data-product_id', productId)
                                      .attr('data-variant_id', variantId)
                                      .text('Add to Cart');
                              }
    
     
                             jQuery('a.wdt-button.too-small.button.product_type_variable').addClass('ajax_add_to_cart_variant');
                             jQuery('a.wdt-button.too-small.button.product_type_variable').addClass('add_to_cart_button'); 
                          }  
                          
      
                          
                      $clickedElement.closest('li.product-grid-view').addClass('remove_secondaryimg');
                      
                      var add_to_cart_button = '.post-'+productId+ ' .add_to_cart_button'; 
                      console.log("Response:11", productId +variantId + response.data); 
                      jQuery('.stock-status').text(response.data.stock_status);
                      //jQuery(product_image).attr("src", response.data.variant_image);
                      jQuery(add_to_cart_button).attr("href", response.data.cart_url);
    
                      
                       
                      }  
                  }
              });
    }, 100));
    
    
    jQuery(document).on('click', '.add_to_cart_variantbutton', function(e) {
        e.preventDefault();
    
        var button = jQuery(this);
        var productId = button.data('product_id');
        var variantId = button.data('variant_id');
    
        jQuery.ajax({
            url: wc_add_to_cart_params.ajax_url,  
            type: 'POST',
            data: {
                action: 'woocommerce_ajax_add_to_cart',
                product_id: productId,
                variation_id: variantId,
                quantity: 1
            },
            success: function(response) {
                if (response.error && response.product_url) {
                    window.location = response.product_url;
                } else { 
                    jQuery(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, button]);
                    
                }
            }
        });
    });
    
    
    
    
    $document.on('click', '.clear_swatchespro', debounce(function(e) {
       // jQuery('.clear_swatchespro').on('click', function() { 
        
            let productId = jQuery(this).data('product-id');    
            jQuery('.proswatch-'+productId).removeClass('selected');
            jQuery('.proswatch-'+productId).removeClass('attribute-selectedswatches');
            jQuery('.product_swatch').addClass('available');
            jQuery.ajax({
                type: 'POST',
                url: ajax_object.ajaxurl,
                data: {
                    action: 'getproduct_details',
                    product_id: productId,  
                },
                beforeSend: function() {
                    console.log('Fetching default product details...');
                },
                success: function(response) {
                    console.log(response.data)
                    if (response.success) {
                       // jQuery('.proswatch-'+productId).removeAttr('style'); 
                         var product_price = '.post-' + productId + ' .product-price';  
                         const firstOption = $('#all-attributes-' + productId + ' option').first();
                         firstOption.prop('selected', true).trigger('change');
                        console.log("Clear Success")
                        jQuery('.woocommerce-variation-add-to-cart button').addClass('disabled');
                    } else {
                        console.log('Error fetching product details:', response.data.message);
                    }
                },
                error: function() {
                    console.log('AJAX request failed.');
                }
            });
        }, 100)); 
    
      /* Listing page code */  
      
    $document.on('click', '.swatch', debounce(function(e) { 
        e.preventDefault();
        var $this = jQuery(this); 
        if ($this.hasClass('selected')) {
            return;
        } 
        var swatchData = $this.data();
        var productId = swatchData.product;
        var swatchProductId = ".swatch-" + productId;
        $this.addClass('available attribute-swatchesselect selected')
             .siblings('.swatch').removeClass('attribute-selectedswatches'); 
       $this.addClass('available attribute-swatchesselect selected')
             .siblings('.swatch').removeClass('available');  
       $this.addClass('available attribute-swatchesselect selected')
             .siblings('.swatch').removeClass('selected');  
     
        var selectedAttributes = {};
        var selectedValues = [];
        jQuery(swatchProductId + '.selected').each(function() {
            
            var data = jQuery(this).data();
            selectedAttributes[data.attributeName] = data.attributeValue;
            selectedValues.push(data.attributeValue.toLowerCase());
        });
        var selectedValuesStr = selectedValues.join(', '); 
        var $attributeSelect = jQuery('#all-attributes-' + productId);
        var post_productId = '.post-' + productId + ' .product-price'; 
        var $priceDisplay = jQuery(post_productId);
        var $addToCartBtn = jQuery('.woocommerce-variation-add-to-cart button'); 
        var options = $attributeSelect.find('option');
        var matchedOption = null;
        var matchedOptionTexts = [];
        
        options.each(function() {
            var $option = jQuery(this);
            var optionText = $option.text().trim().toLowerCase(); 
            if (optionText === selectedValuesStr) {
                matchedOption = $option;
                return false;  
            } 
            var optionParts = optionText.split(optionTextSplitRegex);
            var allMatch = selectedValues.every(function(val) {
                return optionParts.includes(val);
            });
            
            if (allMatch) {
                matchedOptionTexts.push(optionText);
                $option.prop('selected', true);
            }
        }); 
        if (matchedOption) {
            $priceDisplay.text(matchedOption.data('price'));
            matchedOption.prop('selected', true).trigger('change'); 
        } 
        jQuery(swatchProductId).each(function() {
            var $swatch = jQuery(this);
            var swatchValue = $swatch.data('attribute-value')?.toLowerCase();
            var isAvailable = matchedOptionTexts.some(function(optionText) {
                var parts = optionText.split(optionTextSplitRegex);
                return parts.includes(swatchValue);
            });
            $swatch.toggleClass('available', isAvailable);
        }); 
    
    
        var attributeName = $this.data('attribute-name');
        var attributeValue = $this.data('attribute-value'); 
        var productId = $this.data('product');
        var attach_imageid = $this.data('attach-id');
    
        
        jQuery.ajax({
            url: ajax_object.ajaxurl,
            type: 'POST',
            data: {
                action: 'swatches_shop',
                attribute_name: swatchData.attributeName,
                attribute_value: swatchData.attributeValue,
                selected_attributes: selectedAttributes,
                product_id: productId
            },
            success: function(response) {
                if (response.success) {
                    $addToCartBtn.removeClass('disabled');
                }
            }
        });
    }, 100));  
    
    
     
      
      
    jQuery('.clear_swatches').on('click', function() { 
        let productId = jQuery(this).data('product-id');   
        jQuery('.swatch-'+productId).removeClass('selected');
        
        jQuery.ajax({
            type: 'POST',
            url: ajax_object.ajaxurl,
            data: {
                action: 'getproduct_details',
                product_id: productId,  
            },
            beforeSend: function() {
                console.log('Fetching default product details...');
            },
            success: function(response) {
                if (response.success) {
                    jQuery('.swatch-'+productId).removeAttr('style');
                    var product_price = '.post-' + productId + ' .product-price';
                    var product_image = '.post-' + productId + ' .primary-image img';
                    var add_to_cart_button = '.post-' + productId + ' .add_to_cart_button'; 
    
                    jQuery(product_price).text(response.data.price);
                    jQuery('.stock-status').text(response.data.stock_status);
                    jQuery(add_to_cart_button).attr("href", response.data.cart_url);
                    
                } else {
                    console.log('Error fetching product details:', response.data.message);
                }
            },
            error: function() {
                console.log('AJAX request failed.');
            }
        });
    });
    });
    
    
    
    
     
    