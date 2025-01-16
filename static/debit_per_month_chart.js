const revesed_months = [] /* to reverse chart */
for (let i = debits_to_js.length; i >= 0; i--) {
  revesed_months.push(months_to_js[i]);
}

const data = {
            labels: months_to_js, // Miesiące na osi X
            datasets: [{
                label: 'Ilość wydanych pieniędzy w poszczególnym miesiącu',
                data: debits_to_js, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgb(75, 192, 192)', // Kolor linii
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
        new Chart(document.getElementById('LineChart'), config);