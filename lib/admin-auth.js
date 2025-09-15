import { NextResponse } from 'next/server';

/**
 * Validate admin authentication from request headers
 * @param {Request} request - The incoming request
 * @returns {Object} - { isValid: boolean, admin: Object|null, error: string|null }
 */
export function validateAdminAuth(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isValid: false,
        admin: null,
        error: 'Missing or invalid authorization header'
      };
    }
    
    // Extract token (in a real app, this would be a JWT token)
    const token = authHeader.substring(7);
    
    // For now, we'll use a simple approach
    // In production, you should validate JWT tokens here
    if (token === 'admin-token') {
      return {
        isValid: true,
        admin: { id: '1', role: 'super_admin', name: 'Admin' },
        error: null
      };
    }
    
    return {
      isValid: false,
      admin: null,
      error: 'Invalid token'
    };
    
  } catch (error) {
    return {
      isValid: false,
      admin: null,
      error: 'Authentication validation failed'
    };
  }
}

/**
 * Create unauthorized response
 * @param {string} message - Error message
 * @returns {NextResponse}
 */
export function createUnauthorizedResponse(message = 'Unauthorized access') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 * @param {string} message - Error message
 * @returns {NextResponse}
 */
export function createForbiddenResponse(message = 'Forbidden access') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}
