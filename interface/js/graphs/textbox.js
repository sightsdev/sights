class TextBox extends Graph{
    constructor(config) {
        super(config);

        this.dom_object = $("<li/>", {
            "id": this.config.uid + "_textbox",
            "class": 'list-group-item'
        }).append(
            $("<strong/>", {
                "text": this.config.title,
                "style": "padding-right: 10px;"
            }),
            $("<span/>", {
                "style": 'float:right;'
            }).append(
                $("<span/>", {
                    "id": this.config.uid + "_data",
                    "text": '0'
                }),
                $("<span/>", {
                    "text": this.config.maximum ? "/" + this.config.maximum : ""
                }),
                $("<span/>", {
                    "text": this.config.unit ? " " + this.config.unit : ""
                })
            )
        );
    }

    update(index, data, name) {
        let field = $("#" + this.config.uid + "_data");
        field.html(data);
    }
}

