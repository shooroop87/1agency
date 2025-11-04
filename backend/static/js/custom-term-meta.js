jQuery(document).ready(function($) {
   
    $('.color-picker').wpColorPicker();

    var frame;
    $('#upload_image_button').on('click', function(e) {
        e.preventDefault();
        if (frame) {
            frame.open();
            return;
        }
        frame = wp.media({
            title: 'Select or Upload Image',
            button: {
                text: 'Use this image'
            },
            multiple: false
        });
        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            $('#custom_field_image').val(attachment.id);
            $('#custom_field_image_preview').html('<img src="' + attachment.url + '" style="max-width: 100%;" />');
        });
        frame.open();
    });

    $('#remove_image_button').on('click', function() {
        $('#custom_field_image').val('');
        $('#custom_field_image_preview').html('');
    });
});
