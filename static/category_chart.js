const data = {
            labels: months_debits_to_js, // Miesiące na osi X
            datasets: [{
                label: 'Wydatki' ,
                data: chart_debits, // Debety na osi Y
                fill: false, // Bez wypełnienia pod wykresem
                borderColor: 'rgb(231, 9, 9)', // Kolor linii
                tension: 0.1, // Ustawienie wygładzenia linii
                pointRadius: 5,
            },
                {
                    label: 'Przychody',
                    data: chart_credits, // Debety na osi Y
                    fill: false, // Bez wypełnienia pod wykresem
                    borderColor: 'rgb(48, 183, 39)', // Kolor linii
                    tension: 0.1, // Ustawienie wygładzenia linii
                    pointRadius: 5,
                }]
        };

        // Tworzenie wykresu
        const config = {
            type: 'doughnut', // Typ wykresu - liniowy
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
        new Chart(document.getElementById('LineChartCreditsDebits'), config);
