#!/usr/bin/env node

/**
 * Data Validation Script for SPPD-OT
 * Validates the structure and content of sample-data.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_FILE = path.join(__dirname, '../data/sample-data.json');
const REQUIRED_FIELDS = [
  'id', 'title', 'description', 'publicationDate', 'deadline', 
  'estimatedValue', 'region', 'category', 'contractingAuthority', 'status'
];

// Validation functions
function validateDataStructure(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Data must be an object');
  }
  
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error('Data must contain a "data" array');
  }
  
  if (data.data.length === 0) {
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
  if (typeof record.id !== 'string' || record.id.trim() === '') {
    throw new Error(`Invalid id in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.title !== 'string' || record.title.trim() === '') {
    throw new Error(`Invalid title in item ${index}: must be a non-empty string`);
  }
  
  if (typeof record.description !== 'string' || record.description.trim() === '') {
    throw new Error(`Invalid description in item ${index}: must be a non-empty string`);
  }
  
  // Validate date formats (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(record.publicationDate)) {
    throw new Error(`Invalid publicationDate format in item ${index}: must be YYYY-MM-DD`);
  }
  
  if (!dateRegex.test(record.deadline)) {
    throw new Error(`Invalid deadline format in item ${index}: must be YYYY-MM-DD`);
  }
  
  // Validate dates are logical
  const pubDate = new Date(record.publicationDate);
  const deadline = new Date(record.deadline);
  
  if (isNaN(pubDate.getTime())) {
    throw new Error(`Invalid publicationDate in item ${index}: not a valid date`);
  }
  
  if (isNaN(deadline.getTime())) {
    throw new Error(`Invalid deadline in item ${index}: not a valid date`);
  }
  
  if (deadline <= pubDate) {
    throw new Error(`Invalid dates in item ${index}: deadline must be after publication date`);
  }
  
  // Validate numeric fields
  if (typeof record.estimatedValue !== 'number' || record.estimatedValue < 0) {
    throw new Error(`Invalid estimatedValue in item ${index}: must be a positive number`);
  }
  
  if (typeof record.bidders !== 'number' || record.bidders < 0) {
    throw new Error(`Invalid bidders in item ${index}: must be a non-negative number`);
  }
  
  // Validate string fields
  const stringFields = ['region', 'category', 'contractingAuthority', 'status'];
  stringFields.forEach(field => {
    if (typeof record[field] !== 'string' || record[field].trim() === '') {
      throw new Error(`Invalid ${field} in item ${index}: must be a non-empty string`);
    }
  });
  
  // Validate optional fields if present
  if (record.awardDate !== null && record.awardDate !== undefined) {
    if (!dateRegex.test(record.awardDate)) {
      throw new Error(`Invalid awardDate format in item ${index}: must be YYYY-MM-DD or null`);
    }
  }
  
  if (record.awardedValue !== null && record.awardedValue !== undefined) {
    if (typeof record.awardedValue !== 'number' || record.awardedValue < 0) {
      throw new Error(`Invalid awardedValue in item ${index}: must be a positive number or null`);
    }
  }
  
  if (record.winnerCompany !== null && record.winnerCompany !== undefined) {
    if (typeof record.winnerCompany !== 'string' || record.winnerCompany.trim() === '') {
      throw new Error(`Invalid winnerCompany in item ${index}: must be a non-empty string or null`);
    }
  }
  
  if (record.contactInfo !== null && record.contactInfo !== undefined) {
    if (typeof record.contactInfo !== 'string' || record.contactInfo.trim() === '') {
      throw new Error(`Invalid contactInfo in item ${index}: must be a non-empty string or null`);
    }
  }
  
  return true;
}

function validateDataContent(data) {
  // Check for duplicate IDs
  const ids = data.data.map(item => item.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    throw new Error('Duplicate IDs found in data');
  }
  
  // Validate each record
  data.data.forEach((record, index) => {
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
    console.log(`- Total records: ${data.data.length}`);
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