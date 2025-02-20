document.addEventListener("DOMContentLoaded", function() {
    const firstSelect = document.getElementById("select_first_month");
    const secondSelect = document.getElementById("select_second_month");

    let firstMonth = firstSelect.value;
    let secondMonth = secondSelect.value;

    let chartInstance = null;

    const allSecondOptions = Array.from(secondSelect.options).map(option => ({
        value: option.value,
        text: option.text
    }));

    function updateSecondSelect() {
        secondSelect.innerHTML = "";
        const filteredOptions = allSecondOptions.filter(opt => opt.value >= firstMonth);

        if (filteredOptions.length === 0) {
            const placeholder = document.createElement("option");
            placeholder.text = "Brak dostępnych dat";
            placeholder.disabled = true;
            secondSelect.appendChild(placeholder);
            secondMonth = null;
        } else {
            filteredOptions.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt.value;
                option.text = opt.text;
                secondSelect.appendChild(option);
            });
            secondMonth = filteredOptions[0].value;
        }
    }

    function updateChart() {
        if (!secondMonth) {
            if (chartInstance) {
                chartInstance.destroy();
            }
            return;
        }

        const filteredData = summedCategoryDebits.filter(item => item[0] >= firstMonth && item[0] <= secondMonth);

        const aggregated = {};
        filteredData.forEach(item => {
            const category = item[1];
            const amount = Math.abs(item[2]);
            if (aggregated[category]) {
                aggregated[category] += amount;
            } else {
                aggregated[category] = amount;
            }
        });

        const categories = Object.keys(aggregated);
        const values = Object.values(aggregated);

        const data = {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: ["#F400FF",
                    "#942FFF",
                    "#D700E8",
                    "#B14AFF",
                    "#FF66FF",
                    "#8A2BE2",
                    "#DA70D6",
                    "#FF00FF",
                    "#9932CC"
                ],
                hoverOffset: 4,
            }]
        };

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(document.getElementById('DougnutCharMonthCategories'), {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
            datalabels: {
                color: 'white',
                font: {
                    size: 14,
                    weight: 'bold'
                },
                formatter: function(value, context) {
                    const dataset = context.chart.data.datasets[0];
                    const total = dataset.data.reduce((acc, data) => acc + data, 0);
                    const percentage = Math.round((value / total) * 100);
                    return percentage > 1 ? percentage + '%' : '';
                },
                display: function(context) {
                    const dataset = context.dataset;
                    const total = dataset.data.reduce((acc, data) => acc + data, 0);
                    const value = dataset.data[context.dataIndex];
                    const percentage = Math.round((value / total) * 100);
                    return percentage > 1;
                }
            }
        }
    },
    plugins: [ChartDataLabels]
});
    }

    firstSelect.addEventListener("change", function() {
        firstMonth = this.value;
        updateSecondSelect();
        updateChart();
    });

    secondSelect.addEventListener("change", function() {
        secondMonth = this.value;
        updateChart();
    });

    updateSecondSelect();
    updateChart();
});