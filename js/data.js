// Data loading functionality for SPPD Open Tenders website

let sampleData = [];
let regions = [];
let categories = [];
let statuses = [];
let dataLoaded = false;

// Load data from JSON file
async function loadDataFromJSON() {
    try {
        const response = await fetch('data/sample-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        // Extract data from JSON structure
        sampleData = jsonData.data || [];
        
        // Extract unique values for filters
        regions = [...new Set(sampleData.map(item => item.region))].sort();
        categories = [...new Set(sampleData.map(item => item.category))].sort();
        statuses = [...new Set(sampleData.map(item => item.status))].sort();
        
        dataLoaded = true;
        
        // Export data for use in other modules
        window.sampleData = sampleData;
        window.regions = regions;
        window.categories = categories;
        window.statuses = statuses;
        
        // Initialize data-dependent components
        if (window.SPPDFilters && window.SPPDFilters.initDataTable) {
            window.SPPDFilters.initDataTable();
        }
        
        if (window.SPPDUtils && window.SPPDUtils.initPreviewData) {
            window.SPPDUtils.initPreviewData();
        }
        
        console.log('Data loaded successfully:', sampleData.length, 'records');
        
    } catch (error) {
        console.error('Error loading data from JSON:', error);
        
        // Display error message in Spanish
        const errorMessage = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde o contacte con el administrador del sistema.';
        
        // Show error message in the UI if there's a container for it
        const errorContainer = document.getElementById('error-message') || document.querySelector('.error-container');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <strong>Error:</strong> ${errorMessage}
                </div>
            `;
            errorContainer.style.display = 'block';
        } else {
            // Fallback: show alert if no container found
            alert(errorMessage);
        }
        
        // Set data as not loaded
        dataLoaded = false;
        sampleData = [];
        regions = [];
        categories = [];
        statuses = [];
        
        // Export empty data
        window.sampleData = sampleData;
        window.regions = regions;
        window.categories = categories;
        window.statuses = statuses;
    }
}

// Initialize data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromJSON();
});

// Export functions for use in other modules
window.SPPDData = {
    loadDataFromJSON,
    getData: () => sampleData,
    getRegions: () => regions,
    getCategories: () => categories,
    getStatuses: () => statuses,
    isDataLoaded: () => dataLoaded
}; 