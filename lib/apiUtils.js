/**
 * Utility functions for handling API responses consistently
 */

/**
 * Validates and parses an API response
 * @param {Response} response - The fetch response object
 * @returns {Promise<Object>} - The parsed JSON data
 * @throws {Error} - If the response is not valid JSON or has an error status
 */
export async function validateAndParseResponse(response) {
  // Check if response is ok
  if (!response.ok) {
    console.error('Response not ok:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Error response body:', errorText);
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  // Check content type
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const errorText = await response.text();
    console.error('Non-JSON response:', contentType, errorText);
    throw new Error('Server returned non-JSON response');
  }
  
  return await response.json();
}

/**
 * Makes a safe API call with proper error handling
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function safeApiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await validateAndParseResponse(response);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Makes a safe API call for GET requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function safeGet(url, options = {}) {
  return safeApiCall(url, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    },
    ...options
  });
}

/**
 * Makes a safe API call for POST requests
 * @param {string} url - The API endpoint URL
 * @param {Object|FormData} body - The request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function safePost(url, body, options = {}) {
  return safeApiCall(url, {
    method: 'POST',
    body,
    ...options
  });
}

/**
 * Makes a safe API call for PUT requests
 * @param {string} url - The API endpoint URL
 * @param {Object|FormData} body - The request body
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function safePut(url, body, options = {}) {
  return safeApiCall(url, {
    method: 'PUT',
    body,
    ...options
  });
}

/**
 * Makes a safe API call for DELETE requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function safeDelete(url, options = {}) {
  return safeApiCall(url, {
    method: 'DELETE',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    },
    ...options
  });
}
