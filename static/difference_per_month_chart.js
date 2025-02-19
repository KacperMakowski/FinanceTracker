let chart_difference = []
for(let i = 0; i < monthly_difference.length; i++)
{
    chart_difference.push(monthly_difference[i]*1)
}

const data = {
            labels: months_debits_to_js, // Miesiące na osi X
            datasets: [{
                data: chart_difference, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgba(126,126,126,0.78)',
                tension: 0.1, // Ustawienie wygładzenia linii
                pointRadius: 5,
                pointBackgroundColor: chart_difference.map(value =>
            value > 0 ? 'rgba(255,107,125,1)' : 'rgba(215,0,141,1)'
        ),
            }]
        };


        // Tworzenie wykresu
        const config = {
            type: 'line', // Typ wykresu - liniowy
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
                                return tooltipItem.raw.toFixed(2); // Formatowanie wartości
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true, // Oś Y zaczyna się od zera
                },
                    x: {
                      reverse: true
                    }
                }
            }
        };

        // Renderowanie wykresu
        new Chart(document.getElementById('LineChartDifference'), config);
