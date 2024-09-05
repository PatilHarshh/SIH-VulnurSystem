const companyData = {
    'Company A': {
        totalSales: 2,
        profitMargin: 25,
        marketShare: 20,
        salesData: [120, 150, 180, 200, 220, 240],
        profitData: [30, 50, 70, 90, 110, 130],
        marketShareData: [15, 18, 20, 22, 24, 20]
    },
    'Company B': {
        totalSales: 1,
        profitMargin: 15,
        marketShare: 15,
        salesData: [100, 130, 160, 180, 200, 220],
        profitData: [20, 40, 60, 80, 100, 120],
        marketShareData: [10, 13, 15, 17, 19, 15]
    },
    'Company C': {
        totalSales:  2,
        profitMargin: 35,
        marketShare: 30,
        salesData: [140, 170, 200, 230, 250, 270],
        profitData: [40, 60, 80, 100, 120, 140],
        marketShareData: [20, 23, 25, 28, 30, 25]
    }
};

function selectCompany(company) {
    const data = companyData[company];

    document.getElementById('total-sales').textContent = data.totalSales;
    document.getElementById('profit-margin').textContent = data.profitMargin + '%';
    document.getElementById('market-share').textContent = data.marketShare + '%';

    updateChart(salesChart, data.salesData, 'Monthly Threats');
    updateChart(profitChart, data.profitData, 'Threats Data');
    updateChart(marketShareChart, data.marketShareData, 'Severity');
}

function updateChart(chart, data, label) {
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].label = label;
    chart.update();
}

// Initialize charts
const salesCtx = document.getElementById('salesChart').getContext('2d');
const profitCtx = document.getElementById('profitChart').getContext('2d');
const marketShareCtx = document.getElementById('marketShareChart').getContext('2d');

const salesChart = new Chart(salesCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Threats',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const profitChart = new Chart(profitCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Threats Data',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const marketShareChart = new Chart(marketShareCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Severity',
            data: [],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Default to Company A on load
selectCompany('Company A');
