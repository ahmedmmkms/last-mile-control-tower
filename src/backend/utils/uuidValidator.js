// UUID Validation Utility

// Regular expression for validating UUID v4 format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID v4
 * @param {string} uuid - The string to validate
 * @returns {boolean} - True if valid UUID, false otherwise
 */
function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  return UUID_REGEX.test(uuid);
}

/**
 * Validates UUID and throws appropriate error
 * @param {string} uuid - The UUID to validate
 * @throws {Error} - Throws error with appropriate message if invalid
 */
function validateUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') {
    throw new Error('Invalid UUID: UUID is required and must be a string');
  }
  
  if (!isValidUUID(uuid)) {
    throw new Error('Invalid UUID format');
  }
}

module.exports = {
  isValidUUID,
  validateUUID
};