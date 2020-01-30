class CircleGraph extends Graph{
    constructor(config) {
        super(config);

        this.dom_object = $("<div/>", {
            "id": this.config.uid + "_graph",
            "class": 'col'
        });

        let card = $("<div/>", {"class": "card"});
        let header = $("<div/>", {"class": "card-header"});
        let body = $("<div/>", {"class": "card-body"});

        let title = $("<span/>", {
            "id": this.config.uid + "_title",
            "text": this.config.title
        });

        let circle = $("<div/>", {
            "id": this.config.uid + "_circle",
            "class": 'c100 p0 med orange center'
        }).append(
            $("<span/>", {
                "id": this.config.uid + "_level",
                "style": this.config.unit_style
            }),
            $("<div/>", {
                "class": 'slice'
            }).append(
                $("<div/>", {
                    "class": 'bar'
                }),
                $("<div/>", {
                    "class": 'fill'
                })
            )
        );

        header.append(title);
        body.append(circle);
        card.append(body, header);
        this.dom_object.append(card);
    }

    update(index, data, name) {
        let max = this.config.maximum;
        let level = $("#" + this.config.uid + "_level");
        let circle = $("#" + this.config.uid + "_circle");
        let unit = this.config.unit;
        level.html(data + unit);
        let percent = Math.round((data / max) * 100);
        if (percent > 100) percent = 100;
        circle.attr('class', "c100 med orange center p" + percent);
    }
}

