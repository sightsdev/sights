class Graph {
    dom_object;

    constructor(config) {
        this.config = config;

        if (this.config.uid in graphs) {
            duplicateGraphAlert(this.config.uid);
        }

        // Make it so the "abstract" class cannot be instantiated.
        if (this.constructor === Graph) {
            throw new TypeError('Abstract class "Graph" cannot be instantiated directly.');
        }
    }

    appendTo(target) {
        $(target).append(this.dom_object);
    }

    update(index, data, name) {
        throw new Error('Graph subclass ' + this.constructor.name + " must implement the abstract method " +
            "update(index, data, name)");
    }

    setup(index, data, name) {
    }

    remove() {
        $("#" + this.dom_object[0].id).remove();
    }
}