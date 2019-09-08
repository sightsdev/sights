var tempChartConfig = {
    type: 'line',
    data: {
        labels: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0],
        datasets: [{
            label: '',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: [
                'rgba(234, 67, 53, 1)'
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
            display: false,
            text: 'Temperature'
        },
        tooltips: {
            enabled: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        legend: {
            display: false,
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                ticks: {
                    min: 20,
                    max: 40
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (°C)'
                }
            }]
        }
    }
}

var distChartConfig = {
    type: 'polarArea',
    data: {
        labels: ['Front', 'Right', 'Back', 'Left'],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                "rgba(0, 255, 0, 0.8)",
                "rgba(0, 255, 200, 0.8)",
                "rgba(0, 255, 200, 0.8)",
                "rgba(0, 255, 200, 0.8)"
            ],
            borderColor: "rgba(0, 0, 0, 0.5)"
        }]
    },
    options: {
        startAngle: 5 * Math.PI / 4,
        legend: {
            position: 'left',
            display: false
        },
        animation: {
            animateRotate: false
        },
        tooltips: {
            enabled: false,
        },
        scale: {
            ticks: {
                max: 1200,
                min: 0,
                stepSize: 100
            }
        }
    }
}