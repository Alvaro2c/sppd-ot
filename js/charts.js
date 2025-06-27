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
    return data.map(item => ({
        id: item.ID || '',
        title: item.title || '',
        description: item.title || '',
        publicationDate: item.updated ? new Date(item.updated).toISOString().split('T')[0] : '',
        deadline: item.ProcessEndDate || '',
        estimatedValue: parseFloat(item.EstimatedAmount || item.TotalAmount || 0),
        city: item.City || '',
        category: item.CPVCode || '',
        contractingAuthority: item.ContractingParty || '',
        link: item.link || ''
    }));
}

// Helper function to map status codes to readable status
function getStatusFromCode(statusCode) {
    const statusMap = {
        'PUB': 'Published',
        'AWD': 'Awarded',
        'CAN': 'Cancelled',
        'CLO': 'Closed',
        'ACT': 'Active',
        'SUS': 'Suspended'
    };
    
    return statusMap[statusCode] || 'Unknown';
}

function createCharts(data) {
    // City distribution chart (previously region)
    const cityCtx = document.getElementById('region-chart');
    if (cityCtx) {
        const cityData = getCityData(data);
        charts.city = new Chart(cityCtx, {
            type: 'doughnut',
            data: {
                labels: cityData.labels,
                datasets: [{
                    data: cityData.values,
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

    // Category distribution chart
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx) {
        const categoryData = getCategoryData(data);
        charts.category = new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    label: 'Número de Licitaciones',
                    data: categoryData.values,
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
                                return `Valor: €${formatNumber(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + formatNumber(value);
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
    
    // Update city chart (previously region)
    if (charts.city) {
        const cityData = getCityData(data);
        charts.city.data.labels = cityData.labels;
        charts.city.data.datasets[0].data = cityData.values;
        charts.city.update();
    }

    // Update category chart
    if (charts.category) {
        const categoryData = getCategoryData(data);
        charts.category.data.labels = categoryData.labels;
        charts.category.data.datasets[0].data = categoryData.values;
        charts.category.update();
    }

    // Update value chart
    if (charts.value) {
        const valueData = getValueData(data);
        charts.value.data.labels = valueData.labels;
        charts.value.data.datasets[0].data = valueData.values;
        charts.value.update();
    }
}

function getCityData(data) {
    const cityCount = {};
    data.forEach(item => {
        cityCount[item.city] = (cityCount[item.city] || 0) + 1;
    });
    
    return {
        labels: Object.keys(cityCount),
        values: Object.values(cityCount)
    };
}

function getCategoryData(data) {
    const categoryCount = {};
    data.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    return {
        labels: Object.keys(categoryCount),
        values: Object.values(categoryCount)
    };
}

function getValueData(data) {
    // Sort by estimated value and take top 10
    const sortedData = data
        .filter(item => item.estimatedValue > 0)
        .sort((a, b) => b.estimatedValue - a.estimatedValue)
        .slice(0, 10);
    
    return {
        labels: sortedData.map(item => truncateText(item.title, 30)),
        values: sortedData.map(item => item.estimatedValue)
    };
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Export functions for use in other modules
window.SPPDCharts = {
    initCharts,
    updateCharts,
    createCharts
}; 