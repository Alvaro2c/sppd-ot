#!/usr/bin/env node

/**
 * Data Validation Script
 * Validates the structure and content of open_tenders.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_FILE = path.join(__dirname, '../data/open_tenders.json');
const REQUIRED_FIELDS = [
  'ID', 'title', 'ContractingParty', 'City', 'Country', 
  'EstimatedAmount', 'TotalAmount', 'StatusCode', 'ProcessEndDate'
];

// Validation functions
function validateDataStructure(data) {
  if (!data || !Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }
  
  return true;
}

function validateRecord(record, index) {
  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!(field in record)) {
      throw new Error(`Missing required field "${field}" in item ${index}`);
    }
  });
  
  // Validate field types and formats
  if (typeof record.ID !== 'string' || record.ID.trim() === '') {
    throw new Error(`Invalid ID in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.title !== 'string' || record.title.trim() === '') {
    throw new Error(`Invalid title in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.ContractingParty !== 'string' || record.ContractingParty.trim() === '') {
    throw new Error(`Invalid ContractingParty in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.City !== 'string' || record.City.trim() === '') {
    throw new Error(`Invalid City in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.Country !== 'string' || record.Country.trim() === '') {
    throw new Error(`Invalid Country in item ${index}: must be a non-empty string`);
  }
  
  // Validate numeric fields
  if (record.EstimatedAmount !== null && record.EstimatedAmount !== undefined) {
    const estimatedAmount = parseFloat(record.EstimatedAmount);
    if (isNaN(estimatedAmount) || estimatedAmount < 0) {
      throw new Error(`Invalid EstimatedAmount in item ${index}: must be a positive number or null`);
    }
  }
  
  if (record.TotalAmount !== null && record.TotalAmount !== undefined) {
    const totalAmount = parseFloat(record.TotalAmount);
    if (isNaN(totalAmount) || totalAmount < 0) {
      throw new Error(`Invalid TotalAmount in item ${index}: must be a positive number or null`);
    }
  }
  
  // Validate status code
  if (typeof record.StatusCode !== 'string' || record.StatusCode.trim() === '') {
    throw new Error(`Invalid StatusCode in item ${index}: must be a non-empty string`);
  }
  
  // Validate date format if present
  if (record.ProcessEndDate !== null && record.ProcessEndDate !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(record.ProcessEndDate)) {
      throw new Error(`Invalid ProcessEndDate format in item ${index}: must be YYYY-MM-DD or null`);
    }
  }
  
  // Validate optional fields if present
  if (record.link !== null && record.link !== undefined) {
    if (typeof record.link !== 'string' || record.link.trim() === '') {
      throw new Error(`Invalid link in item ${index}: must be a non-empty string or null`);
    }
  }
  
  if (record.updated !== null && record.updated !== undefined) {
    if (typeof record.updated !== 'number' || record.updated <= 0) {
      throw new Error(`Invalid updated in item ${index}: must be a positive number or null`);
    }
  }
  
  return true;
}

function validateDataContent(data) {
  // Check for duplicate IDs
  const ids = data.map(item => item.ID);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    throw new Error('Duplicate IDs found in data');
  }
  
  // Validate each record
  data.forEach((record, index) => {
    validateRecord(record, index);
  });
  
  return true;
}

// Main validation function
function validateData() {
  try {
    console.log('🔍 Starting data validation...');
    
    // Check if file exists
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error(`Data file not found: ${DATA_FILE}`);
    }
    
    // Read and parse JSON
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Validate structure
    validateDataStructure(data);
    console.log('✅ Data structure validation passed');
    
    // Validate content
    validateDataContent(data);
    console.log('✅ Data content validation passed');
    
    // Summary
    console.log(`\n📊 Validation Summary:`);
    console.log(`- Total records: ${data.length}`);
    console.log(`- Required fields: ${REQUIRED_FIELDS.length}`);
    console.log(`- Data integrity: ✅ Valid`);
    
    console.log('\n🎉 All validations passed successfully!');
    return true;
    
  } catch (error) {
    console.error('\n❌ Data validation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validateData();
}

module.exports = { validateData, validateDataStructure, validateDataContent, validateRecord }; 