let chart_difference = []
for(let i = 0; i < monthly_difference.length; i++)
{
    chart_difference.push(monthly_difference[i]*1)
}

const data = {
            labels: months_debits_to_js, // Miesiące na osi X
            datasets: [{
                label: 'Ilość wydanych pieniędzy w poszczególnym miesiącu',
                data: monthly_difference, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgb(231, 9, 9)', // Kolor linii
                tension: 0.1, // Ustawienie wygładzenia linii
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
                        reverse: true,
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
