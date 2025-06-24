// Charts functionality for SPPD Open Tenders website

let charts = {};
let chartsInitialized = false;

// Initialize charts when analytics tab is selected
function initCharts() {
    if (chartsInitialized) return;
    
    // Wait for data to be loaded from JSON file
    if (window.SPPDData && window.SPPDData.isDataLoaded() && window.sampleData) {
        createCharts(window.sampleData);
        chartsInitialized = true;
    } else {
        // If data is not loaded yet, wait for it
        const checkDataInterval = setInterval(() => {
            if (window.SPPDData && window.SPPDData.isDataLoaded() && window.sampleData) {
                createCharts(window.sampleData);
                chartsInitialized = true;
                clearInterval(checkDataInterval);
            }
        }, 100);
    }
}

function createCharts(data) {
    // Region distribution chart
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

    // Status distribution chart
    const statusCtx = document.getElementById('status-chart');
    if (statusCtx) {
        const statusData = getStatusData(data);
        charts.status = new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: statusData.labels,
                datasets: [{
                    data: statusData.values,
                    backgroundColor: [
                        '#4caf50', // Active - Green
                        '#2196f3', // Awarded - Blue
                        '#ff9800', // Closed - Orange
                        '#f44336'  // Cancelled - Red
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
}

function updateCharts(data) {
    if (!chartsInitialized) return;
    
    // Update region chart
    if (charts.region) {
        const regionData = getRegionData(data);
        charts.region.data.labels = regionData.labels;
        charts.region.data.datasets[0].data = regionData.values;
        charts.region.update();
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

    // Update status chart
    if (charts.status) {
        const statusData = getStatusData(data);
        charts.status.data.labels = statusData.labels;
        charts.status.data.datasets[0].data = statusData.values;
        charts.status.update();
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

function getStatusData(data) {
    const statusCount = {};
    data.forEach(item => {
        statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    
    return {
        labels: Object.keys(statusCount),
        values: Object.values(statusCount)
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