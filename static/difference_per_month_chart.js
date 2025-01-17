let chart_difference = []
for(let i = 0; i < monthly_difference.length; i++)
{
    chart_difference.push(monthly_difference[i]*1)
}

const data = {
            labels: months_debits_to_js, // Miesiące na osi X
            datasets: [{
                label: 'Ilość wydanych pieniędzy w poszczególnym miesiącu',
                data: chart_difference, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgba(126,126,126,0.78)',
                tension: 0.1, // Ustawienie wygładzenia linii
                pointRadius: 5,
                pointBackgroundColor: chart_difference.map(value =>
            value > 0 ? 'rgba(48, 183, 39, 0.78)' : 'rgba(231, 9, 9, 0.78)'
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
                    legend: {
                        position: 'top',
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
