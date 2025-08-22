// --- MOCK DATA & SIMULATION ---

// Data structure to hold sensor information for different sites
const siteData = {
    stellenbosch: {
        name: "Stellenbosch",
        power: { base: 75, fluctuation: 10 },
        moisture: { base: 60, fluctuation: 5 },
        panelTemp: { base: 45, fluctuation: 5 },
        airTemp: { base: 22, fluctuation: 2 },
        irradiance: { base: 800, fluctuation: 100 }
    },
    malmesbury: {
        name: "Malmesbury",
        power: { base: 90, fluctuation: 15 },
        moisture: { base: 45, fluctuation: 7 },
        panelTemp: { base: 55, fluctuation: 8 },
        airTemp: { base: 28, fluctuation: 3 },
        irradiance: { base: 950, fluctuation: 50 }
    },
    karoo: {
        name: "Karoo",
        power: { base: 110, fluctuation: 5 },
        moisture: { base: 25, fluctuation: 5 },
        panelTemp: { base: 60, fluctuation: 5 },
        airTemp: { base: 32, fluctuation: 4 },
        irradiance: { base: 1100, fluctuation: 20 }
    }
};

let currentSiteId = 'stellenbosch';
let energyChart, agriChart;
let dataUpdateInterval;

// --- CHART CONFIGURATION ---

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'second',
                displayFormats: {
                    second: 'HH:mm:ss'
                }
            },
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
            beginAtZero: true,
            ticks: { color: '#9CA3AF' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
    },
    plugins: {
        legend: {
            labels: { color: '#D1D5DB' }
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    },
    animation: {
        duration: 500
    }
};

// Function to initialize charts
function initializeCharts() {
    const energyCtx = document.getElementById('energyChart').getContext('2d');
    energyChart = new Chart(energyCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Power Output (kW)',
                    data: [],
                    borderColor: '#34D399',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Solar Irradiance (W/m²)',
                    data: [],
                    borderColor: '#FBBF24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: { ...commonChartOptions,
            scales: {
                x: commonChartOptions.scales.x,
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Power (kW)', color: '#D1D5DB' },
                    ticks: { color: '#9CA3AF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Irradiance (W/m²)', color: '#D1D5DB' },
                    ticks: { color: '#9CA3AF' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });

    const agriCtx = document.getElementById('agriChart').getContext('2d');
    agriChart = new Chart(agriCtx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Soil Moisture (%)',
                    data: [],
                    borderColor: '#60A5FA',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Air Temperature (°C)',
                    data: [],
                    borderColor: '#F87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: { ...commonChartOptions,
            scales: {
                x: commonChartOptions.scales.x,
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Moisture (%)', color: '#D1D5DB' },
                    ticks: { color: '#9CA3AF' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Temperature (°C)', color: '#D1D5DB' },
                    ticks: { color: '#9CA3AF' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// --- UI & DATA UPDATE LOGIC ---

// Function to generate a new data point
function getNewDataPoint(siteId) {
    const site = siteData[siteId];
    const now = new Date();
    return {
        time: now,
        power: (site.power.base + (Math.random() - 0.5) * site.power.fluctuation).toFixed(2),
        moisture: (site.moisture.base + (Math.random() - 0.5) * site.moisture.fluctuation).toFixed(2),
        panelTemp: (site.panelTemp.base + (Math.random() - 0.5) * site.panelTemp.fluctuation).toFixed(2),
        airTemp: (site.airTemp.base + (Math.random() - 0.5) * site.airTemp.fluctuation).toFixed(2),
        irradiance: (site.irradiance.base + (Math.random() - 0.5) * site.irradiance.fluctuation).toFixed(2)
    };
}

// Function to update the dashboard with new data
function updateDashboard() {
    const data = getNewDataPoint(currentSiteId);

    // Update KPI cards
    document.getElementById('kpi-power').textContent = `${data.power} kW`;
    document.getElementById('kpi-moisture').textContent = `${data.moisture} %`;
    document.getElementById('kpi-panel-temp').textContent = `${data.panelTemp} °C`;
    document.getElementById('kpi-air-temp').textContent = `${data.airTemp} °C`;

    // Update charts
    const charts = [energyChart, agriChart];
    charts.forEach(chart => {
        if (chart.data.datasets[0].data.length >= 20) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }
    });

    energyChart.data.labels.push(data.time);
    energyChart.data.datasets[0].data.push(data.power);
    energyChart.data.datasets[1].data.push(data.irradiance);

    agriChart.data.labels.push(data.time);
    agriChart.data.datasets[0].data.push(data.moisture);
    agriChart.data.datasets[1].data.push(data.airTemp);

    energyChart.update('none');
    agriChart.update('none');
}

// Function to reset and populate charts for a new site
function resetAndPopulateData(siteId) {
    // Clear existing data
    energyChart.data.labels = [];
    agriChart.data.labels = [];
    energyChart.data.datasets.forEach(dataset => dataset.data = []);
    agriChart.data.datasets.forEach(dataset => dataset.data = []);

    // Populate with a few initial data points
    for (let i = 0; i < 10; i++) {
        const data = getNewDataPoint(siteId);
        const pastTime = new Date(data.time.getTime() - (10 - i) * 2000);

        energyChart.data.labels.push(pastTime);
        energyChart.data.datasets[0].data.push(data.power);
        energyChart.data.datasets[1].data.push(data.irradiance);

        agriChart.data.labels.push(pastTime);
        agriChart.data.datasets[0].data.push(data.moisture);
        agriChart.data.datasets[1].data.push(data.airTemp);
    }
    energyChart.update();
    agriChart.update();

    // Do one immediate update for KPIs
    updateDashboard();
}

// Event listener for the site selector dropdown
document.getElementById('site-selector').addEventListener('change', (event) => {
    currentSiteId = event.target.value;

    // Stop the current interval
    clearInterval(dataUpdateInterval);

    // Reset charts and start new interval
    resetAndPopulateData(currentSiteId);
    dataUpdateInterval = setInterval(updateDashboard, 2000); // Update every 2 seconds
});

// --- INITIALIZATION ---
window.onload = () => {
    initializeCharts();
    resetAndPopulateData(currentSiteId);
    dataUpdateInterval = setInterval(updateDashboard, 2000);
};
