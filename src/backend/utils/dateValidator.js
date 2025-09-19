// Date Validation Utility

/**
 * Validates if a string is a valid date
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if valid date, false otherwise
 */
function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const date = new Date(dateString);
  return date !== 'Invalid Date' && !isNaN(date);
}

/**
 * Validates date parameters and throws appropriate error
 * @param {string} dateString - The date string to validate
 * @param {string} paramName - The name of the parameter for error messaging
 * @throws {Error} - Throws error with appropriate message if invalid
 */
function validateDate(dateString, paramName) {
  if (!dateString || typeof dateString !== 'string') {
    throw new Error(`Invalid date parameter: ${paramName} is required and must be a string`);
  }
  
  if (!isValidDate(dateString)) {
    throw new Error(`Invalid date format for ${paramName}. Please use a valid date format (e.g., YYYY-MM-DD or ISO 8601)`);
  }
}

module.exports = {
  isValidDate,
  validateDate
};