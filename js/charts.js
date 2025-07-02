/* global Chart */
// Charts functionality for SPPD Open Tenders website

let charts = {};
let chartsInitialized = false;

// Initialize charts when analytics tab is selected
function initCharts() {
    console.log('initCharts called');
    if (chartsInitialized) {
        console.log('Charts already initialized');
        return;
    }
    
    // Wait for data to be loaded from JSON file
    if (window.SPPDData && window.SPPDData.isDataLoaded() && window.openTendersData) {
        console.log('Data is loaded, creating charts');
        createCharts(transformDataForCharts(window.openTendersData));
        chartsInitialized = true;
    } else {
        console.log('Data not loaded yet, waiting...');
        // If data is not loaded yet, wait for it
        const checkDataInterval = setInterval(() => {
            console.log('Checking for data...');
            if (window.SPPDData && window.SPPDData.isDataLoaded() && window.openTendersData) {
                console.log('Data loaded, creating charts');
                createCharts(transformDataForCharts(window.openTendersData));
                chartsInitialized = true;
                clearInterval(checkDataInterval);
            }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkDataInterval);
            console.error('Timeout waiting for data to load');
        }, 10000);
    }
}

// Transform data to match the expected chart structure
function transformDataForCharts(data) {
    return window.SPPDUtils.transformData(data);
}

function createCharts(data) {
    console.log('Creating charts with data:', data);
    
    // Region distribution map (replacing doughnut chart)
    const regionContainer = document.getElementById('region-chart');
    console.log('Region container:', regionContainer);
    if (regionContainer) {
        const regionData = getRegionData(data);
        console.log('Region data:', regionData);
        createSpainMap(regionContainer, regionData);
    } else {
        console.error('Region container not found!');
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
                onClick: function(event, elements) {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const category = typeData.labels[index];
                        
                        // Set the category filter dropdown to the clicked category
                        const categorySelect = document.getElementById('category');
                        if (categorySelect) {
                            categorySelect.value = category;
                            // Trigger change event if needed
                            const event = new Event('change', { bubbles: true });
                            categorySelect.dispatchEvent(event);
                        }
                        
                        // Switch to the table/tab view
                        switchToDataTab();
                    }
                },
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
                onClick: function(event, elements) {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const tenderTitle = valueData.fullTitles[index];
                        
                        // Find the tender in the data and filter by its title
                        const searchInput = document.getElementById('search');
                        if (searchInput) {
                            searchInput.value = tenderTitle;
                            // Trigger change event if needed
                            const event = new Event('input', { bubbles: true });
                            searchInput.dispatchEvent(event);
                        }
                        
                        // Switch to the table/tab view
                        switchToDataTab();
                    }
                },
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

function createSpainMap(container, regionData) {
    console.log('Creating Spain map with container:', container, 'and data:', regionData);
    
    // Clear the container
    container.innerHTML = '';
    
    // Create SVG container with extra top space
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 650'); // Increased height for top space
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.maxHeight = '450px'; // Increased max height
    
    // Map region names to SVG IDs
    const regionToId = {
        'Andalucía': 'ES-AN',
        'Aragón': 'ES-AR',
        'Asturias': 'ES-AS',
        'Cantabria': 'ES-CB',
        'Castilla y León': 'ES-CL',
        'Castilla-La Mancha': 'ES-CM',
        'Canarias': 'ES-CN',
        'Cataluña': 'ES-CT',
        'Extremadura': 'ES-EX',
        'Galicia': 'ES-GA',
        'Islas Baleares': 'ES-IB',
        'La Rioja': 'ES-RI',
        'Madrid': 'ES-MD',
        'Murcia': 'ES-MC',
        'Navarra': 'ES-NC',
        'País Vasco': 'ES-PV',
        'Valencia': 'ES-VC'
    };
    
    console.log('Loading SVG map from images/spain_map.svg');
    
    // Load the SVG map
    fetch('images/spain_map.svg')
        .then(response => {
            console.log('SVG fetch response:', response);
            return response.text();
        })
        .then(svgContent => {
            console.log('SVG content loaded, length:', svgContent.length);
            // Create a temporary div to parse the SVG
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgContent;
            const mapSvg = tempDiv.querySelector('svg');
            
            console.log('Parsed SVG element:', mapSvg);
            
            if (mapSvg) {
                // Copy the SVG content and move it down by 50px to create top space
                const mapContent = mapSvg.innerHTML;
                const transformedContent = mapContent.replace(/transform="([^"]*)"/g, (match, transform) => {
                    // Add translation to move content down
                    const newTransform = transform + ' translate(0, 50)';
                    return `transform="${newTransform}"`;
                });
                svg.innerHTML = transformedContent;
                
                // Calculate max value for color scaling
                const maxValue = Math.max(...Object.values(regionData.values));
                
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(26, 54, 93, 0.95);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-family: 'Roboto', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    pointer-events: none;
                    z-index: 1000;
                    display: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    white-space: nowrap;
                `;
                container.appendChild(tooltip);
                
                // Apply styling to regions
                Object.keys(regionToId).forEach(regionName => {
                    const regionId = regionToId[regionName];
                    const path = svg.querySelector(`#${regionId}`);
                    
                    if (path) {
                        const count = regionData.values[regionData.labels.indexOf(regionName)] || 0;
                        const intensity = maxValue > 0 ? count / maxValue : 0;
                        
                        // Apply styling
                        path.setAttribute('fill', `rgba(26, 54, 93, ${0.2 + intensity * 0.8})`);
                        path.setAttribute('stroke', '#1a365d');
                        path.setAttribute('stroke-width', '2');
                        path.setAttribute('data-region', regionName);
                        path.setAttribute('data-count', count);
                        path.style.cursor = 'pointer';
                        
                        // Add hover effects with tooltip
                        path.addEventListener('mouseenter', function(e) {
                            this.setAttribute('fill', `rgba(26, 54, 93, ${0.8 + intensity * 0.2})`);
                            this.setAttribute('stroke-width', '3');
                            
                            // Show tooltip
                            const rect = container.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            
                            tooltip.style.left = (x + 10) + 'px';
                            tooltip.style.top = (y - 30) + 'px';
                            tooltip.style.display = 'block';
                            tooltip.innerHTML = `
                                <strong>${regionName}</strong><br>
                                Licitaciones: ${count}
                            `;
                        });
                        
                        path.addEventListener('mousemove', function(e) {
                            const rect = container.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            
                            tooltip.style.left = (x + 10) + 'px';
                            tooltip.style.top = (y - 30) + 'px';
                        });
                        
                        path.addEventListener('mouseleave', function() {
                            this.setAttribute('fill', `rgba(26, 54, 93, ${0.2 + intensity * 0.8})`);
                            this.setAttribute('stroke-width', '2');
                            
                            // Hide tooltip
                            tooltip.style.display = 'none';
                        });

                        // Add click event
                        path.addEventListener('click', function() {
                            // Set the region filter dropdown to the clicked region
                            const regionSelect = document.getElementById('region');
                            if (regionSelect) {
                                regionSelect.value = regionName;
                                // Trigger change event if needed
                                const event = new Event('change', { bubbles: true });
                                regionSelect.dispatchEvent(event);
                            }
                            // Switch to the table/tab view
                            switchToDataTab();
                        });
                    }
                });
                
                // Add Melilla and Ceuta as dots at the bottom center
                const autonomousCities = [
                    { name: 'Ceuta', cx: 380, cy: 580 },
                    { name: 'Melilla', cx: 420, cy: 580 }
                ];
                
                autonomousCities.forEach(city => {
                    const count = regionData.values[regionData.labels.indexOf(city.name)] || 0;
                    const intensity = maxValue > 0 ? count / maxValue : 0;
                    const radius = 8 + (intensity * 4); // Size based on intensity
                    
                    // Create circle element
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', city.cx);
                    circle.setAttribute('cy', city.cy);
                    circle.setAttribute('r', radius);
                    circle.setAttribute('fill', `rgba(26, 54, 93, ${0.2 + intensity * 0.8})`);
                    circle.setAttribute('stroke', '#1a365d');
                    circle.setAttribute('stroke-width', '2');
                    circle.setAttribute('data-region', city.name);
                    circle.setAttribute('data-count', count);
                    circle.style.cursor = 'pointer';
                    
                    // Add hover effects with tooltip
                    circle.addEventListener('mouseenter', function(e) {
                        this.setAttribute('fill', `rgba(26, 54, 93, ${0.8 + intensity * 0.2})`);
                        this.setAttribute('stroke-width', '3');
                        
                        // Show tooltip
                        const rect = container.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        tooltip.style.left = (x + 10) + 'px';
                        tooltip.style.top = (y - 30) + 'px';
                        tooltip.style.display = 'block';
                        tooltip.innerHTML = `
                            <strong>${city.name}</strong><br>
                            Licitaciones: ${count}
                        `;
                    });
                    
                    circle.addEventListener('mousemove', function(e) {
                        const rect = container.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        tooltip.style.left = (x + 10) + 'px';
                        tooltip.style.top = (y - 30) + 'px';
                    });
                    
                    circle.addEventListener('mouseleave', function() {
                        this.setAttribute('fill', `rgba(26, 54, 93, ${0.2 + intensity * 0.8})`);
                        this.setAttribute('stroke-width', '2');
                        
                        // Hide tooltip
                        tooltip.style.display = 'none';
                    });

                    // Add click event
                    circle.addEventListener('click', function() {
                        // Set the region filter dropdown to the clicked city
                        const regionSelect = document.getElementById('region');
                        if (regionSelect) {
                            regionSelect.value = city.name;
                            // Trigger change event if needed
                            const event = new Event('change', { bubbles: true });
                            regionSelect.dispatchEvent(event);
                        }
                        // Switch to the table/tab view
                        switchToDataTab();
                    });
                    
                    svg.appendChild(circle);
                });
                
                // Add legend with ranges
                const legend = createMapLegend(maxValue);
                svg.appendChild(legend);
                
                container.appendChild(svg);
                
                // Store reference for updates
                charts.regionMap = { svg, regionData, regionToId };
            }
        })
        .catch(error => {
            console.error('Error loading Spain map:', error);
            // Fallback to simple text if map fails to load
            container.innerHTML = '<p>Error loading map. Please check the SVG file.</p>';
        });
}

function createMapLegend(maxValue) {
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', 'translate(650, 100)');
    
    // Legend title
    const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    legendTitle.setAttribute('x', '0');
    legendTitle.setAttribute('y', '0');
    legendTitle.setAttribute('font-family', 'Roboto, sans-serif');
    legendTitle.setAttribute('font-size', '12');
    legendTitle.setAttribute('font-weight', 'bold');
    legendTitle.setAttribute('fill', '#1a365d');
    legendTitle.textContent = 'Número de Licitaciones';
    legendGroup.appendChild(legendTitle);
    
    // Calculate ranges
    const range1 = Math.ceil(maxValue * 0.75);
    const range2 = Math.ceil(maxValue * 0.5);
    const range3 = Math.ceil(maxValue * 0.25);
    
    // Legend items with ranges
    const legendItems = [
        { value: maxValue, label: `${range1 + 1}-${maxValue}` },
        { value: maxValue * 0.75, label: `${range2 + 1}-${range1}` },
        { value: maxValue * 0.5, label: `${range3 + 1}-${range2}` },
        { value: maxValue * 0.25, label: `1-${range3}` },
        { value: 0, label: '0' }
    ];
    
    legendItems.forEach((item, index) => {
        const y = 20 + index * 20;
        const intensity = maxValue > 0 ? item.value / maxValue : 0;
        
        // Color box
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', y - 8);
        rect.setAttribute('width', '15');
        rect.setAttribute('height', '15');
        rect.setAttribute('fill', `rgba(26, 54, 93, ${0.2 + intensity * 0.8})`);
        rect.setAttribute('stroke', '#1a365d');
        rect.setAttribute('stroke-width', '1');
        legendGroup.appendChild(rect);
        
        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '20');
        label.setAttribute('y', y);
        label.setAttribute('font-family', 'Roboto, sans-serif');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#1a365d');
        label.textContent = item.label;
        legendGroup.appendChild(label);
    });
    
    return legendGroup;
}

function updateCharts(data) {
    if (!chartsInitialized) return;
    
    // Update region map
    if (charts.regionMap) {
        const regionData = getRegionData(data);
        charts.regionMap.regionData = regionData;
        const regionContainer = document.getElementById('region-chart');
        if (regionContainer) {
            createSpainMap(regionContainer, regionData);
        }
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
    
    // Sort by count in descending order (bigger to smaller)
    const sortedEntries = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
    
    return {
        labels: sortedEntries.map(entry => entry[0]),
        values: sortedEntries.map(entry => entry[1])
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
        fullTitles: sortedData.map(item => item.title), // Store full titles for click functionality
        values: sortedData.map(item => item.estimatedValue)
    };
}

// Export functions for use in other modules
window.SPPDCharts = {
    initCharts,
    updateCharts,
    createCharts,
    createSpainMap
};

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            const dataSection = document.getElementById('data-section');
            const analyticsSection = document.getElementById('analytics-section');
            if (target === 'data-section') {
                if (dataSection) dataSection.style.display = '';
                if (analyticsSection) analyticsSection.style.display = 'none';
            } else if (target === 'analytics-section') {
                if (analyticsSection) analyticsSection.style.display = '';
                if (dataSection) dataSection.style.display = 'none';
                // Reset filters when switching to analytics
                resetFiltersForAnalytics();
            }
        });
    });
});

// Function to reset filters when switching to analytics tab
function resetFiltersForAnalytics() {
    // Reset all filter inputs
    const dateRange = document.getElementById('date-range');
    const valueRange = document.getElementById('value-range');
    const region = document.getElementById('region');
    const category = document.getElementById('category');
    const search = document.getElementById('search');
    
    if (dateRange) dateRange.value = '';
    if (valueRange) valueRange.value = '';
    if (region) region.value = '';
    if (category) category.value = '';
    if (search) search.value = '';
    
    // Reset filtered data to show all data in charts
    if (window.SPPDData && window.SPPDData.isDataLoaded()) {
        const allData = window.SPPDUtils.transformData(window.openTendersData);
        if (window.SPPDCharts && window.SPPDCharts.updateCharts) {
            window.SPPDCharts.updateCharts(allData);
        }
    }
}

function switchToDataTab() {
    // Switch to data tab
    const dataSection = document.getElementById('data-section');
    const analyticsSection = document.getElementById('analytics-section');
    if (dataSection && analyticsSection) {
        dataSection.style.display = '';
        analyticsSection.style.display = 'none';
        dataSection.classList.add('active');
        analyticsSection.classList.remove('active');
    }
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === 'data-section') {
            btn.classList.add('active');
        } else if (btn.getAttribute('data-tab') === 'analytics-section') {
            btn.classList.remove('active');
        }
    });
    
    // Optionally scroll to the table
    const table = document.getElementById('data-table');
    if (table) {
        table.scrollIntoView({ behavior: 'smooth' });
    }
} 