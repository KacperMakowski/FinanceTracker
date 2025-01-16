let chart_credits = []
for(let i = 0; i < credits_to_js.length; i++)
{
    chart_credits.push(credits_to_js[i]*1)
}
const data = {
            labels: months_credits_to_js, // Miesiące na osi X
            datasets: [{
                label: 'Ilość zyskanych pieniędzy w poszczególnym miesiącu',
                data: chart_credits, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgb(48, 183, 39)', // Kolor linii
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

                        beginAtZero: true, // Oś Y zaczyna się od zera
                    },
                    x: {
                        reverse: true
                    }
                }
            }
        };

        // Renderowanie wykresu
        new Chart(document.getElementById('LineChartCredits'), config);