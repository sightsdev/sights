class ThermalCamera {
    constructor(config) {
        this.overlayed = false;
        this.config = config;
        this.overlayCamera = this.config.camera;

        this.dom_object = $("<div/>", {
            "id": this.config.uid + "_thermal_camera",
            "class": 'col-md-auto'
        });

        let width = this.config.width;
        let height = this.config.height;
        // Generate thermal camera table
        let x = 0;
        let table = $("<table>");
        for (let i = 0; i < height; i++) {
            var row = $('<tr>');
            for (let j = 0; j < width; j++) {
                row.append("<td style='width: " + ((1 / width) * 100) + "%;position: relative;'><div class='content' id=p_" + this.config.uid + "_" + x + "></div></td>");
                x++;
            }
            table.append(row);
        }

        let card = $("<div/>", {"class": "card"});

        let header = $("<div/>", {"class": "card-header"}).append(
            $("<i/>", {
                "class": "fas fa-fw fa-camera header-icon"
            }),
            $("<span/>", {
                "id": this.config.uid + "_title",
                "text": this.config.title
            }),
            $("<button/>", {
                "id": this.config.uid + "_overlay_button",
                "style": "margin-left: 10px; padding: 0px 2px 0px 2px",
                "type": "button",
                "class": "btn btn-secondary",
                "onClick": "graphs['" + this.config.uid + "'].overlay();"
            }).append(
                $("<i/>", {
                    "class": "fas fa-fw fa-arrow-up"
                })
            )
        );

        let controls = $("<div/>", {
            "class": "card-body",
            "style": "display: none;",
            "id": this.config.uid + "_overlay_controls"
        }).append(
            $("<select/>",{
                "class": "custom-select custom-select-sm",
                "style": "margin-bottom: 5px;",
                "id": this.config.uid + "_overlay_selector"
            }),
            $("<p/>", {
                "style": "margin: 0px",
                "text": "Opacity"
            }).append(
                $("<button/>", {
                    "style": "padding: 0px",
                    "class": "btn float-right",
                    "id": this.config.uid + "_thermal_overlay_opacity_reset"
                }).append($("<i/>", {"class": "fa fa-fw fa-undo"}))
            ),
            $("<input/>", {
                "id": this.config.uid + "_thermal_overlay_opacity",
                "class": "custom-range",
                "type": "range",
                "min": "0",
                "max": "1",
                "step": "0.01",
                "value": "0.25"
            }),

            $("<p/>", {
                "style": "margin: 0px",
                "text": "X Scale"
            }).append(
                $("<button/>", {
                    "style": "padding: 0px",
                    "class": "btn float-right",
                    "id": this.config.uid + "_thermal_overlay_xscale_reset",
                }).append($("<i/>", {"class": "fa fa-fw fa-undo"}))
            ),
            $("<input/>", {
                "id": this.config.uid + "_thermal_overlay_xscale",
                "class": "custom-range " + this.config.uid + "-thermal-overlay-scale",
                "type": "range",
                "min": "0.5",
                "max": "1.5",
                "step": "0.01",
                "value": "1"
            }),

            $("<p/>", {
                "style": "margin: 0px",
                "text": "Y Scale"
            }).append(
                $("<button/>", {
                    "style": "padding: 0px",
                    "class": "btn float-right",
                    "id": this.config.uid + "_thermal_overlay_yscale_reset",
                }).append($("<i/>", {"class": "fa fa-fw fa-undo"}))
            ),
            $("<input/>", {
                "id": this.config.uid + "_thermal_overlay_yscale",
                "class": "custom-range " + this.config.uid + "-thermal-overlay-scale",
                "type": "range",
                "min": "0.5",
                "max": "1.5",
                "step": "0.01",
                "value": "1"
            })
        );

        // Camera container and table
        let camera = $("<div/>", {
            "id": this.config.uid + "_camera_container"
        }).append(
            $("<div/>", {
                "id": this.config.uid + "_camera"
            }).append(table)
        );

        card.append(header, controls, camera);
        this.dom_object.append(card);
    }

    appendTo(target) {
        $(target).append(this.dom_object);
        this.registerSliders();
    }

    //TODO update thermal camera
    update(index, data, name) {
        for (i = 0; i < data.length; i++) {
            // Apply colour to the appropriate HTML element
            var pixel = Math.round(data[i]);
            $("#p_" + this.config.uid + "_" + i).css("background", rainbow(pixel));
        }
    }

    //Swap thermal overlay on click
    overlay() {
        let opacity = $('#' + this.config.uid + '_thermal_overlay_opacity').val();
        let xscale = $('#' + this.config.uid + '_thermal_overlay_xscale').val();
        let yscale = $('#' + this.config.uid + '_thermal_overlay_yscale').val();
        if(!this.overlayed) {
            if(this.overlayCamera != 'default') {
                $('#' + this.config.uid + '_camera').css({ 'opacity' : opacity });
                $('#camera_' + this.overlayCamera).css({'filter': 'grayscale(100%)'});
                $('#thermal_overlay_' + this.overlayCamera).append($('#' + this.config.uid + '_camera'));
                $('#' + this.config.uid + '_overlay_controls').css({'display':'inline'});
                $('#' + this.config.uid + '_camera').css({'transform' : 'scale('+xscale+','+yscale+')'});
            }
            else {
                $('#main_container').append($('#' + this.config.uid + '_camera'));
                $('#' + this.config.uid + '_camera').css({'width':'500px'})
            }
            $('#' + this.config.uid + '_overlay_button').toggleClass('fa-rotate-180');
            this.overlayed = true;
        }
        else {
            $('#' + this.config.uid + '_camera').css({ 'opacity' : 1 });
            $('#' + this.config.uid + '_camera_container').append($('#' + this.config.uid + '_camera'));
            $('#camera_' + this.overlayCamera).css({'filter': ''});
            $('#' + this.config.uid + '_overlay_button').toggleClass('fa-rotate-180');
            $('#' + this.config.uid + '_overlay_controls').css({'display':'none'});
            $('#' + this.config.uid + '_camera').css({'transform' : 'scale(1,1)'});
            $('#' + this.config.uid + '_camera').css({'width':'100%'})
            this.overlayed = false;
        }
    }

    registerSliders() {
        let uid = this.config.uid;
        // Set defaults from config
        let defaultOpacity = this.config.opacity ? this.config.opacity / 100 : 0.25;
        let defaultXScale = this.config.xscale ? this.config.xscale / 100 : 1;
        let defaultYScale = this.config.yscale ? this.config.yscale / 100 : 1;
        $('#' + uid + '_thermal_overlay_opacity').val(defaultOpacity);
        $('#' + uid + '_thermal_overlay_xscale').val(defaultXScale);
        $('#' + uid + '_thermal_overlay_yscale').val(defaultYScale);
        // Thermal Overlay Settings
        // Opacity slider
        $('#' + uid + '_thermal_overlay_opacity').on("input", function() {
            $('#' + uid + '_camera').css({ 'opacity' : $(this).val() });
        });
        // Opacity slider reset button
        $('#' + uid + '_thermal_overlay_opacity_reset').on("click", function() {
            $('#' + uid + '_thermal_overlay_opacity').val(defaultOpacity);
            $('#' + uid + '_camera').css('opacity', defaultOpacity);
        });
        // X and Y scale sliders
        $('.' + uid + '-thermal-overlay-scale').on("input", function() {
            let xscale = $('#' + uid + '_thermal_overlay_xscale').val();
            let yscale = $('#' + uid + '_thermal_overlay_yscale').val();
            $('#' + uid + '_camera').css({'transform' : 'scale('+xscale+','+yscale+')'});
        });
        // X scale slider reset button
        $('#' + uid + '_thermal_overlay_xscale_reset').on("click", function() {
            $('#' + uid + '_thermal_overlay_xscale').val(defaultXScale);
            let yscale = $('#' + uid + '_thermal_overlay_yscale').val();
            $('#' + uid + '_camera').css({'transform' : 'scale(1,'+yscale+')'});
        });
        // Y scale slider reset button
        $('#' + uid + '_thermal_overlay_yscale_reset').on("click", function() {
            $('#' + uid + '_thermal_overlay_yscale').val(defaultYScale);
            let xscale = $('#' + uid + '_thermal_overlay_xscale').val();
            $('#' + uid + '_camera').css({'transform' : 'scale('+xscale+', 1)'});
        });
        // Camera selector
        $('.thermal-overlay').each(function () {
            let id = $(this).attr("id");
            let location = id.substring(16, id.length);
            if(global_config['interface']['cameras'][location]['enabled']) {
                // Use first camera as overlay camera
                if(graphs[uid].overlayCamera == 'default') {
                    graphs[uid].overlayCamera = location;
                }
                let pretty_id = location.charAt(0).toUpperCase() + location.slice(1) + " Camera";
                let option = '<option value="'+ location + '">' + pretty_id + '</option>';
                $('#' + uid + "_overlay_selector").append(option);
            }
        });
        // Set default camera from config
        if(this.config.camera != 'default') {
            $('#' + uid + "_overlay_selector").val('' + this.config.camera);
        }
        // Change selection on input
        $('#' + uid + "_overlay_selector").on("input", function () {
            graphs[uid].overlay(); // Remove current overlay
            graphs[uid].overlayCamera = $('#' + uid + "_overlay_selector").val(); // Change the camera to use
            graphs[uid].overlay(); // Add the new overlay
        })
    }
}

