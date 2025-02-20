let chart_difference = []
for(let i = 0; i < monthly_difference.length; i++)
{
    chart_difference.push(monthly_difference[i]*1)
}

const data = {
            labels: months_debits_to_js,
            datasets: [{
                data: chart_difference,
                fill: false,
                borderColor: 'rgba(126,126,126,0.78)',
                tension: 0.1,
                pointRadius: 5,
                pointBackgroundColor: chart_difference.map(value =>
            value > 0 ? 'rgba(255,107,125,1)' : 'rgba(215,0,141,1)'
        ),
            }]
        };


        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,

                plugins: {
                    datalabels: {
                        display: false
                    },
                    legend: {
                       display:false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.raw.toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                },
                    x: {
                      reverse: true
                    }
                }
            }
        };

        new Chart(document.getElementById('LineChartDifference'), config);
