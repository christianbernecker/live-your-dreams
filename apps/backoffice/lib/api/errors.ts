import { NextResponse } from 'next/server'

// ============================================================================
// ERROR TYPES
// ============================================================================

export class ApiError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code || this.getDefaultCode(statusCode)
    this.details = details
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
      case 400: return 'BAD_REQUEST'
      case 401: return 'UNAUTHORIZED'
      case 403: return 'FORBIDDEN'
      case 404: return 'NOT_FOUND'
      case 409: return 'CONFLICT'
      case 422: return 'VALIDATION_ERROR'
      case 429: return 'RATE_LIMITED'
      case 500: return 'INTERNAL_ERROR'
      default: return 'UNKNOWN_ERROR'
    }
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: new Date().toISOString()
    }
  }
}

// ============================================================================
// SPECIFIC ERROR CLASSES
// ============================================================================

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 422, 'VALIDATION_ERROR', details)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMITED')
  }
}

// ============================================================================
// ERROR RESPONSE HELPERS
// ============================================================================

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
  details?: any
  timestamp: string
  path?: string
}

export function createErrorResponse(
  error: ApiError | Error,
  path?: string
): NextResponse<ErrorResponse> {
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      error: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString(),
      path
    }

    return NextResponse.json(response, { status: error.statusCode })
  }

  // Handle generic errors
  const response: ErrorResponse = {
    error: 'INTERNAL_ERROR',
    message: error.message || 'Internal server error',
    statusCode: 500,
    timestamp: new Date().toISOString(),
    path
  }

  return NextResponse.json(response, { status: 500 })
}

// ============================================================================
// ERROR HANDLER WRAPPER
// ============================================================================

export type ApiHandler = (request: Request, context?: any) => Promise<NextResponse>

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error('API Error:', error)
      
      const url = new URL(request.url)
      return createErrorResponse(error as Error, url.pathname)
    }
  }
}

// ============================================================================
// MIDDLEWARE ERROR HANDLERS
// ============================================================================

export async function handleAuthError(request: Request): Promise<NextResponse> {
  const response: ErrorResponse = {
    error: 'UNAUTHORIZED',
    message: 'Authentication required',
    statusCode: 401,
    timestamp: new Date().toISOString(),
    path: new URL(request.url).pathname
  }

  return NextResponse.json(response, { status: 401 })
}

export async function handlePermissionError(request: Request, permission: string): Promise<NextResponse> {
  const response: ErrorResponse = {
    error: 'FORBIDDEN',
    message: `Permission '${permission}' required`,
    statusCode: 403,
    details: { requiredPermission: permission },
    timestamp: new Date().toISOString(),
    path: new URL(request.url).pathname
  }

  return NextResponse.json(response, { status: 403 })
}

// ============================================================================
// VALIDATION ERROR HELPERS
// ============================================================================

export function createValidationError(field: string, message: string): ValidationError {
  return new ValidationError(`Validation failed for field '${field}'`, {
    field,
    message
  })
}

export function createMultipleValidationErrors(errors: Array<{field: string, message: string}>): ValidationError {
  return new ValidationError('Multiple validation errors', {
    errors
  })
}

// ============================================================================
// COMMON ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication & Authorization
  UNAUTHORIZED: 'Sie müssen angemeldet sein, um diese Aktion auszuführen',
  FORBIDDEN: 'Sie haben nicht die nötigen Berechtigungen für diese Aktion',
  INVALID_CREDENTIALS: 'Ungültige Anmeldedaten',
  ACCOUNT_DEACTIVATED: 'Ihr Konto wurde deaktiviert',
  
  // Validation
  REQUIRED_FIELD: (field: string) => `${field} ist erforderlich`,
  INVALID_EMAIL: 'Ungültige E-Mail-Adresse',
  PASSWORD_TOO_SHORT: 'Passwort muss mindestens 8 Zeichen lang sein',
  INVALID_FORMAT: (field: string) => `${field} hat ein ungültiges Format`,
  
  // Resources
  USER_NOT_FOUND: 'Benutzer nicht gefunden',
  ROLE_NOT_FOUND: 'Rolle nicht gefunden',
  POST_NOT_FOUND: 'Artikel nicht gefunden',
  FILE_NOT_FOUND: 'Datei nicht gefunden',
  
  // Conflicts
  EMAIL_ALREADY_EXISTS: 'Diese E-Mail-Adresse wird bereits verwendet',
  ROLE_NAME_TAKEN: 'Dieser Rollenname ist bereits vergeben',
  SLUG_ALREADY_EXISTS: 'Dieser Slug wird bereits verwendet',
  
  // File Upload
  FILE_TOO_LARGE: 'Datei ist zu groß',
  INVALID_FILE_TYPE: 'Ungültiger Dateityp',
  UPLOAD_FAILED: 'Datei-Upload fehlgeschlagen',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut',
  
  // Generic
  INTERNAL_ERROR: 'Ein interner Fehler ist aufgetreten',
  NOT_IMPLEMENTED: 'Diese Funktion ist noch nicht implementiert',
  MAINTENANCE_MODE: 'Die Anwendung befindet sich im Wartungsmodus'
} as const
