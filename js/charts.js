// Charts functionality for SPPD Open Tenders website

let charts = {};
let chartsInitialized = false;

// Initialize charts when analytics tab is selected
function initCharts() {
    if (chartsInitialized) return;
    
    // Wait for data to be loaded from JSON file
    if (window.SPPDData && window.SPPDData.isDataLoaded() && window.openTendersData) {
        createCharts(transformDataForCharts(window.openTendersData));
        chartsInitialized = true;
    } else {
        // If data is not loaded yet, wait for it
        const checkDataInterval = setInterval(() => {
            if (window.SPPDData && window.SPPDData.isDataLoaded() && window.openTendersData) {
                createCharts(transformDataForCharts(window.openTendersData));
                chartsInitialized = true;
                clearInterval(checkDataInterval);
            }
        }, 100);
    }
}

// Transform data to match the expected chart structure
function transformDataForCharts(data) {
    return window.SPPDUtils.transformData(data);
}

function createCharts(data) {
    // Region distribution chart (previously city)
    const regionCtx = document.getElementById('region-chart');
    if (regionCtx) {
        const regionData = getRegionData(data);
        charts.region = new Chart(regionCtx, {
            type: 'doughnut',
            data: {
                labels: regionData.labels,
                datasets: [{
                    data: regionData.values,
                    backgroundColor: [
                        '#1a365d', '#2d5a87', '#4a90e2', '#7bb3f0', '#a8d1ff',
                        '#d4e6ff', '#e3f2fd', '#f5f9ff', '#ffffff', '#f8f9fa'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Roboto, sans-serif',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Type distribution chart (previously category)
    const typeCtx = document.getElementById('category-chart');
    if (typeCtx) {
        const typeData = getTypeData(data);
        charts.type = new Chart(typeCtx, {
            type: 'bar',
            data: {
                labels: typeData.labels,
                datasets: [{
                    label: 'Número de Licitaciones',
                    data: typeData.values,
                    backgroundColor: '#1a365d',
                    borderColor: '#2d5a87',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Licitaciones: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Roboto, sans-serif'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Roboto, sans-serif'
                            }
                        }
                    }
                }
            }
        });
    }

    // Value distribution chart
    const valueCtx = document.getElementById('value-chart');
    if (valueCtx) {
        const valueData = getValueData(data);
        charts.value = new Chart(valueCtx, {
            type: 'line',
            data: {
                labels: valueData.labels,
                datasets: [{
                    label: 'Valor Estimado (€)',
                    data: valueData.values,
                    borderColor: '#1a365d',
                    backgroundColor: 'rgba(26, 54, 93, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1a365d',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Valor: €${window.SPPDUtils.formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + window.SPPDUtils.formatNumber(value);
                            },
                            font: {
                                family: 'Roboto, sans-serif'
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Roboto, sans-serif'
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateCharts(data) {
    if (!chartsInitialized) return;
    
    // Update region chart (previously city)
    if (charts.region) {
        const regionData = getRegionData(data);
        charts.region.data.labels = regionData.labels;
        charts.region.data.datasets[0].data = regionData.values;
        charts.region.update();
    }

    // Update type chart
    if (charts.type) {
        const typeData = getTypeData(data);
        charts.type.data.labels = typeData.labels;
        charts.type.data.datasets[0].data = typeData.values;
        charts.type.update();
    }

    // Update value chart
    if (charts.value) {
        const valueData = getValueData(data);
        charts.value.data.labels = valueData.labels;
        charts.value.data.datasets[0].data = valueData.values;
        charts.value.update();
    }
}

function getRegionData(data) {
    const regionCount = {};
    data.forEach(item => {
        regionCount[item.region] = (regionCount[item.region] || 0) + 1;
    });
    
    return {
        labels: Object.keys(regionCount),
        values: Object.values(regionCount)
    };
}

function getTypeData(data) {
    const typeCount = {};
    data.forEach(item => {
        typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    
    return {
        labels: Object.keys(typeCount),
        values: Object.values(typeCount)
    };
}

function getValueData(data) {
    // Sort by estimated value and take top 10
    const sortedData = data
        .filter(item => item.estimatedValue > 0)
        .sort((a, b) => b.estimatedValue - a.estimatedValue)
        .slice(0, 10);
    
    return {
        labels: sortedData.map(item => window.SPPDUtils.truncateText(item.title, 30)),
        values: sortedData.map(item => item.estimatedValue)
    };
}

// Export functions for use in other modules
window.SPPDCharts = {
    initCharts,
    updateCharts,
    createCharts
}; 