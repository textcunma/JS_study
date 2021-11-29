const Btn = document.getElementById("Btn");
const Btn2 = document.getElementById("Btn2");
let myChart = null; 

Btn.addEventListener('click', e => {
    const h = 21;
    const s = 50;
    const v = 70;

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('mychart');
    myChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: ['A君', 'B君', 'C君'],  
            datasets: [{
                label: "", 
                data: [h, s, v],
                backgroundColor: [
                    'red',
                    'blue',
                    'green'
                ],
            }],
        },
        plugins: [ChartDataLabels],     //これがないとプラグインが表示されない！！！
        options: {
            responsive: true,
            scales: {
                xAxis: {
                    ticks: {
                        font: {
                            size: 30
                        }
                    }
                }
            },           
            y: {
                min: 0,
                max: 100,
            },
            animation: {
                delay:100,
                duration: 2000,
            },
            plugins: {
                legend: {
                    display: false 
                },
                title: {
                    display: true,
                    font: {
                        size: 30
                    },
                    text: 'サンプル'
                },
                //プラグイン-------------------------------↓
                datalabels: {
                    color: 'white',
                    font: {
                        weight: 'bold',
                        size: 20,
                    },
                    formatter: (value, ctx) => {
                        return value + '%';
                    }
                }
            }
        }
    });
});

Btn2.addEventListener('click', e => {
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('mychart');
    myChart = new Chart(ctx, {
        type: 'radar', 
        data: {
            labels: ['C++', 'Java', 'Python','HTML/CSS','JavaScript'],  
            datasets: [{
                label: "", 
                data: [1,2,4,3,2],
                borderColor: "red",
                backgroundColor:"red",
                pointStyle: "circle",
                pointRadius: 20,
            }],
        },
        plugins: [ChartDataLabels], 
        options: {
            responsive: true,
            fill: false,
            elements: {
                line: {
                  borderWidth: 5
                }
            },
            scale:{
                r:{
                    min: 0,
                    max: 5
                },
                ticks: {
                    stepSize: 1
                }
            },
            scales: {
                r: {
                    pointLabels: {
                      font: {
                        size: 20
                      }
                    }
                }
            },     
            events: [],    
            animation: {
                delay:100,
                duration: 2000,
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    backgroundColor: function(context) {
                      return context.dataset.borderColor;
                    },
                    color: 'white',
                    font: {
                      weight: 'bold',
                      size: 20,
                    }
                }
            }
            
            
        }
    });
    
});

