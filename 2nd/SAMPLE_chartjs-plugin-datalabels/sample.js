const Btn = document.getElementById("Btn");
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
