// Spanish Zip Code to Autonomous Community Mapping
// Based on Spanish postal code system (first two digits indicate province)

const zipCodeToRegion = {
    // Andalucía
    '04': 'Andalucía', // Almería
    '11': 'Andalucía', // Cádiz
    '14': 'Andalucía', // Córdoba
    '18': 'Andalucía', // Granada
    '21': 'Andalucía', // Huelva
    '23': 'Andalucía', // Jaén
    '29': 'Andalucía', // Málaga
    '41': 'Andalucía', // Sevilla
    
    // Aragón
    '22': 'Aragón', // Huesca
    '44': 'Aragón', // Teruel
    '50': 'Aragón', // Zaragoza
    
    // Asturias
    '33': 'Asturias', // Asturias
    
    // Cantabria
    '39': 'Cantabria', // Cantabria
    
    // Castilla-La Mancha
    '02': 'Castilla-La Mancha', // Albacete
    '13': 'Castilla-La Mancha', // Ciudad Real
    '16': 'Castilla-La Mancha', // Cuenca
    '19': 'Castilla-La Mancha', // Guadalajara
    '45': 'Castilla-La Mancha', // Toledo
    
    // Castilla y León
    '05': 'Castilla y León', // Ávila
    '09': 'Castilla y León', // Burgos
    '24': 'Castilla y León', // León
    '34': 'Castilla y León', // Palencia
    '37': 'Castilla y León', // Salamanca
    '40': 'Castilla y León', // Segovia
    '42': 'Castilla y León', // Soria
    '47': 'Castilla y León', // Valladolid
    '49': 'Castilla y León', // Zamora
    
    // Cataluña
    '08': 'Cataluña', // Barcelona
    '17': 'Cataluña', // Girona
    '25': 'Cataluña', // Lleida
    '43': 'Cataluña', // Tarragona
    
    // Ceuta
    '51': 'Ceuta', // Ceuta
    
    // Extremadura
    '06': 'Extremadura', // Badajoz
    '10': 'Extremadura', // Cáceres
    
    // Galicia
    '15': 'Galicia', // A Coruña
    '27': 'Galicia', // Lugo
    '32': 'Galicia', // Ourense
    '36': 'Galicia', // Pontevedra
    
    // Islas Baleares
    '07': 'Islas Baleares', // Islas Baleares
    
    // Islas Canarias
    '35': 'Canarias', // Las Palmas
    '38': 'Canarias', // Santa Cruz de Tenerife
    
    // La Rioja
    '26': 'La Rioja', // La Rioja
    
    // Madrid
    '28': 'Madrid', // Madrid
    
    // Melilla
    '52': 'Melilla', // Melilla
    
    // Murcia
    '30': 'Murcia', // Murcia
    
    // Navarra
    '31': 'Navarra', // Navarra
    
    // País Vasco
    '01': 'País Vasco', // Álava
    '20': 'País Vasco', // Guipúzcoa
    '48': 'País Vasco', // Vizcaya
    
    // Valencia
    '03': 'Valencia', // Alicante
    '12': 'Valencia', // Castellón
    '46': 'Valencia'  // Valencia
};

// Function to get region from zip code
function getRegionFromZipCode(zipCode) {
    if (!zipCode || typeof zipCode !== 'string') {
        return 'Desconocida';
    }
    
    // Extract first two digits
    const firstTwoDigits = zipCode.substring(0, 2);
    return zipCodeToRegion[firstTwoDigits] || 'Desconocida';
}

// Function to get all available regions
function getAvailableRegions() {
    return [...new Set(Object.values(zipCodeToRegion))].sort();
}

// Export functions
window.RegionMapping = {
    getRegionFromZipCode,
    getAvailableRegions,
    zipCodeToRegion
}; 