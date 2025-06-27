// Main functionality for SPPD Open Tenders website

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initTabNavigation();
    initFilterToggle();
    initScrollEffects();
    
    // Initialize preview data when data is loaded
    if (window.SPPDData && window.SPPDData.isDataLoaded()) {
        initPreviewData();
    } else {
        // Wait for data to be loaded
        const checkDataInterval = setInterval(() => {
            if (window.SPPDData && window.SPPDData.isDataLoaded()) {
                initPreviewData();
                clearInterval(checkDataInterval);
            }
        }, 100);
    }
});

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-menu');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
}

// Tab navigation for data page
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and target content
            this.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Initialize charts if analytics tab is selected
                if (target === 'analytics-section' && window.SPPDCharts) {
                    window.SPPDCharts.initCharts();
                }
            }
        });
    });
}

// Filter toggle functionality
function initFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterSection = document.getElementById('filter-section');
    
    if (filterToggle && filterSection) {
        filterToggle.addEventListener('click', function() {
            const isVisible = filterSection.style.display !== 'none';
            filterSection.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Mostrar Filtros' : 'Ocultar Filtros';
        });
    }
}

// Scroll effects for smooth animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize preview data on home page
function initPreviewData() {
    if (!window.openTendersData || window.openTendersData.length === 0) return;
    
    const previewContainer = document.getElementById('preview-data');
    if (!previewContainer) return;
    
    // Transform data to match expected structure
    const transformedData = window.openTendersData.map(item => ({
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
    
    // Get latest 3 tenders
    const latestTenders = transformedData
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
        .slice(0, 3);
    
    previewContainer.innerHTML = '';
    
    latestTenders.forEach(tender => {
        const tenderCard = document.createElement('div');
        tenderCard.className = 'tender-card';
        tenderCard.innerHTML = `
            <h4>${tender.title}</h4>
            <p><strong>Ciudad:</strong> ${tender.city}</p>
            <p><strong>Categoría:</strong> ${tender.category}</p>
            <p><strong>Valor Estimado:</strong> €${formatNumber(tender.estimatedValue)}</p>
            <a href="data.html" class="btn btn-primary">Ver Detalles</a>
        `;
        previewContainer.appendChild(tenderCard);
    });
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

// Utility function for number formatting
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

// Export functions for use in other modules
window.SPPDUtils = {
    initPreviewData,
    initScrollEffects
}; 