const selectedMonth = '2024-11'; // Tutaj wybieramy miesiąc

const filteredData = summedCategoryDebits.filter(item => item[0] === selectedMonth);
// Przygotowanie danych do wykresu
const categories = filteredData.map(value => value[1]);
const values = filteredData.map(value => Math.abs(value[2]));


const data = {
    labels: categories,
    datasets: [{
        data: values,
        backgroundColor: ['#FF6384', '#36A2EB', '#4e4e4e', '#ee24ff', '#FFCE56'],
        hoverOffset: 4,
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
            title: {
                display: true,
                text: 'Wydatki za 2024-11' // Dodany tytuł
            }
        },
    }
};

new Chart(document.getElementById('DougnutCharMonthCategories'), config);