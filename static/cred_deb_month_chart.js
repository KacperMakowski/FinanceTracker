let chart_debits = []
for(let i = 0; i < debits_to_js.length; i++)
{
    chart_debits.push(debits_to_js[i]*(-1))
}
let chart_credits = []
for(let i = 0; i < credits_to_js.length; i++)
{
    chart_credits.push(credits_to_js[i]*1)
}


const data = {
            labels: months_debits_to_js,
            datasets: [{
                label: 'Wydatki' ,
                data: chart_debits,
                fill: false,
                borderColor: 'rgba(113,255,177,1)',
                tension: 0.1,
                pointRadius: 5,
            },
                {
                    label: 'Przychody',
                    data: chart_credits,
                    fill: false,
                    borderColor: 'rgba(0,111,255,1)',
                    tension: 0.1,
                    pointRadius: 5,
                }]
        };

        // Tworzenie wykresu
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
                        position: 'top',
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

        new Chart(document.getElementById('LineChartCreditsDebits'), config);
