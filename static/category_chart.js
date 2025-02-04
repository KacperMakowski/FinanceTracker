const categories = summed_categories.map(value => value[0]);
const values = summed_categories.map(value => Math.abs(value[1]));
const data = {
            labels: categories,
            datasets: [{
                data: values,
                fill: false,
                backgroundColor: ['#FF6384', '#36A2EB', "#4e4e4e", "#ee24ff",
					'#FFCE56', '#4CAF50', '#9C27B0', '#FF9800', "#4CAF50"],
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
                position: 'top',
            },
        },
        scales: {
            y: {

                beginAtZero: true,
            },
            x: {
            }
        }
    }
};

new Chart(document.getElementById('DougnutCharCategories'), config);
