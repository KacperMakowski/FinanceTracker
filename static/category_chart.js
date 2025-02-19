const categories = summed_categories.map(value => value[0]);
const values = summed_categories.map(value => Math.abs(value[1]));
const data = {
    labels: categories,
    datasets: [{
        data: values,
        fill: false,
        backgroundColor: [
            '#FFB02F',
            '#C75000',
            '#FF8A00',
            '#E67300',
            '#FFC266',
            '#FF9933',
            '#CC5500',
            '#FF7F00',
            '#DB7B00'
        ],
        tension: 0.1,
    }]
};

const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
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
        },
    },
    plugins: [ChartDataLabels]
};

new Chart(document.getElementById('DougnutCharCategories'), config);