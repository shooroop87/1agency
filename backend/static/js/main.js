/* <![CDATA[ */
var theplus_ajax_url = "https://andreyegorov.com/luxreal/wp-admin/admin-ajax.php";
		var theplus_ajax_post_url = "https://andreyegorov.com/luxreal/wp-admin/admin-post.php";
		var theplus_nonce = "a0a34c4a16";
/* ]]> */

;
/* <![CDATA[ */
window._wpemojiSettings = {"baseUrl":"https:\/\/s.w.org\/images\/core\/emoji\/16.0.1\/72x72\/","ext":".png","svgUrl":"https:\/\/s.w.org\/images\/core\/emoji\/16.0.1\/svg\/","svgExt":".svg","source":{"concatemoji":"https:\/\/andreyegorov.com\/luxreal\/wp-includes\/js\/wp-emoji-release.min.js?ver=6.8.3"}};
/*! This file is auto-generated */
!function(s,n){var o,i,e;function c(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function p(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data),a=(e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0),new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data));return t.every(function(e,t){return e===a[t]})}function u(e,t){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);for(var n=e.getImageData(16,16,1,1),a=0;a<n.data.length;a++)if(0!==n.data[a])return!1;return!0}function f(e,t,n,a){switch(t){case"flag":return n(e,"\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f","\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f")?!1:!n(e,"\ud83c\udde8\ud83c\uddf6","\ud83c\udde8\u200b\ud83c\uddf6")&&!n(e,"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f","\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");case"emoji":return!a(e,"\ud83e\udedf")}return!1}function g(e,t,n,a){var r="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):s.createElement("canvas"),o=r.getContext("2d",{willReadFrequently:!0}),i=(o.textBaseline="top",o.font="600 32px Arial",{});return e.forEach(function(e){i[e]=t(o,e,n,a)}),i}function t(e){var t=s.createElement("script");t.src=e,t.defer=!0,s.head.appendChild(t)}"undefined"!=typeof Promise&&(o="wpEmojiSettingsSupports",i=["flag","emoji"],n.supports={everything:!0,everythingExceptFlag:!0},e=new Promise(function(e){s.addEventListener("DOMContentLoaded",e,{once:!0})}),new Promise(function(t){var n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if("object"==typeof e&&"number"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&"object"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if("undefined"!=typeof Worker&&"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof URL&&URL.createObjectURL&&"undefined"!=typeof Blob)try{var e="postMessage("+g.toString()+"("+[JSON.stringify(i),f.toString(),p.toString(),u.toString()].join(",")+"));",a=new Blob([e],{type:"text/javascript"}),r=new Worker(URL.createObjectURL(a),{name:"wpTestEmojiSupports"});return void(r.onmessage=function(e){c(n=e.data),r.terminate(),t(n)})}catch(e){}c(n=g(i,f,p,u))}t(n)}).then(function(e){for(var t in e)n.supports[t]=e[t],n.supports.everything=n.supports.everything&&n.supports[t],"flag"!==t&&(n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&n.supports[t]);n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&!n.supports.flag,n.DOMReady=!1,n.readyCallback=function(){n.DOMReady=!0}}).then(function(){return e}).then(function(){var e;n.supports.everything||(n.readyCallback(),(e=n.source||{}).concatemoji?t(e.concatemoji):e.wpemoji&&e.twemoji&&(t(e.twemoji),t(e.wpemoji)))}))}((window,document),window._wpemojiSettings);
/* ]]> */

;
if (!window._originalPrompt) {
  window._originalPrompt = window.prompt;
  window._originalConfirm = window.confirm;
  window._originalAlert = window.alert;
}

function manipulateDialog(methodName, oldDialog) {
  // override the default dialog and add our logic
  window[methodName] = function (message = '', defaultValue = '') {
    console.log('sending a message');

    var answer = oldDialog(message, defaultValue);
    if (methodName === 'confirm') answer = answer.toString();

    // if the user didn't cancel it
    if (answer || /(alert|confirm)/.test(methodName)) {
      window.postMessage(
        {
          type: 'extension:injected-script',
          payload: {
            type: methodName,
            value: answer,
          },
        },
        '*'
      );
    }
    return answer;
  };
}

manipulateDialog('prompt', window._originalPrompt);
manipulateDialog('confirm', window._originalConfirm);
manipulateDialog('alert', window._originalAlert);

;
{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"\/luxreal\/*"},{"not":{"href_matches":["\/luxreal\/wp-*.php","\/luxreal\/wp-admin\/*","\/luxreal\/wp-content\/uploads\/*","\/luxreal\/wp-content\/*","\/luxreal\/wp-content\/plugins\/*","\/luxreal\/wp-content\/themes\/lumoria\/*","\/luxreal\/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}

;
const registerAllyAction = () => {
					if ( ! window?.elementorAppConfig?.hasPro || ! window?.elementorFrontend?.utils?.urlActions ) {
						return;
					}

					elementorFrontend.utils.urlActions.addAction( 'allyWidget:open', () => {
						if ( window?.ea11yWidget?.widget?.open ) {
							window.ea11yWidget.widget.open();
						}
					} );
				};

				const waitingLimit = 30;
				let retryCounter = 0;

				const waitForElementorPro = () => {
					return new Promise( ( resolve ) => {
						const intervalId = setInterval( () => {
							if ( retryCounter === waitingLimit ) {
								resolve( null );
							}

							retryCounter++;

							if ( window.elementorFrontend && window?.elementorFrontend?.utils?.urlActions ) {
								clearInterval( intervalId );
								resolve( window.elementorFrontend );
							}
								}, 100 ); // Check every 100 milliseconds for availability of elementorFrontend
					});
				};

				waitForElementorPro().then( () => { registerAllyAction(); });

;
const lazyloadRunObserver = () => {
					const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
					const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
						entries.forEach( ( entry ) => {
							if ( entry.isIntersecting ) {
								let lazyloadBackground = entry.target;
								if( lazyloadBackground ) {
									lazyloadBackground.classList.add( 'e-lazyloaded' );
								}
								lazyloadBackgroundObserver.unobserve( entry.target );
							}
						});
					}, { rootMargin: '200px 0px 200px 0px' } );
					lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
						lazyloadBackgroundObserver.observe( lazyloadBackground );
					} );
				};
				const events = [
					'DOMContentLoaded',
					'elementor/lazyload/observe',
				];
				events.forEach( ( event ) => {
					document.addEventListener( event, lazyloadRunObserver );
				} );

;
/* <![CDATA[ */
wp.i18n.setLocaleData( { 'text direction\u0004ltr': [ 'ltr' ] } );
/* ]]> */

;
/* <![CDATA[ */
var wpcf7 = {
    "api": {
        "root": "https:\/\/andreyegorov.com\/luxreal\/wp-json\/",
        "namespace": "contact-form-7\/v1"
    }
};
/* ]]> */

;
/* <![CDATA[ */
var svgSettings = {"skipNested":"1"};
/* ]]> */

;
/* <![CDATA[ */
cssTarget={"Bodhi":"img.style-svg","ForceInlineSVG":"style-svg"};ForceInlineSVGActive="false";frontSanitizationEnabled="on";
/* ]]> */

;
/* <![CDATA[ */
var wdtElementorAddonGlobals = {"ajaxUrl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php"};
/* ]]> */

;
/* <![CDATA[ */
var ajax_object = {"ajax_url":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","ajax_nonce":"8a1f3b1852"};
/* ]]> */

;
/* <![CDATA[ */
var wdtcommonobject = {"ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","noResult":"No Results Found!"};
var wdtcommonobject = {"ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","noResult":"No Results Found!"};
/* ]]> */

;
/* <![CDATA[ */
var wdtfrontendobject = {"pluginFolderPath":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/plugins\/","pluginPath":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/plugins\/wedesigntech-portfolio\/","ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","purchased":"<p>Purchased<\/p>","somethingWentWrong":"<p>Something Went Wrong<\/p>","outputDivAlert":"Please make sure you have added output shortcode.","printerTitle":"Portfolio Printer","pleaseLogin":"Please login","noMorePosts":"No more posts to load!","elementorPreviewMode":""};
var wdtfrontendobject = {"pluginFolderPath":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/plugins\/","pluginPath":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/plugins\/wedesigntech-portfolio\/","ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","purchased":"<p>Purchased<\/p>","somethingWentWrong":"<p>Something Went Wrong<\/p>","outputDivAlert":"Please make sure you have added output shortcode.","printerTitle":"Portfolio Printer","pleaseLogin":"Please login","noMorePosts":"No more posts to load!","elementorPreviewMode":""};
/* ]]> */

;
/* <![CDATA[ */
var elementorFrontendConfig = {"environmentMode":{"edit":false,"wpPreview":false,"isScriptDebug":false},"i18n":{"shareOnFacebook":"Share on Facebook","shareOnTwitter":"Share on Twitter","pinIt":"Pin it","download":"Download","downloadImage":"Download image","fullscreen":"Fullscreen","zoom":"Zoom","share":"Share","playVideo":"Play Video","previous":"Previous","next":"Next","close":"Close","a11yCarouselPrevSlideMessage":"Previous slide","a11yCarouselNextSlideMessage":"Next slide","a11yCarouselFirstSlideMessage":"This is the first slide","a11yCarouselLastSlideMessage":"This is the last slide","a11yCarouselPaginationBulletMessage":"Go to slide"},"is_rtl":false,"breakpoints":{"xs":0,"sm":480,"md":480,"lg":1025,"xl":1440,"xxl":1600},"responsive":{"breakpoints":{"mobile":{"label":"Mobile Portrait","value":479,"default_value":767,"direction":"max","is_enabled":true},"mobile_extra":{"label":"Mobile Landscape","value":767,"default_value":880,"direction":"max","is_enabled":true},"tablet":{"label":"Tablet Portrait","value":1024,"default_value":1024,"direction":"max","is_enabled":true},"tablet_extra":{"label":"Tablet Landscape","value":1280,"default_value":1200,"direction":"max","is_enabled":true},"laptop":{"label":"Laptop","value":1540,"default_value":1366,"direction":"max","is_enabled":true},"widescreen":{"label":"Widescreen","value":2400,"default_value":2400,"direction":"min","is_enabled":false}},"hasCustomBreakpoints":true},"version":"3.32.5","is_static":false,"experimentalFeatures":{"e_font_icon_svg":true,"additional_custom_breakpoints":true,"container":true,"e_optimized_markup":true,"e_pro_free_trial_popup":true,"nested-elements":true,"home_screen":true,"global_classes_should_enforce_capabilities":true,"e_variables":true,"cloud-library":true,"e_opt_in_v4_page":true,"import-export-customization":true},"urls":{"assets":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/plugins\/elementor\/assets\/","ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php","uploadUrl":"https:\/\/andreyegorov.com\/luxreal\/wp-content\/uploads"},"nonces":{"floatingButtonsClickTracking":"5247e9850d"},"swiperClass":"swiper","settings":{"page":[],"editorPreferences":[]},"kit":{"active_breakpoints":["viewport_mobile","viewport_mobile_extra","viewport_tablet","viewport_tablet_extra","viewport_laptop"],"viewport_mobile":"479","viewport_mobile_extra":"767","viewport_tablet":"1024","viewport_tablet_extra":"1280","viewport_laptop":"1540","body_background_background":"classic","global_image_lightbox":"yes","lightbox_enable_counter":"yes","lightbox_enable_fullscreen":"yes","lightbox_enable_zoom":"yes","lightbox_enable_share":"yes","lightbox_title_src":"title","lightbox_description_src":"description"},"post":{"id":541,"title":"My%20Blog%20%E2%80%93%20My%20WordPress%20Blog","excerpt":"","featuredImage":false}};
/* ]]> */

;
/* <![CDATA[ */
var lumoria_urls = {"ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php"};
/* ]]> */

;
/* <![CDATA[ */
var lumoria_urls = {"ajaxurl":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php"};
/* ]]> */

;
/* <![CDATA[ */
var lumoria_pro_ajax_object = {"ajax_url":"https:\/\/andreyegorov.com\/luxreal\/wp-admin\/admin-ajax.php"};
/* ]]> */

;
&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js&quot;&gt;&lt;/script&gt;\n&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js&quot;&gt;&lt;/script&gt;\n\n&lt;script&gt;\n(function () {\n  \'use strict\';\n\n  // Ждём полной загрузки (важно для lazy-load картинок)\n  if (document.readyState === \'complete\') initHeroEffect();\n  else window.addEventListener(\'load\', initHeroEffect, { once: true });\n\n  function initHeroEffect() {\n    if (typeof gsap === \'undefined\') return console.error(\'GSAP не загружен\');\n\n    gsap.registerPlugin(ScrollTrigger);\n\n    const heroSection = document.querySelector(\'#hero-section\');\n    if (!heroSection) return console.error(\'ОШИБКА: #hero-section не найден\');\n\n    // Не даём инициализироваться повторно (WP, ajax nav, модалки и т.п.)\n    if (heroSection.dataset.heroInit === \'1\') return;\n    heroSection.dataset.heroInit = \'1\';\n\n    // Собираем колонки и их обёртки\n    const columns = gsap.utils.toArray(\'.hero-column\');\n    if (!columns.length) return console.error(\'ОШИБКА: .hero-column не найдены\');\n\n    // Берём не img, а .hero-image-wrap — меньше конфликтов с lazy/picture\n    const columnPairs = columns.map((col, i) =&gt; {\n      const top = col.querySelector(\'.hero-image-top\');\n      const bottom = col.querySelector(\'.hero-image-bottom\');\n      const topEl = top &amp;&amp; (top.querySelector(\'img\') || top);\n      const botEl = bottom &amp;&amp; (bottom.querySelector(\'img\') || bottom);\n      return { topEl, botEl, i };\n    }).filter(p =&gt; p.topEl &amp;&amp; p.botEl);\n\n    if (columnPairs.length &lt; 2) {\n      console.warn(\'Найдено &lt; 2 валидных колонок — анимируем что есть\');\n    }\n\n    // Убираем CSS-hover scale с img, чтобы не бодаться с GSAP (либо отключи правило в CSS)\n    gsap.set(columnPairs.flatMap(p =&gt; [p.topEl, p.botEl]), {\n      willChange: \'transform\',\n      transformOrigin: \'50% 50%\',\n      // overwrite защитит от конфликтов с CSS-трансформациями\n      overwrite: \'auto\',\n      force3D: true\n    });\n\n    // Респонсив: пин на десктопе, без пина на мобилках\n    ScrollTrigger.matchMedia({\n      // ≥ 768px\n      &quot;(min-width: 768px)&quot;: function () {\n        buildTimeline({ pin: true, end: \'+=150%\' });\n      },\n      // &lt; 768px\n      &quot;(max-width: 767px)&quot;: function () {\n        buildTimeline({ pin: false, end: \'+=90%\' });\n      }\n    });\n\n    function buildTimeline(opts) {\n      // Если уже есть предыдущий TL (после смены брейкпоинта), убьём его\n      if (heroSection._heroTl) {\n        heroSection._heroTl.kill();\n        heroSection._heroTl = null;\n      }\n\n      const tl = gsap.timeline({\n        scrollTrigger: {\n          trigger: heroSection,\n          start: \'top top\',\n          end: opts.end,\n          scrub: 1.2,\n          pin: !!opts.pin,\n          pinSpacing: true,\n          anticipatePin: 1,\n          markers: false\n        },\n        defaults: { ease: \'none\' }\n      });\n\n      // Параллакс для каждой колонки\n      columnPairs.forEach(({ topEl, botEl, i }) =&gt; {\n        const dir = i % 2 === 0 ? 1 : -1; // чередуем направление\n        tl.to(topEl,   { yPercent:  dir * 12 }, 0); // проценты устойчивее к resize\n        tl.to(botEl,   { yPercent: -dir * 12 }, 0);\n        tl.to([topEl, botEl], { scale: 1.08 }, 0);\n      });\n\n      heroSection._heroTl = tl;\n      // На всякий случай обновим расчёты после короткой задержки (lazy-load/фоны)\n      setTimeout(() =&gt; ScrollTrigger.refresh(), 50);\n    }\n\n    // --- Кастомный курсор (desktop only) ---\n    const isTouch = matchMedia(\'(pointer: coarse)\').matches;\n    if (!isTouch) {\n      const cursor = document.createElement(\'div\');\n      cursor.className = \'custom-cursor\';\n      cursor.innerHTML = \'&lt;div class=&quot;cursor-inner&quot;&gt;View project&lt;/div&gt;\';\n      document.body.appendChild(cursor);\n\n      // Центруем по точке\n      cursor.style.position = \'fixed\';\n      cursor.style.left = \'0\';\n      cursor.style.top = \'0\';\n      cursor.style.transform = \'translate(-50%,-50%)\';\n      cursor.style.pointerEvents = \'none\';\n      cursor.style.zIndex = \'9999\';\n\n      let mouseX = 0, mouseY = 0, cx = 0, cy = 0;\n\n      const mm = (e) =&gt; { mouseX = e.clientX; mouseY = e.clientY; };\n      document.addEventListener(\'mousemove\', mm, { passive: true });\n\n      function loop() {\n        cx += (mouseX - cx) * 0.15;\n        cy += (mouseY - cy) * 0.15;\n        cursor.style.transform = `translate(${cx}px, ${cy}px)`;\n        requestAnimationFrame(loop);\n      }\n      requestAnimationFrame(loop);\n\n      const wrappers = document.querySelectorAll(\'.hero-image-wrap\');\n      wrappers.forEach(w =&gt; {\n        w.style.cursor = \'none\';\n        w.addEventListener(\'mouseenter\', () =&gt; cursor.classList.add(\'active\'));\n        w.addEventListener(\'mouseleave\', () =&gt; cursor.classList.remove(\'active\'));\n      });\n\n      // Прячем при уходе курсора за окно\n      document.addEventListener(\'mouseleave\', () =&gt; cursor.classList.remove(\'active\'));\n      document.addEventListener(\'mouseenter\', () =&gt; cursor.classList.add(\'active\'));\n    }\n\n    // Учитываем prefers-reduced-motion\n    if (window.matchMedia(\'(prefers-reduced-motion: reduce)\').matches) {\n      gsap.globalTimeline.timeScale(0.7);\n    }\n\n    // На всякий случай ещё один refresh через тик (после любых динамических вставок)\n    requestAnimationFrame(() =&gt; ScrollTrigger.refresh());\n  }\n})();\n&lt;/script&gt;\n