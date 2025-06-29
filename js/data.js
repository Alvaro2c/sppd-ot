// Data loading functionality for SPPD Open Tenders website

let openTendersData = [];
let regions = [];
let categories = [];
let dataLoaded = false;

// Load data from JSON file
async function loadDataFromJSON() {
    try {
        const response = await fetch('data/open_tenders.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        // Load data as-is from the JSON structure
        openTendersData = jsonData.data || [];
        
        // Extract unique values for filters from the original data
        regions = [...new Set(openTendersData.map(item => 
            window.RegionMapping ? window.RegionMapping.getRegionFromPostalZone(item.PostalZone) : 'Otros'
        ).filter(Boolean))].sort();
        categories = [...new Set(openTendersData.map(item => item.ProjectTypeCode).filter(Boolean))].sort();
        
        dataLoaded = true;
        
        // Export data for use in other modules
        window.openTendersData = openTendersData;
        window.regions = regions;
        window.categories = categories;
        
        // Initialize data-dependent components
        if (window.SPPDFilters && window.SPPDFilters.initDataTable) {
            window.SPPDFilters.initDataTable();
        }
        
        if (window.SPPDMain && window.SPPDMain.initPreviewData) {
            window.SPPDMain.initPreviewData();
        }
        
        console.log('Data loaded successfully:', openTendersData.length, 'records');
        
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
        openTendersData = [];
        regions = [];
        categories = [];
        
        // Export empty data
        window.openTendersData = openTendersData;
        window.regions = regions;
        window.categories = categories;
    }
}

// Initialize data loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromJSON();
});

// Export functions for use in other modules
window.SPPDData = {
    loadDataFromJSON,
    getData: () => openTendersData,
    getRegions: () => regions,
    getCategories: () => categories,
    isDataLoaded: () => dataLoaded
}; 