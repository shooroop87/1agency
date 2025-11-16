
(function($) {
    "use strict";

    
    
    function initMonolit() {
        "use strict";
        var ss = jQuery(".single-slider");
        var ss_ops = ss.data('options') ? ss.data('options') : {smartSpeed:1300,autoplay:false,autoplaySpeed: 3600,items:1,autoplayTimeout:4000,responsive:false,autoHeight:true,loop:true,dots:true,center:false,autoWidth:false};
        if(ss_ops.responsive){
            var respArr = ss_ops.responsive.split(',');
            ss_ops.responsive = {};
            for (var i = 0; i < respArr.length ; i++){
                var tempVal = respArr[i].split(':');
                ss_ops.responsive[tempVal[0]] = { items: tempVal[1] };

            }
        }else{
            ss_ops.responsive = false;
        }
        ss.imagesLoaded( function() {
            ss.owlCarousel({
                margin: 0,
                items: ss_ops.items,
                smartSpeed: ss_ops.smartSpeed,
                loop: ss_ops.loop,
                nav: false,
                dots:ss_ops.dots,
                autoHeight: ss_ops.autoHeight,
                autoplay: ss_ops.autoplay,
                autoplayTimeout: ss_ops.autoplayTimeout,
                autoplaySpeed: ss_ops.autoplaySpeed,
                responsive:ss_ops.responsive,
                center:ss_ops.center,
                autoWidth:ss_ops.autoWidth,
            });
        });
        jQuery(document).on('keydown.carousel-ss', function(e) {
            if(e.keyCode == 37) {
                // console.log('left arrow');
                ss.trigger("prev.owl");
            };
            if(e.keyCode == 39) {
                ss.trigger("next.owl");
            };
        });
        jQuery(".single-slider-holder a.next-slide").on("click", function() {
            jQuery(this).closest(".single-slider-holder").find(ss).trigger("next.owl.carousel");
            return false;
        });
        jQuery(".single-slider-holder a.prev-slide").on("click", function() {
            jQuery(this).closest(".single-slider-holder").find(ss).trigger("prev.owl.carousel");
            return false;
        });
        var sync1 = jQuery(".hero-wrap-image-slider"), sync2 = jQuery(".hero-wrap-text-slider"), flag = false, duration = parseInt(sync1.data('dur')), rtlt = eval(jQuery(this).data("rtlt"));
        var sync2_ops = sync2.data('options') ? sync2.data('options') : {smartSpeed:1200,autoplay:false,autoplaySpeed: 3600,items:1,autoplayTimeout:4000,responsive:false,loop:false,dots:true,center:false};
        if(sync2_ops.responsive){
            var respArr = sync2_ops.responsive.split(',');
            sync2_ops.responsive = {};
            for (var i = 0; i < respArr.length ; i++){
                var tempVal = respArr[i].split(':');
                sync2_ops.responsive[tempVal[0]] = { items: tempVal[1] };

            }
        }else{
            sync2_ops.responsive = false;
        }
        sync1.owlCarousel({
            loop: false,
            margin: 0,
            nav: false,
            items: sync2_ops.items,
            dots: false,
            smartSpeed: sync2_ops.smartSpeed,
            autoHeight: false,
            autoplay: false,
            autoplayTimeout: sync2_ops.autoplayTimeout,
            autoplaySpeed: sync2_ops.autoplaySpeed,
            responsive:sync2_ops.responsive,
            center:sync2_ops.center,
            autoWidth:false,
        }).on("changed.owl.carousel", function(a) {
            if (!flag) {
                flag = true;
                sync2.trigger("to.owl.carousel", [ a.item.index, duration, true ]);
                flag = false;
            }
        });
        sync2.owlCarousel({
            loop: false,
            margin: 0,
            nav: false,
            items: sync2_ops.items,
            dots: sync2_ops.dots,
            smartSpeed: sync2_ops.smartSpeed,
            autoHeight: false,
            autoplay: sync2_ops.autoplay,
            autoplayTimeout: sync2_ops.autoplayTimeout,
            autoplaySpeed: sync2_ops.autoplaySpeed,
            responsive:sync2_ops.responsive,
            center:sync2_ops.center,
            autoWidth:false,
        }).on("changed.owl.carousel", function(a) {
            if (!flag) {
                flag = true;
                sync1.trigger("to.owl.carousel", [ a.item.index, duration, true ]);
                flag = false;
            }
        });
        jQuery(".hero-wrap-text-slider-holder a.next-slide").on("click", function() {
            jQuery(this).closest(".hero-wrap-text-slider-holder").find(sync2).trigger("next.owl.carousel");
            return false;
        });
        jQuery(".hero-wrap-text-slider-holder a.prev-slide").on("click", function() {
            jQuery(this).closest(".hero-wrap-text-slider-holder").find(sync2).trigger("prev.owl.carousel");
            return false;
        });
        //new home slider with loop
        jQuery('.home-slider-loop').each(function(){
            var slloop = jQuery(this);
            var slloop_ops = slloop.data('options') ? slloop.data('options') : {smartSpeed:1200,autoplay:false,autoplaySpeed: 3600,items:1,autoplayTimeout:4000,responsive:false,loop:true,dots:true,center:false};
            if(slloop_ops.responsive){
                var respArr = slloop_ops.responsive.split(',');
                slloop_ops.responsive = {};
                for (var i = 0; i < respArr.length ; i++){
                    var tempVal = respArr[i].split(':');
                    slloop_ops.responsive[tempVal[0]] = { items: tempVal[1] };

                }
            }else{
                slloop_ops.responsive = false;
            }
            slloop.owlCarousel({
                loop: slloop_ops.loop,
                margin: 0,
                nav: false,
                items: slloop_ops.items,
                dots: slloop_ops.dots,
                smartSpeed: slloop_ops.smartSpeed,
                autoHeight: false,
                autoplay: slloop_ops.autoplay,
                autoplayTimeout: slloop_ops.autoplayTimeout,
                autoplaySpeed: slloop_ops.autoplaySpeed,
                responsive:slloop_ops.responsive,
                center:slloop_ops.center,
                autoWidth:false,

                // animateOut: 'fadeOut',
                // animateIn: 'fadeIn'
            });
            jQuery(".hero-wrap-image-slider-holder a.next-slide").on("click", function() {
                jQuery(this).closest(".hero-wrap-image-slider-holder").find(slloop).trigger("next.owl.carousel");
                return false;
            });
            jQuery(".hero-wrap-image-slider-holder a.prev-slide").on("click", function() {
                jQuery(this).closest(".hero-wrap-image-slider-holder").find(slloop).trigger("prev.owl.carousel");
                return false;
            });
        
        });
        var gR = jQuery(".gallery_horizontal"), w = jQuery(window);//, cf = jQuery(".gallery_horizontal").data("cen");
        var gR_ops = gR.data('options') ? gR.data('options') : {smartSpeed:1300,autoplay:false,items:1,loop:true,center:true,autoWidth:true,thumbs:true};
        function initGalleryhorizontal() {
            var a = jQuery(window).height(), b = jQuery("header.monolit-header").outerHeight(), c = jQuery(".gallery_horizontal");
            var d = 0;
            if( jQuery(".control-panel").length > 0 && !jQuery(".control-panel").hasClass('hide-cpanel') ) d = jQuery(".control-panel").outerHeight();
            c.find("img").css({
                height: a - b - d - 20
            });
            // if (gR.find(".owl-stage-outer").length) {
            //     gR.trigger("destroy.owl.carousel");
            //     gR.find(".horizontal_item").unwrap();
            // }
            if (w.width() > 1036){
                gR.owlCarousel({
                    autoWidth: gR_ops.autoWidth,
                    margin: 10,
                    items: gR_ops.items,
                    smartSpeed: gR_ops.smartSpeed,
                    loop: gR_ops.loop,
                    autoplay: gR_ops.autoplay,
                    center: gR_ops.center,
                    nav: false,
                    thumbs: gR_ops.thumbs,
                    thumbImage: true,
                    thumbContainerClass: "owl-thumbs",
                    thumbItemClass: "owl-thumb-item",
                    onInitialized: function() {
                        // gR.find(".owl-stage").css({
                        //     height: a - b - d,
                        //     overflow: "hidden"
                        // });
                        if( gR.find(".owl-item.active.center").length ){
                            var c = gR.find(".owl-item.active.center").find(".horizontal_item")
                        }else{
                            var c = gR.find(".owl-item.active").find(".horizontal_item")
                        }
                        // var c = jQuery(".owl-carousel").find(".active").find(".horizontal_item");
                        var e = c.data("phdesc");
                        var f = c.data("phname");
                        if (e) jQuery(".caption").html("<h4>" + f + "</h4><p>" + e + "</p>");
                    }
                }).on("changed.owl.carousel", function(e) {
                    gR.find(".owl-stage").css({
                        height: a - b - d,
                        overflow: "hidden"
                    });
                });

                var full_in_mousewheel_pro = false;
                    
                gR.on("translated.owl.carousel", function(a) {
                    full_in_mousewheel_pro = false;
                });
                
                gR.on("mousewheel", ".owl-stage", function(a) {
                    if(!full_in_mousewheel_pro) {
                        full_in_mousewheel_pro = true;
                        if (a.deltaY < 0) gR.trigger("next.owl"); else gR.trigger("prev.owl");
                    }
                    a.preventDefault();
                });

                gR.closest('.monolit_sec').css('height', a );

            }else{
                if (gR.find(".owl-stage-outer").length) {
                    gR.trigger("destroy.owl.carousel");
                    //gR.find(".horizontal_item").unwrap();
                }
                gR.closest('.monolit_sec').css('height',c.outerHeight() );
            }
        }
        if (gR.length) {
            gR.imagesLoaded( function() {
                initGalleryhorizontal();
                w.on("resize.destroyhorizontal", function() {
                    setTimeout(initGalleryhorizontal, 150);
                });
            });
        }
        // jQuery(window).on('resize',function(){
        //     if(gR.find(".owl-stage-outer").length) gR.trigger('refresh.owl.carousel');
        // });
        jQuery(document).on('keydown.carousel-hz', function(e) {
            if(e.keyCode == 37) {
                gR.trigger("prev.owl");
            };
            if(e.keyCode == 39) {
                gR.trigger("next.owl");
            };
        });

        /*new from version 1.5 */
        // var full_in_mousewheel_pro = false;
        // jQuery(".mousecontr").each(function(){
        //     var slider = jQuery(this);
            
        //     slider.on("translated.owl.carousel", function(a) {
        //         full_in_mousewheel_pro = false;
        //     });
            
        //     slider.on("mousewheel", ".owl-stage", function(a) {
        //         if(!full_in_mousewheel_pro) {
        //             full_in_mousewheel_pro = true;
        //             if (a.deltaY < 0) slider.trigger("next.owl"); else slider.trigger("prev.owl");
        //         }
        //         a.preventDefault();
        //     });
        // });
        jQuery(".keyboardcontr").each(function(){
            var slider = jQuery(this);
            jQuery(document).on('keydown.slider-carousel', function(e) {
                if(e.keyCode == 37) {
                    slider.trigger("prev.owl");
                };
                if(e.keyCode == 39) {
                    slider.trigger("next.owl");
                };
            });
        });

        jQuery(".refrestonresizeowl").each(function(){
            var slider = jQuery(this);
            jQuery(window).on('resize',function(){
                if(slider.find(".owl-stage-outer").length) slider.trigger('refresh.owl.carousel');
            });
        });

        /* end new from version 1.5 */
        /*if(jQuery('.monolit_folio_head_sec').length == 0 && jQuery('.content-footer').length == 0){
            gR.on("mousewheel", ".owl-stage", function(a) {
                if (a.deltaY < 0) gR.trigger("next.owl"); else gR.trigger("prev.owl");
                a.stopPropagation();
                a.preventDefault();
            });
        }*/
        
        gR.on("translated.owl.carousel", function(a) {
            // var b = jQuery(this).find(".active").find(".horizontal_item").data("phdesc");
            // var c = jQuery(this).find(".active").find(".horizontal_item").data("phname");
            if( jQuery(this).find(".owl-item.active.center").length ){
                var b = jQuery(this).find(".owl-item.active.center").find(".horizontal_item").data("phdesc");
                var c = jQuery(this).find(".owl-item.active.center").find(".horizontal_item").data("phname");
            }else{
                var b = jQuery(this).find(".owl-item.active").find(".horizontal_item").data("phdesc");
                var c = jQuery(this).find(".owl-item.active").find(".horizontal_item").data("phname");
            }
            if (b) jQuery(".caption").html("<h4>" + c + "</h4><p>" + b + "</p>");
        });
        jQuery(".resize-carousel-holder a.next-slide").on("click", function() {
            jQuery(this).closest(".resize-carousel-holder").find(gR).trigger("next.owl.carousel");
            return false;
        });
        jQuery(".resize-carousel-holder a.prev-slide").on("click", function() {
            jQuery(this).closest(".resize-carousel-holder").find(gR).trigger("prev.owl.carousel");
            return false;
        });
        var gf = jQuery(".full-screen-gallery"), w2 = jQuery(window);
        var gf_ops = gf.data('options') ? gf.data('options') : {smartSpeed:1300,autoplay:false,items:1,loop:true,center:false,autoWidth:false,thumbs:false,responsive:false};
        if(gf_ops.responsive){
            var respArr = gf_ops.responsive.split(',');
            gf_ops.responsive = {};
            for (var i = 0; i < respArr.length ; i++){
                var tempVal = respArr[i].split(':');
                gf_ops.responsive[tempVal[0]] = { items: tempVal[1] };

            }
        }else{
            gf_ops.responsive = false;
        }
        function initGalleryFullscreen() {
            var a = jQuery(window).height(), b = jQuery(".full-screen-gallery"), c = jQuery(".control-panel").outerHeight(), d = jQuery(".resize-carousel-holder").outerHeight(), e = jQuery(".full-screen-gallery .full-screen-item");
            if(!b.is('.autowidth-yes') && !b.is('.autoheight-yes')){
                b.css({
                    height: d - c
                });
                e.css({
                    height: d
                });
            }
            gf.owlCarousel({
                autoWidth: gf_ops.autoWidth,
                margin: 0,
                items: gf_ops.items,
                smartSpeed: gf_ops.smartSpeed,
                loop: gf_ops.loop,
                autoplay: gf_ops.autoplay,
                center: gf_ops.center,
                nav: false,
                thumbs: gf_ops.thumbs,
                responsive: gf_ops.responsive,
                autoHeight: b.is('.autoheight-yes')
            });
        }
        if (gf.length) {
            gf.imagesLoaded( function() {
                initGalleryFullscreen();
                w2.on("resize.destroyfullscreen", function() {
                    setTimeout(initGalleryFullscreen, 150);
                });
            });
        }
        jQuery(document).on('keydown.carousel-fs', function(e) {
            if(e.keyCode == 37) {
                gf.trigger("prev.owl");
            };
            if(e.keyCode == 39) {
                gf.trigger("next.owl");
            };
        });
        /*gf.on("mousewheel", ".owl-stage", function(a) {
            if (a.deltaY < 0) gf.trigger("next.owl"); else gf.trigger("prev.owl");
            a.preventDefault();
        });*/
        jQuery(".full-screen-gallery-holder a.next-slide").on("click", function() {
            jQuery(this).closest(".full-screen-gallery-holder").find(gf).trigger("next.owl.carousel");
            return false;
        });
        jQuery(".full-screen-gallery-holder a.prev-slide").on("click", function() {
            jQuery(this).closest(".full-screen-gallery-holder").find(gf).trigger("prev.owl.carousel");
            return false;
        });
        jQuery(".single-popup-image").lightGallery({
            selector: "this",
            cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
            download: false,
            counter: false
        });
        // woo lightgallery
        if(jQuery('.woocommerce-product-gallery__wrapper').length){
            jQuery('.woocommerce-product-gallery__wrapper').each(function(){
                var $woolg = jQuery(this);
                $woolg.lightGallery({
                    selector: ".woocommerce-product-gallery__image a",
                    cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
                    download: false,
                    loop: true,
                    thumbnail:false
                });
            });
        }
        var $lg = jQuery(".lightgallery"), dlt = $lg.data("looped");
        $lg.lightGallery({
            selector: ".lightgallery a.popup-image",
            cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
            download: false,
            loop: dlt,
            thumbnail:false
        });
        jQuery(".lightgallery").on("onBeforeNextSlide.lg", function(a) {
            gR.trigger("next.owl.carousel");
            gf.trigger("next.owl.carousel");
            ss.trigger("next.owl.carousel");
        });
        jQuery(".lightgallery").on("onBeforePrevSlide.lg", function(a) {
            gR.trigger("prev.owl.carousel");
            gf.trigger("prev.owl.carousel");
            ss.trigger("prev.owl.carousel");
        });
        function initFolioGal(){
            // console.log('initFolioGal is called');
            if(jQuery(".folio-gallery").length){
                jQuery(".folio-gallery").each(function(){
                    var $folg = jQuery(this), dlt = $folg.data("looped");
                    if( $folg.data('lightGallery') != undefined){
                        $folg.data('lightGallery').destroy(true);
                    }
                    $folg.lightGallery({
                        //selector: ".folio-gallery .folio-popup-gallery",
                        selector: ".folio-gallery .portfolio_item:not([style*='display: none']) .folio-popup-gallery,.folio-gallery .gallery-item:not([style*='display: none']) .folio-popup-gallery",
                        cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
                        download: false,
                        loop: dlt,
                        thumbnail:false,
                        youtubePlayerParams: { modestbranding: 1, showinfo: 0, controls: 1 },
                        vimeoPlayerParams: { byline : 0, portrait : 0, color : 'CCCCCC' },
                        dailymotionPlayerParams: {}
                    });
                });
            }
        }
        initFolioGal();
        var slsl = jQuery(".slideshow-item");
        var slsl_ops = slsl.data('options') ? slsl.data('options') : {autoplaySpeed: 3600,items:1,autoplayTimeout:4000};
        slsl.owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            items: slsl_ops.items,
            dots: false,
            animateOut: "fadeOut",
            animateIn: "fadeIn",
            autoplay: true,
            autoplayTimeout: slsl_ops.autoplayTimeout,
            autoplayHoverPause: false,
            autoplaySpeed: slsl_ops.autoplaySpeed
        });
        var tsh = jQuery(".testimon-slider");
        var tsh_ops = tsh.data('options') ? tsh.data('options') : {smartSpeed:1300,autoplay:false,autoplaySpeed: 3600,items:1,autoplayTimeout:4000,responsive:false,autoHeight:true,loop:true,dots:false,center:false,autoWidth:false};
        if(tsh_ops.responsive){
            var respArr = tsh_ops.responsive.split(',');
            tsh_ops.responsive = {};
            for (var i = 0; i < respArr.length ; i++){
                var tempVal = respArr[i].split(':');
                tsh_ops.responsive[tempVal[0]] = { items: tempVal[1] };

            }
        }else{
            tsh_ops.responsive = false;
        }
        tsh.owlCarousel({
            margin: 0,
            items: tsh_ops.items,
            smartSpeed: tsh_ops.smartSpeed,
            loop: tsh_ops.loop,
            nav: false,
            dots:tsh_ops.dots,
            autoHeight: tsh_ops.autoHeight,
            autoplay: tsh_ops.autoplay,
            autoplayTimeout: tsh_ops.autoplayTimeout,
            autoplaySpeed: tsh_ops.autoplaySpeed,
            responsive:tsh_ops.responsive,
            center:tsh_ops.center,
            autoWidth:tsh_ops.autoWidth,
        });
        jQuery(".testimon-slider-holder a.next-slide").on("click", function() {
            jQuery(this).closest(".testimon-slider-holder").find(tsh).trigger("next.owl.carousel");
        });
        jQuery(".testimon-slider-holder a.prev-slide").on("click", function() {
            jQuery(this).closest(".testimon-slider-holder").find(tsh).trigger("prev.owl.carousel");
        });
        var ts = jQuery(".show-thumbs").data("textshow");
        var th = jQuery(".show-thumbs").data("texthide");
        jQuery(".show-thumbs").text(ts);
        function showThumbs() {
            jQuery(".show-thumbs").removeClass("vis-t");
            jQuery(".owl-thumbs").addClass("vis-thumbs");
            jQuery(".show-thumbs").text(th);
            setTimeout(function() {
                jQuery(".owl-thumb-item").addClass("himask");
            }, 650);
        }
        function hideThumbs() {
            jQuery(".show-thumbs").text(ts);
            jQuery(".show-thumbs").addClass("vis-t");
            jQuery(".owl-thumbs").removeClass("vis-thumbs");
            jQuery(".owl-thumb-item").removeClass("himask");
        }
        jQuery(".show-thumbs").on("click", function() {
            if (jQuery(this).hasClass("vis-t")) showThumbs(); else hideThumbs();
            return false;
        });
        jQuery(document).on("click", ".owl-thumb-item", function() {
            hideThumbs();
            return false;
        });
        // css functionts------------------
        function a() {
            jQuery(".hero-wrap-image-slider .item").css({
                height: jQuery(".hero-wrap-image-slider").outerHeight(true)
            });
            jQuery(".hero-wrap-text-slider .item").css({
                height: jQuery(".hero-wrap-text-slider").outerHeight(true)
            });
            jQuery(".home-slider-loop .item").css({
                height: jQuery(".home-slider-loop").outerHeight(true)
            });
            jQuery(".slideshow-item .item").css({
                height: jQuery(".slideshow-item ").outerHeight(true)
            });
            setTimeout(function(){ 
                jQuery(".height-emulator").css({
                    height: jQuery(".content-footer").outerHeight(true)
                });
            }, 1000);

            jQuery(".team-social").css({
                "margin-top": -1 * jQuery(".team-social").height() / 2 + "px"
            });
            var a = jQuery(window).height(), b = jQuery("header.monolit-header").outerHeight(), c = jQuery(".p_horizontal_wrap");
            var d = jQuery(window).width();
            var e = 0;
            if(jQuery('.portfolio-pagination').length)
                e = jQuery('.portfolio-pagination').outerHeight();
            c.css("height", a - b - 30 - e);
            if(jQuery('.portfolio-pagination').length) 
                jQuery(".resize-carousel-holder").css("height", a - b - e);
            
            //if (d <= 768) c.css("height", a - b - 60 - e);
            var hoz_folio_height = jQuery("#portfolio_horizontal_container").outerHeight();
            if (d <= 768) c.css("height", hoz_folio_height );
            jQuery(" #portfolio_horizontal_container .portfolio_item img  ").css({
                height: jQuery(".portfolio_item").outerHeight(true)
            });
            if (jQuery(window).width() > 1036){
                jQuery('.nav-holder').css('display','block');
            }else{
                jQuery('.nav-holder').css('display','none');
            }
            /* home landing page */
            if(jQuery(".landing-logo-inner").length){
                jQuery(".landing-logo-inner").css({
                    "margin-top": -1 * jQuery(".landing-logo-inner").height() / 2 + "px"
                });
                jQuery(".box-inner").css({
                    "margin-top": -1 * jQuery(".box-inner").height() / 2 + "px"
                });
            }
            
        }
        a();
        jQuery(window).on('resize',function() {
            a();
        });
        if(jQuery('#iframe-demo').length){
            jQuery(".box li a").on("mouseenter", function() {
                var goTo = jQuery(this).attr("href");
                jQuery("#iframe-demo").attr("src",goTo);
            });
        }
        // scroll animation ------------------
        var i = 1;
        jQuery(document.body).on("appear", ".stats", function(a) {
            // console.log('appeared');
            if (1 === i) k(2600);
            i++;
        });
        function number(a, b, c, speed, d) {
            // if (d) {
            //     var e = 0;
            //     var f = parseInt(d / a) // + 3000; // 3000 for 3 seconds
            //     var g = setInterval(function() {
            //         if (e - 1 < a) c.html(e); else {
            //             c.html(b);
            //             clearInterval(g);
            //         }
            //         e = e+1
            //     }, f);
            // } else c.html(b);

            if (speed) {
                var e = 0;
                var numadd = 1;
                if( speed ) numadd =  a/speed 
                var g = setInterval(function() {
                    if (e - numadd < a) c.html(parseInt(e)); else {
                        c.html(b);
                        clearInterval(g);
                    }
                    e = e+numadd
                }, 10);
            } else c.html(b);

        }
        function k(a) {
            jQuery(".stats .num").each(function() {
                var b = jQuery(this);
                var c = b.attr("data-num");
                var d = b.attr("data-content");
                number(c, d, b, 200, a);
            });
        }
        jQuery(".animaper").appear();
        jQuery(document.body).on("appear", ".piechart-holder", function() {
            jQuery(this).find(".chart").each(function() {
                var a = jQuery(".piechart-holder").data("skcolor"),
                    b = jQuery(".piechart-holder").data("pies"),
                    c = jQuery(".piechart-holder").data("pielw");
                jQuery(".chart").easyPieChart({
                    barColor: a,
                    trackColor: "transparent",
                    scaleColor: "transparent",
                    size: b,
                    lineWidth: c,
                    lineCap: "butt",
                    onStep: function(a, b, c) {
                        jQuery(this.el).find(".percent").text(Math.round(c));
                    }
                });
            });
        });
        jQuery(document.body).on("appear", ".skillbar-box", function() {
            jQuery(this).find("div.skillbar-bg").each(function() {
                jQuery(this).find(".custom-skillbar").delay(600).animate({
                    width: jQuery(this).attr("data-percent")
                }, 1500);
            });
        });

        // Background video ------------------
        jQuery(".background-youtube").each(function(){
            var $that   = jQuery(this),
                vid     = $that.data('vid'),
                mt     = $that.data('mv'),
                ql     = $that.data('ql') ? $that.data('ql') : 'highres',
                pos     = $that.data('pos');

            $that.YTPlayer({
                fitToBackground: true,
                videoId: vid,
                pauseOnScroll: pos,
                mute: mt,
                useOnMobile: true,

                // repeat: false,
                //ratio: 16 / 9,// 4/3
                callback: function() {
                    var a = $that.data("ytPlayer").player;
                    a.setPlaybackQuality(ql);//small,medium,large,hd720,hd1080,highres,default
                },
                // https://developers.google.com/youtube/player_parameters
                playerVars: {
                    modestbranding: 0,
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    wmode: 'transparent',
                    branding: 0,
                    rel: 0,
                    autohide: 0,
                    origin: window.location.origin
                }
            });
        });
        jQuery(".background-vimeo").each(function(){
            var $that       = jQuery(this),
                options     = $that.data('opts') ? $that.data('opts') : {video: '143243001',quality: '1080p',mute: '1', loop: '1'};
            var url         = '//player.vimeo.com/video/' + options.video;
            if(options.mute == '1') url +='?autoplay=1&background=1&quality='+options.quality+'&loop='+options.loop;
            else url += '?autoplay=1&quality='+options.quality+'&loop='+options.loop;
            $that.append('<iframe src="' + url + '"  frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="autoplay"></iframe>');

        });
        jQuery(".video-holder").height(jQuery(".media-container").height());
        if (jQuery(window).width() > 1024) {
            if (jQuery(".video-holder").length > 0) {
                if (jQuery(".media-container").height() / 9 * 16 > jQuery(".media-container").width()) {
                    jQuery(".background-vimeo iframe ").height(jQuery(".media-container").height()).width(jQuery(".media-container").height() / 9 * 16);
                    jQuery(".background-vimeo iframe ").css({
                        "margin-left": -1 * jQuery("iframe").width() / 2 + "px",
                        top: "-75px",
                        "margin-top": "0px"
                    });
                } else {

                    jQuery(".background-vimeo iframe ").width(jQuery(window).width()).height(jQuery(window).width() / 16 * 9);
                    jQuery(".background-vimeo iframe ").css({
                        "margin-left": -1 * jQuery("iframe").width() / 2 + "px",
                        "margin-top": -1 * jQuery("iframe").height() / 2 + "px",
                        top: "50%"
                    });
                }
            }
        } else if (jQuery(window).width() < 760) {
            jQuery(".video-holder").height(jQuery(".media-container").height());
            jQuery(".background-vimeo iframe ").height(jQuery(".media-container").height());
        } else {
            jQuery(".video-holder").height(jQuery(".media-container").height());
            jQuery(".background-vimeo iframe ").height(jQuery(".media-container").height());
        }

        jQuery(".cthiso-filters").on("click", "a.cthiso-filter", function(b) {
            b.preventDefault();
            var c = jQuery(this).attr("data-filter"),
                $wrap = jQuery(this).closest('.cthiso-wrapper');
            if(c == '*'){
                $wrap.find('.cthiso-flex').children().fadeIn()
            }else{
                // $wrap.find('.cthiso-flex').children().fadeOut('10', function(){
                //     $wrap.find('.cthiso-flex').children(c).fadeIn()
                // })
                $wrap.find('.cthiso-flex').children().not(c).fadeOut( 'fast' )
                $wrap.find('.cthiso-flex').children(c).fadeIn()
            }
            jQuery(".cthiso-filters a.cthiso-filter").removeClass("gallery-filter_active");
            jQuery(this).addClass("gallery-filter_active");
            return false;
        });


        // Isotope ------------------
        function n() {
            if (jQuery(".gallery-items").length) {
                var a = jQuery(".gallery-items").isotope({
                    itemSelector: ".gallery-item, .gallery-item-second, .gallery-item-three",
                    percentPosition: true,
                    masonry: {
                        // use outer width of grid-sizer for columnWidth
                        columnWidth: ".grid-sizer, .grid-sizer-second, .grid-sizer-three",
                        //isFitWidth: true
                    },
                    transformsEnabled: true,
                    transitionDuration: "700ms",
                });
                a.imagesLoaded(function() {
                    a.isotope("layout");
                });
                jQuery(".gallery-filters").on("click", "a.gallery-filter", function(b) {
                    b.preventDefault();
                    var c = jQuery(this).attr("data-filter");
                    a.isotope({
                        filter: c
                    });
                    jQuery(".gallery-filters a.gallery-filter").removeClass("gallery-filter-active");
                    jQuery(this).addClass("gallery-filter-active");
                    return false;
                });
                // if(jQuery('main .products > .product').length){
                //     jQuery(".gallery-filters").on("click", "a.gallery-filter", function(b) {
                //         b.preventDefault();
                //         var c = jQuery(this).attr("data-filter");

                //         var $products = jQuery('.products > .product');
                //         if(c == '*'){
                //             $products.fadeIn();
                //         }else{
                //             $products.fadeOut();

                //             jQuery('.products > .product'+c).fadeIn();
                //         }

                //         jQuery(".gallery-filters a.gallery-filter").removeClass("gallery-filter-active");
                //         jQuery(this).addClass("gallery-filter-active");
                //         return false;
                //     });
                // }
                    

                a.isotope("on", "layoutComplete", function(a, b) {
                    jQuery.each(a, function(index,value){
                        var $this = jQuery(value.element);
                        if($this.is('.is_folio_video')){
                            var a = $this.outerHeight();
                        }
                    });
                    var b = a.length;
                    jQuery(".num-album").html(b);
                });
                a.on( 'arrangeComplete', function( event, filteredItems ) {
                    initFolioGal();
                } );
            }
            var b = {
                touchbehavior: true,
                emulatetouch: true, // enable cursor-drag scrolling like touch devices in desktop computer
                cursoropacitymax: 1,
                cursorborderradius: "0",
                background: "transparent",
                cursorwidth: "4px",
                cursorborder: "0px",
                cursorcolor: "transparent",
                autohidemode: true,
                bouncescroll: false,
                scrollspeed: 120,
                mousescrollstep: 90,
                grabcursorenabled: true,
                horizrailenabled: false,
                preservenativescrolling: true,
                cursordragontouch: true
            };
            jQuery(".hid-sidebar").niceScroll(b);
            var c = {
                touchbehavior: true,
                emulatetouch: true, // enable cursor-drag scrolling like touch devices in desktop computer
                cursoropacitymax: 1,
                cursorborderradius: "0",
                background: "transparent",
                cursorwidth: "10px",
                cursorborder: "0px",
                cursorcolor: "#191919",
                autohidemode: false,
                bouncescroll: false,
                scrollspeed: 120,
                mousescrollstep: 90,
                grabcursorenabled: true,
                horizrailenabled: true,
                preservenativescrolling: true,
                cursordragontouch: true,
                railpadding: {
                    top: -10,
                    right: 0,
                    left: 0,
                    bottom: 0
                },
                zindex: 22,
                //enablemousewheel: false,
            };
            if(jQuery(".p_horizontal_wrap").is('.hoz_has_headfoot_wrap')) c.enablemousewheel = false;
            //jQuery(".p_horizontal_wrap:not('.hoz_has_headfoot_wrap')").niceScroll(c);
            var d = jQuery("#portfolio_horizontal_container");
            d.imagesLoaded(function(a, b, e) {
                var f = {
                    itemSelector: ".portfolio_item",
                    layoutMode: "packery",
                    packery: {
                        isHorizontal: true,
                        gutter: 0
                    },
                    resizable: true,
                    transformsEnabled: true,
                    transitionDuration: "700ms"
                };
                var g = {
                    itemSelector: ".portfolio_item",
                    layoutMode: "packery",
                    packery: {
                        isHorizontal: false,
                        gutter: 0
                    },
                    resizable: true,
                    transformsEnabled: true,
                    transitionDuration: "700ms"
                };
                if (jQuery(window).width() <= 768) {
                    if(d.is('.hoz_has_headfoot'))
                        d.isotope({
                            itemSelector: ".portfolio_item",
                            percentPosition: true,
                            masonry: {
                                // use outer width of grid-sizer for columnWidth
                                //columnWidth: ".portfolio_item",
                                //isFitWidth: true
                            },
                            transformsEnabled: true,
                            transitionDuration: "700ms",
                        });
                    else
                        d.isotope(g);
                        d.isotope("layout");
                        if (jQuery(".p_horizontal_wrap").getNiceScroll()) jQuery(".p_horizontal_wrap").getNiceScroll().remove();
                } else {
                    d.isotope(f);
                    d.isotope("layout");
                    jQuery(".p_horizontal_wrap").niceScroll(c);
                }
                jQuery(".gallery-filters").on("click", "a", function(a) {
                    a.preventDefault();
                    var b = jQuery(this).attr("data-filter");
                    d.isotope({
                        filter: b
                    });
                    jQuery(".gallery-filters a").removeClass("gallery-filter_active");
                    jQuery(this).addClass("gallery-filter_active");
                });
                d.isotope("on", "layoutComplete", function(a, b) {
                    jQuery.each(a, function(index,value){
                        var $this = jQuery(value.element);
                        if($this.is('.is_folio_video')){
                            var a = $this.outerHeight();
                            $this.find(".resp-video-holder").css("height", a).find("iframe").css("height", a);
                            $this.find(".resp-video-holder").css("width", a*1.61).find("iframe").css("width", a*1.61);//1.61 golden ratio
                        }
                    });
                    var hoz_folio_height = jQuery("#portfolio_horizontal_container").outerHeight();
                    if (jQuery(window).width() <= 768) {
                        jQuery('.p_horizontal_wrap').css("height", hoz_folio_height );
                        jQuery('.resize-carousel-holder').css("height", hoz_folio_height );
                        jQuery('.portfolio-horizontal').css("height", hoz_folio_height + jQuery('.portfolio-pagination').outerHeight() + 60 );
                    }
                    var b = a.length;
                    jQuery(".num-album").html(b);
                });
                d.on( 'arrangeComplete', function( event, filteredItems ) {
                    initFolioGal();
                } );
            });
        }
        jQuery(".grid-item a").on("click", function() {
            var a = jQuery(this).attr("href");
            window.location.href = a;
            return false;
        });
        var j = jQuery(".portfolio_item , .gallery-item").length;
        jQuery(".all-album , .num-album").html(j);
        n();
        // jQuery(window).on('load',function () {
        //     n();
        // });

        jQuery(".filter-button").addClass("act-filter");
        jQuery(".filter-button").on("click", function() {
            if (jQuery(this).hasClass("act-filter")){
                showfilter();
            }
            else {
                hidefilter();
            }
            return false;
        });
        function showfilter() {
            jQuery(".filter-button").removeClass("act-filter");
            jQuery(".hid-filter").slideDown(500);
            jQuery(".resize-carousel-holder").addClass("visfilb");
        }
        function hidefilter() {
            jQuery(".filter-button").addClass("act-filter");
            jQuery(".hid-filter").slideUp(500);
            jQuery(".resize-carousel-holder").removeClass("visfilb");
        }
        // Team hover  ------------------
        jQuery(".team-box").hover(function() {
            jQuery(this).find("ul.team-social").fadeIn();
            jQuery(this).find(".team-social a").each(function(a) {
                var b = jQuery(this);
                setTimeout(function() {
                    b.animate({
                        opacity: 1,
                        top: "0"
                    }, 400);
                }, 150 * a);
            });
        }, function() {
            jQuery(this).find(".team-social a").each(function(a) {
                var b = jQuery(this);
                setTimeout(function() {
                    b.animate({
                        opacity: 0,
                        top: "50px"
                    }, 400);
                }, 150 * a);
            });
            setTimeout(function() {
                jQuery(this).find("ul.team-social").fadeOut();
            }, 150);
        });
        // Scroll window ------------------
        jQuery(".to-top").on('click',function() {
            jQuery("html, body").animate({
                scrollTop: 0
            }, 1500);
            return false;
        });
        jQuery(document).on("click", ".serv-item:not(.external)", function(a) {
            var b = jQuery(this);
            a.preventDefault();
            jQuery(".serv-item").removeClass("act-ser");
            b.addClass("act-ser");
            jQuery("html, body").animate({
                scrollTop: b.closest('.services-main-holder').find(".serv-post").offset().top - 120 //jQuery(".serv-post").offset().top - 120
            }, {
                queue: false,
                duration: 1200,
                easing: "easeInOutExpo"
            });
            jQuery(".serv-details").stop(true, true).css("display", "none");
            jQuery(b.attr("href")).stop(true, true).fadeIn(500);
        });
        jQuery(".to-top").hover(function() {
            if(_monolit.shuffle_off != '1')
                jQuery(this).shuffleLetters({});
            jQuery(".footer-wrap").addClass("tth");
        }, function() {
            jQuery(".footer-wrap").removeClass("tth");
        });
        jQuery(".scroll-nav  ul").singlePageNav({
            filter: ":not(.external)",
            updateHash: false,
            offset: 70,
            threshold: 120,
            speed: 1200,
            currentClass: "act-link",
            beforeStart : function(){
                if(jQuery(window).width() < 1037 ) hideMenu();
            },
            onComplete: function() {
                if (jQuery(".scroll-nav  a").hasClass("act-link")) jQuery(".scroll-nav  a.act-link").each(function() {
                    // var a = jQuery(this).data("bgtex");
                    var a = jQuery(this).attr("title") != undefined ? jQuery(this).attr("title") : jQuery(this).text();
                    if(_monolit.shuffle_off != '1')
                        jQuery(".footer-title h2").html(a);
                    else
                        jQuery(".footer-title h2").html(a).shuffleLetters({});
                });
            }
        });
        jQuery(".scroll-page-nav  ul").singlePageNav({
            filter: ":not(.external)",
            updateHash: false,
            offset: 70,
            threshold: 120,
            speed: 1200,
            currentClass: "act-link"
        });
        jQuery(".custom-scroll-link,.menu-scroll-link").on("click", function() {
            var a = 80;
            if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") || location.hostname == this.hostname) {
                var b = jQuery(this.hash);
                b = b.length ? b : jQuery("[name=" + this.hash.slice(1) + "]");
                if (b.length) {
                    jQuery("html,body").animate({
                        scrollTop: b.offset().top - a
                    }, {
                        queue: false,
                        duration: 1600,
                        easing: "easeInOutExpo"
                    });
                    return false;
                }
            }
        });
        if(jQuery('.particular').length){
            jQuery(window).on('scroll',function() {
                if (jQuery(window).scrollTop() + jQuery(window).height() > jQuery(document).height() - 50) jQuery(".particular.footer-canvas").fadeIn(1); else jQuery(".particular.footer-canvas").fadeOut(1);
            });
            var cscl = jQuery('.particular').data('color') ? jQuery('.particular').data('color') : "rgba(255, 255, 255, .5)";
            jQuery(".particular").constellation({
                star: {
                    width: 1
                },
                line: {
                    color: cscl
                },
                radius: 350
            });
        }
        
        // Other functions  ------------------
        jQuery.fn.duplicate = function(a, b) {
            var c = [];
            for (var d = 0; d < a; d++) jQuery.merge(c, this.clone(b).get());
            return this.pushStack(c);
        };
        jQuery("<div class='scale-callback'></div>").duplicate(12).appendTo(".sb-bg");
        jQuery(".show-hid-sidebar").on("click", function(a) {
            a.preventDefault();
            jQuery(".hid-sidebar").addClass("vissb");
            setTimeout(function() {
                jQuery(".scale-callback").addClass("scale-bg5");
            }, 450);
            setTimeout(function() {
                jQuery(".sb-inner").addClass("sb-innervis");
                /* For gallery masonry on portfolio details */
                if (jQuery(".gallery-items").length) {
                    var a = jQuery(".gallery-items").isotope({
                        itemSelector: ".gallery-item, .gallery-item-second, .gallery-item-three",
                        percentPosition: true,
                        masonry: {
                            columnWidth: ".grid-sizer, .grid-sizer-second, .grid-sizer-three",
                        },
                        transformsEnabled: true,
                        transitionDuration: "700ms",
                    });
                    a.imagesLoaded(function() {
                        a.isotope("layout");
                    });
                }
            }, 800);
            jQuery(".sb-overlay").addClass("vis-overlay");
            return false;
        });
        jQuery(".close-sidebar , .sb-overlay").on("click", function() {
            jQuery(".hid-sidebar").removeClass("vissb");
            jQuery(".sb-inner").removeClass("sb-innervis");
            jQuery(".scale-callback").removeClass("scale-bg5");
            jQuery(".sb-overlay").removeClass("vis-overlay");
            return false;
        });
        var bgImage = jQuery(".bg");
        bgImage.each(function(a) {
            if (jQuery(this).attr("data-bg")) jQuery(this).css("background-image", "url(" + jQuery(this).data("bg") + ")");
        });
        if (jQuery(".hor-nav-layout").hasClass("hor-content")) {
            jQuery("header.monolit-header").addClass("fw-head");
            jQuery(".share-inner").addClass("hor-inner");
            jQuery(".content-holder").children('.content:first').css('padding-top','80px');
            jQuery(window).trigger('resize.destroyfullscreen');
        }
        // Share   ------------------
        var shs = eval(jQuery(".share-container").attr("data-share"));
        if(shs){
            jQuery(".share-container").share({
                networks: shs
            });
        }
        var blshs = eval(jQuery(".blog-share-container").attr("data-share"));
        if(blshs){
            jQuery(".blog-share-container").share({
                networks: blshs
            });
        }
        function hideShare() {
            jQuery(".share-inner").removeClass("visshare");
            jQuery(".show-share").addClass("isShare");
            jQuery(".share-container ").removeClass("vissc");
            jQuery("header.monolit-header").removeClass("vis-header-b");
        }
        function showShare() {
            jQuery(".share-inner").addClass("visshare");
            jQuery(".show-share").removeClass("isShare");
            setTimeout(function() {
                jQuery("header.monolit-header").addClass("vis-header-b");
                jQuery(".share-container ").addClass("vissc");
            }, 400);
        }
        jQuery(".show-share").on("click", function(a) {
            a.preventDefault();
            if (jQuery(".show-share").hasClass("isShare")) showShare(); else hideShare();
        });
        // Mobile bavigation   ------------------
        var nb = jQuery(".nav-button"), nh = jQuery(".nav-holder");
        function showMenu() {
            nb.removeClass("vis-m");
            nh.slideDown(500);
        }
        function hideMenu() {
            nb.addClass("vis-m");
            nh.slideUp(500);
        }
        nb.on("click", function() {
            if (jQuery(this).hasClass("vis-m")) showMenu(); else hideMenu();
        });
        var mobileHover = function () {
            jQuery('.portfolio_item,.grid-item-holder , nav li').on('touchstart', function () {
                jQuery(this).trigger('hover');
            }).on('touchend', function () {
                jQuery(this).trigger('hover');
            });
        };

        mobileHover();

        //initPopups();
    }
    function contanimshow() {
        var a = window.location.href;
        var b = jQuery(".dynamic-title").text();
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        jQuery(".footer-title a").attr("href", a);
        if(msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
            jQuery(".footer-title a").html(b);
        }else{
            jQuery(".footer-title a").html(b);
            if(_monolit.shuffle_off != '1')
            jQuery(".footer-title a").shuffleLetters({});
        }
        return false;
    }

    // remove parallax and video on mobile   ------------------
    function initparallax() {
        var a = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return a.Android() || a.BlackBerry() || a.iOS() || a.Opera() || a.Windows();
            }
        };
        var trueMobile = a.any();
        if (null == trueMobile && _monolit.parallax_off != '1') {
            var b = jQuery("#main-theme");

            if(b.find("[data-top-bottom]").length > 0){
                b.imagesLoaded( function() {
                    var s = skrollr.init();
                    s.destroy();
                    jQuery(window).on('resize',function() {
                        var a = jQuery(window).width();
                        if (a < 1036) s.destroy(); else skrollr.init({
                            forceHeight: !1,
                            easing: "easeInOutElastic",
                            mobileCheck: function() {
                                return !1;
                            }
                        });
                    });
                    skrollr.init({
                        forceHeight: !1,
                        easing: "easeInOutElastic",
                        mobileCheck: function() {
                            return !1;
                        }
                    });

                });
            }
            var c = jQuery(window).width();
            if (c < 1036) {
                var s = skrollr.init();
                s.destroy();
            }
        }
        if (trueMobile) jQuery(".background-youtube , .background-vimeo").remove();
    }
    jQuery(document).ready(function($) {
        initMonolit();
        initparallax();

        if(jQuery("#monolit-loader").length){
            jQuery(".loader").fadeOut(500, function() {
                jQuery("#main-theme").animate({
                    opacity: "1"
                },function(){contanimshow();});
            });
        }else{
            contanimshow();
        }

        if (_monolit.enable_image_click == '1') {
            $(".gallery-item:not(.has-popup) .port-desc-holder").on("click", function(e) {
                e.preventDefault();
                var a = $(this).find('h3 a').attr("href");
                window.location.href = a;
                
            });

            $(".portfolio_item:not(.has-popup) .port-desc-holder").on("click", function(e) {
                e.preventDefault();
                var a = $(this).find('h3 a').attr("href");
                window.location.href = a;
                
            });

        }


        // menu-item wpml-ls-slot-38 wpml-ls-item wpml-ls-item-sr wpml-ls-menu-item wpml-ls-first-item menu-item-type-wpml_ls_menu_item menu-item-object-wpml_ls_menu_item menu-item-wpml-ls-38-sr
        $(document).on("click",'li.menu-item-language a, li.wpml-ls-item a', function(e) {
            e.preventDefault();
            var a = $(this).attr("href");
            window.location.href = a;
            
        });

        if(jQuery('main .products > .product').length){
            jQuery(".gallery-filters").on("click", "a.gallery-filter", function(b) {
                b.preventDefault();
                var c = jQuery(this).attr("data-filter");

                var $products = jQuery('.products > .product');
                if(c == '*'){
                    $products.fadeIn();
                }else{
                    $products.fadeOut();

                    jQuery('.products > .product'+c).fadeIn();
                }

                jQuery(".gallery-filters a.gallery-filter").removeClass("gallery-filter-active");
                jQuery(this).addClass("gallery-filter-active");
                return false;
            });
        }
        
        
        

    });


    // jQuery(window).on('load',function() {
    //     "use strict";
    //     if(jQuery("#monolit-loader").length){
    //         jQuery(".loader").fadeOut(500, function() {
    //             jQuery("#main-theme").animate({
    //                 opacity: "1"
    //             },function(){contanimshow();});
    //         });
    //     }else{
    //         contanimshow();
    //     }
    // });


})(jQuery);

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});



