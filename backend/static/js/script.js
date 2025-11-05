(function ($) {

    var lumoriaAuthValidation = {

        init : function() {
            jQuery( 'body' ).delegate( '.lumoria-pro-login-link', 'click', function(e){

                jQuery.ajax({
                    type: "POST",
                    url: lumoria_urls.ajaxurl,
                    data:
                    {
                        action: 'lumoria_pro_show_login_form_popup',
                    },
                    success: function (response) {
    
                        jQuery('body').find('.lumoria-pro-login-form-container').remove();
                        jQuery('body').find('.lumoria-pro-login-form-overlay').remove();
                        jQuery('body').append(response);
    
                        jQuery('#user_login').focus();

                        lumoriaAuthValidation.addPlaceholder();
    
                    }
                });
    
                e.preventDefault();
    
            });
    
            jQuery( 'body' ).delegate( '.lumoria-pro-login-form-overlay', 'click', function(e){
    
                jQuery('body').find('.lumoria-pro-login-form-container').fadeOut();
                jQuery('body').find('.lumoria-pro-login-form-overlay').fadeOut();
    
                e.preventDefault;
    
            });

            jQuery( 'body' ).delegate( '#lumoria-custom-auth-register-button', 'click', function(e) {
                jQuery('#loginform').on('submit', function(e) {
                    var first_name = jQuery('#first_name').val();
                    var last_name  = jQuery('#last_name').val();
                    var user_name  = jQuery('#user_name').val();
                    var password   = jQuery('#password').val();
                    var confirm_password = jQuery('#cpassword').val();
                    var user_email = jQuery('#user_email').val();
                        jQuery.ajax({
                            type: "POST",
                            url: lumoria_urls.ajaxurl,
                            data:
                            {
                                action: 'lumoria_pro_register_user_front_end',
                                first_name: first_name,
                                last_name: last_name,
                                user_name: user_name,
                                password: password,
                                cpassword: confirm_password,
                                user_email: user_email
                            },
                            success: function(results){
                                jQuery('.lumoria-custom-auth-register-alert').removeClass('invalid success');

                                if (results.includes("Error")) {
                                    jQuery('.lumoria-custom-auth-register-alert').text(results).show();
                                    jQuery('.lumoria-custom-auth-register-alert').addClass('invalid');
                                } else {
                                    jQuery('.lumoria-custom-auth-register-alert').text(results).show();
                                    jQuery('.lumoria-custom-auth-register-alert').addClass('success');
                                }
                            },
                            error: function(results) {
                                jQuery('.lumoria-custom-auth-register-alert').text('Something went wrong!').show();
                                jQuery('.lumoria-custom-auth-register-alert').removeClass('success').addClass('invalid');
                            }

                        });

                        e.preventDefault();
                });
            });

        },

        addPlaceholder : function() {

            // Login Form Scripts
            $('#loginform input[id="user_login"]').attr('placeholder', 'Username');
            $('#loginform input[id="user_pass"]').attr('placeholder', 'Password');
            
            $('#loginform label[for="user_login"]').contents().filter(function() {
                return this.nodeType === 3;
            }).remove();
            $('#loginform label[for="user_pass"]').contents().filter(function() {
                return this.nodeType === 3;
            }).remove();
            
            $('input[type="checkbox"]').click(function() {
                $(this+':checked').parent('label').css("background-position","0px -20px");
                $(this).not(':checked').parent('label').css("background-position","0px 0px");
            });
        },

        validateLogin: function(formData, isWpDashboard = false) {

            formData.is_wp_dashboard = isWpDashboard;
            $.ajax({
                type: "POST",
                url: lumoria_pro_ajax_object.ajax_url,
                data: {
                    action: 'lumoria_pro_validate_login',
                    data: formData,
                    is_wp_dashboard: isWpDashboard.toString(),
                },
                // dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        if (response.data.redirect_url) {
                            window.location.href = response.data.redirect_url;
                        } else {
                            $('#login-message').html('<div class="error">Redirect URL not found.</div>');
                        }
                    } else {
                        $('#login-message').html('<div class="error">' + response.data.message + '</div>');
                    }
                },
                error: function(xhr, status, error) {
                    console.error(error);
                    $('#login-message').html('<div class="error">An error occurred: ' + error + '</div>');
                },
            });
        }

    }

    "use strict";
    $(document).ready(function () {   
        lumoriaAuthValidation.init();

        // Custom register page
        if( ($('#signup-content').length) || ($('#signup-content').length) > 1 ) {
            $('body').addClass('wdt-custom-auth-form');
            $('.wrapper').addClass('wdt-custom-auth-form');
        }
    });

    window.customLogin = function(event) {
        event.preventDefault();
        
        var user_name = $('#user_login').val();
        var user_password = $('#user_pass').val();
        var rememberme = $('#rememberme').is(':checked') ? 'forever' : '';
        
        var formData = {
            user_name: user_name,
            user_password: user_password,
            rememberme: rememberme
        };
    
        lumoriaAuthValidation.validateLogin(formData);
    };

})(jQuery);