class LineGraph { // extends Graph
    constructor(config) {
        this.config = config;

        this.dom_object = $("<div/>", {
            "id": this.config.uid + "_graph",
            "class": 'col-md-auto'
        });

        let card = $("<div/>", {"class": "card"});
        let header = $("<div/>", {"class": "card-header"});
        let body = $("<div/>", {"class": "card-body"});

        let icon = $("<i/>", {
            "class": "fas fa-fw header-icon fa-" + this.config.icon, 
            "id": this.config.uid + "_icon"
        });

        let title = $("<span/>", {
            "id": this.config.uid + "_title",
            "text": " " + this.config.title
        });

        let canvas = $("<canvas/>", {
            "id": this.config.uid + "_canvas",
            "width": "400",
            "height": "200",
            "css": {
                "display": "block",
                "height": "187px",
                "width": "374px"
            }
        });

        this.chart = new Chart(canvas, this.generate_chart_config());

        header.append(icon, title);
        body.append(canvas);
        card.append(header, body);
        this.dom_object.append(card);        
    }

    appendTo(target) {
        $(target).append(this.dom_object);
        // Fix canvas rendering
        $("#" + this.config.uid + "_canvas").attr("style", "display: block; height: 187px; width: 374px;");
    }

    update(index, data, name) {
        if (index >= this.chart.config.data.datasets.length) {
            this.chart.config.data.datasets[index] = {
                label: name,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: [
                    randomColour()
                ]
            }
        }
        this.chart.config.data.datasets[index].label = name;
        // Remove oldest element
        this.chart.config.data.datasets[index].data.shift();
        // Push new element
        this.chart.config.data.datasets[index].data.push(data);
        // Update chart to display new data
        this.chart.update();
    }

    generate_chart_config() {
        let frequency = this.config["frequency"];
        let labels = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0].map(function(x) { return +(x * frequency).toFixed(2);});
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: [
                        randomColour()
                    ]
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0 // disables bezier curves
                    }
                },
                animation: {
                    duration: 50
                },
                responsive: true,
                title: {
                    display: false
                },
                tooltips: {
                    enabled: true
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    display: true,
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.config["x_axis_label"]
                        },
                        gridLines: {
        
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: this.config["y_axis_min"],
                            max: this.config["y_axis_max"]
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.config["y_axis_label"]
                        },
                        gridLines: {
                            
                        }
                    }]
                }
            }
        };
    }
}

