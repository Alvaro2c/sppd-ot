// Filters and data table functionality for SPPD Open Tenders website

let currentData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentSort = { column: null, direction: 'asc' };
let dataInitialized = false;

// Initialize filters and table when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for data to be loaded from JSON file
    if (window.SPPDData && window.SPPDData.isDataLoaded()) {
        initDataTable();
    } else {
        // If data is not loaded yet, wait for it
        const checkDataInterval = setInterval(() => {
            if (window.SPPDData && window.SPPDData.isDataLoaded()) {
                initDataTable();
                clearInterval(checkDataInterval);
            }
        }, 100);
    }
});

function initDataTable() {
    if (!dataInitialized && window.openTendersData) {
        // Transform the data to match the expected UI structure
        currentData = window.SPPDUtils.transformData(window.openTendersData);
        filteredData = [...currentData];
        dataInitialized = true;
        
        // Populate filter dropdowns with actual data
        populateFilterDropdowns();
    }
    
    renderTable();
    renderPagination();
    updateResultsCount();
    
    // Add event listeners to filter controls
    const filterInputs = document.querySelectorAll('#date-range, #value-range, #region, #category');
    const searchInput = document.getElementById('search');
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', window.SPPDUtils.debounce(applyFilters, 300));
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
}

function applyFilters() {
    const dateRange = document.getElementById('date-range').value;
    const valueRange = document.getElementById('value-range').value;
    const region = document.getElementById('region').value;
    const category = document.getElementById('category').value;
    const search = document.getElementById('search').value.toLowerCase();
    
    filteredData = currentData.filter(item => {
        // Date range filter
        if (dateRange && !filterByDateRange(item.updated, dateRange)) {
            return false;
        }
        
        // Value range filter
        if (valueRange && !filterByValueRange(item.estimatedValue, valueRange)) {
            return false;
        }
        
        // Region filter (previously city)
        if (region && item.region !== region) {
            return false;
        }
        
        // Category filter
        if (category && item.category !== category) {
            return false;
        }
        
        // Search filter
        if (search && !searchInItem(item, search)) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderTable();
    renderPagination();
    updateResultsCount();
    
    // Update charts if they exist and analytics section is visible
    const analyticsSection = document.getElementById('analytics-section');
    if (analyticsSection && analyticsSection.style.display !== 'none') {
        if (window.SPPDCharts && window.SPPDCharts.updateCharts) {
            window.SPPDCharts.updateCharts(filteredData);
        }
    }
}

function filterByDateRange(dateString, range) {
    if (!dateString || dateString === '') {
        return false; // Don't include items with no date in date-based filters
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return false; // Don't include items with invalid dates
    }
    const now = new Date();
    
    switch (range) {
        case 'last-30':
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60);
            return date >= thirtyDaysAgo;
        case 'last-90':
            const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60);
            return date >= ninetyDaysAgo;
        case 'last-year':
            const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60);
            return date >= oneYearAgo;
        case '2024':
            return date.getFullYear() === 2024;
        case '2023':
            return date.getFullYear() === 2023;
        default:
            return true;
    }
}

function filterByValueRange(value, range) {
    switch (range) {
        case '0-10000':
            return value >= 0 && value <= 10000;
        case '10000-50000':
            return value > 10000 && value <= 50000;
        case '50000-100000':
            return value > 50000 && value <= 100000;
        case '100000-200000':
            return value > 100000 && value <= 200000;
        case '200000-1000000':
            return value > 200000 && value <= 1000000;
        case '1000000+':
            return value > 1000000;
        default:
            return true;
    }
}

function searchInItem(item, searchTerm) {
    return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.contractingAuthority.toLowerCase().includes(searchTerm) ||
        item.city.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
}

function clearFilters() {
    document.getElementById('date-range').value = '';
    document.getElementById('value-range').value = '';
    document.getElementById('region').value = '';
    document.getElementById('category').value = '';
    document.getElementById('search').value = '';
    
    filteredData = [...currentData];
    currentPage = 1;
    renderTable();
    renderPagination();
    updateResultsCount();
    
    // Update charts if analytics section is visible
    const analyticsSection = document.getElementById('analytics-section');
    if (analyticsSection && analyticsSection.style.display !== 'none') {
        if (window.SPPDCharts && window.SPPDCharts.updateCharts) {
            window.SPPDCharts.updateCharts(filteredData);
        }
    }
}

function renderTable() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${window.SPPDUtils.truncateText(item.title, 60)}</td>
            <td>${item.city}</td>
            <td>${item.region}</td>
            <td>${item.category}</td>
            <td>€${window.SPPDUtils.formatNumber(item.estimatedValue)}</td>
            <td>${window.SPPDUtils.formatDate(item.updated)}</td>
            <td>${window.SPPDUtils.formatDate(item.deadline)}</td>
            <td>${window.SPPDUtils.truncateText(item.contractingAuthority, 40)}</td>
            <td><a href="${item.link}" target="_blank" class="btn btn-sm btn-primary">Ver</a></td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add sort event listeners to table headers
    const headers = document.querySelectorAll('#data-table th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', handleSortClick);
    });
}

function handleSortClick() {
    const column = this.getAttribute('data-sort');
    sortTable(column);
}

function renderPagination() {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (!pageInfo || !prevBtn || !nextBtn) return;
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.addEventListener('click', handlePrevPage);
    nextBtn.addEventListener('click', handleNextPage);
}

function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        renderPagination();
    }
}

function handleNextPage() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        renderPagination();
    }
}

function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const total = currentData.length;
        const filtered = filteredData.length;
        if (total === filtered) {
            resultsCount.textContent = `Mostrando todos los ${total} resultados`;
        } else {
            resultsCount.textContent = `Mostrando ${filtered} de ${total} resultados`;
        }
    }
}

function sortTable(column) {
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    currentSort = { column, direction };
    
    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        // Handle numeric values
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle date values (including updated column)
        if (column === 'updated' || column === 'deadline' || column.includes('Date')) {
            // Handle empty dates by treating them as very old dates
            if (!aVal || aVal === '') aVal = '1900-01-01';
            if (!bVal || bVal === '') bVal = '1900-01-01';
            
            aVal = new Date(aVal);
            bVal = new Date(bVal);
            
            if (isNaN(aVal.getTime())) aVal = new Date('1900-01-01');
            if (isNaN(bVal.getTime())) bVal = new Date('1900-01-01');
            
            return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Handle string values
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    currentPage = 1;
    renderTable();
    renderPagination();
    
    // Update sort indicators
    updateSortIndicators(column, direction);
}

function updateSortIndicators(column, direction) {
    const headers = document.querySelectorAll('#data-table th[data-sort]');
    headers.forEach(header => {
        const icon = header.querySelector('i');
        if (header.getAttribute('data-sort') === column) {
            icon.className = direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        } else {
            icon.className = 'fas fa-sort';
        }
    });
}

function initExportFunctions() {
    const exportCsvBtn = document.getElementById('export-csv');
    const exportJsonBtn = document.getElementById('export-json');
    
    if (exportCsvBtn) {
        exportCsvBtn.removeEventListener('click', exportToCSV);
        exportCsvBtn.addEventListener('click', exportToCSV);
    }
    
    if (exportJsonBtn) {
        exportJsonBtn.removeEventListener('click', exportToJSON);
        exportJsonBtn.addEventListener('click', exportToJSON);
    }
}

function exportToCSV() {
    const headers = [
        'ID Licitación',
        'Título',
        'Ciudad',
        'Región',
        'Categoría',
        'Valor Estimado (€)',
        'Actualizado',
        'Fecha Límite',
        'Autoridad Contratante',
        'Enlace'
    ];
    
    const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
            `"${item.id}"`,
            `"${item.title}"`,
            item.city,
            item.region,
            item.category,
            item.estimatedValue,
            item.updated,
            item.deadline,
            `"${item.contractingAuthority}"`,
            item.link
        ].join(','))
    ].join('\n');
    
    window.SPPDUtils.downloadFile(csvContent, 'licitaciones_abiertas.csv', 'text/csv');
}

function exportToJSON() {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    window.SPPDUtils.downloadFile(jsonContent, 'sppd-data.json', 'application/json');
}

// Add status badge styles
const statusStyles = `
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
    }
    .status-active {
        background-color: #e3f2fd;
        color: #1976d2;
    }
    .status-awarded {
        background-color: #e8f5e8;
        color: #388e3c;
    }
    .status-closed {
        background-color: #fff3e0;
        color: #f57c00;
    }
    .status-cancelled {
        background-color: #ffebee;
        color: #d32f2f;
    }
`;

// Inject status styles
const style = document.createElement('style');
style.textContent = statusStyles;
document.head.appendChild(style);

// Initialize export functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initExportFunctions();
});

// Export functions for use in other modules
window.SPPDFilters = {
    applyFilters,
    clearFilters,
    exportToCSV,
    exportToJSON,
    initDataTable
};

// Populate filter dropdowns with actual data from JSON
function populateFilterDropdowns() {
    // Populate region dropdown
    const regionSelect = document.getElementById('region');
    if (regionSelect && currentData.length > 0) {
        // Keep the first option (default)
        const defaultOption = regionSelect.querySelector('option[value=""]');
        regionSelect.innerHTML = '';
        if (defaultOption) {
            regionSelect.appendChild(defaultOption);
        }
        
        // Add options from actual data
        const uniqueRegions = [...new Set(currentData.map(item => item.region).filter(Boolean))].sort();
        uniqueRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }
    
    // Populate category dropdown
    const categorySelect = document.getElementById('category');
    if (categorySelect && currentData.length > 0) {
        // Keep the first option (default)
        const defaultOption = categorySelect.querySelector('option[value=""]');
        categorySelect.innerHTML = '';
        if (defaultOption) {
            categorySelect.appendChild(defaultOption);
        }
        
        // Add options from actual data
        const uniqueCategories = [...new Set(currentData.map(item => item.category).filter(Boolean))].sort();
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}