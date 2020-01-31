class UptimeBox extends Graph{
    constructor(config) {
        super(config);

        this.dom_object = $("<li/>", {
            "id": this.config.uid + "_uptime",
            "class": 'list-group-item'
        }).append(
            $("<strong/>", {
                "text": this.config.title,
                "style": "padding-right: 10px;"
            }),
            $("<span/>", {
                "id": this.config.uid + "_uptime_text",
                "style": 'float:right; font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", ' +
                    '"Courier New", monospace;',
                "text": "00:00:00:00"
            })
        );
    }

    appendTo(target) {
        super.appendTo(target);
        $(target).parent().parent().parent().show(); // Text group may be hidden. Show it.
        let id = "#" + this.config.uid + "_uptime_text";
        // Uptime updater
        var daySecs = 60*60*24;
        var hourSecs = 60*60;
        var minSecs = 60; // minSecs rhymes with insects
        setInterval(() => {
            if(startTime) {
                // Calculate uptime based on time elapsed since reported time of boot
                let upSeconds = (Date.now() - startTime) / 1000;

                let days = (Math.floor(upSeconds / daySecs) + "").padStart(2, '0');
                let hours = (Math.floor((upSeconds % daySecs) / hourSecs) + "").padStart(2, '0');
                let minutes = (Math.floor(((upSeconds % daySecs) % hourSecs) / minSecs) + "").padStart(2, '0');
                let seconds = (Math.floor(((upSeconds % daySecs) % hourSecs) % minSecs) + "").padStart(2, '0');

                // Format nicely
                $(id).html(days + ":" + hours + ":" + minutes + ":" + seconds);
            }
            else $(id).html("00:00:00:00");
        }, 1000);
    }

    update(index, data, name) {
        interfaceLog("warning", "sensors", "The sensor " + name + " should not display on an " +
            "uptime box.");
    }
}

