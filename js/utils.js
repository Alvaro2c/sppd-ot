// Utility functions for SPPD Open Tenders website
// Common functions used across multiple modules

/**
 * Truncate text to a specified maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Format number using Spanish locale
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Format date string to Spanish locale
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string or '-' for invalid dates
 */
function formatDate(dateString) {
    if (!dateString || dateString === '') {
        return '-';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '-';
    }
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Debounce function to limit function execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Download file with specified content and filename
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Transform data to match the expected UI structure
 * @param {Array} data - Raw data array
 * @returns {Array} - Transformed data array
 */
function transformData(data) {
    return data.map(item => ({
        id: item.ID || '',
        title: item.title || '',
        description: item.title || '', // Using title as description since description field doesn't exist
        updated: item.updated && item.updated > 0 ? new Date(item.updated * 1000).toISOString().split('T')[0] : '',
        deadline: item.ProcessEndDate || '',
        estimatedValue: parseFloat(item.EstimatedAmount || item.TotalAmount || 0),
        city: item.City || '',
        region: window.RegionMapping ? window.RegionMapping.getRegionFromZipCode(item.ZipCode) : 'Otros',
        category: item.CPVCode || '',
        type: item.ProjectTypeCode || '',
        contractingAuthority: item.ContractingParty || '',
        link: item.link || ''
    }));
}

// Export functions for use in other modules
window.SPPDUtils = {
    truncateText,
    formatNumber,
    formatDate,
    debounce,
    downloadFile,
    transformData
}; 