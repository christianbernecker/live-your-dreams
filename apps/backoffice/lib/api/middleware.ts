import { auth } from '@/lib/nextauth'
import { NextRequest, NextResponse } from 'next/server'
import { ApiError, ForbiddenError, RateLimitError, UnauthorizedError } from './errors'

// ============================================================================
// TYPES
// ============================================================================

export interface RequestContext {
  user?: {
    id: string
    email: string
    role: string
    isActive: boolean
  }
  requestId: string
  startTime: number
  [key: string]: any
}

export type MiddlewareHandler = (
  request: NextRequest,
  context: RequestContext
) => Promise<NextResponse | void>

export type ApiRoute = (
  request: NextRequest,
  context: RequestContext
) => Promise<NextResponse>

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitConfig {
  windowMs: number    // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  keyGenerator?: (request: NextRequest, context: RequestContext) => string
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(config: RateLimitConfig): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    const key = config.keyGenerator 
      ? config.keyGenerator(request, context)
      : context.user?.id || getClientIP(request)

    const now = Date.now()
    const windowStart = now - config.windowMs

    // Clean up old entries
    const keysToDelete: string[] = []
    rateLimitStore.forEach((value, key) => {
      if (value.resetTime < now) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => rateLimitStore.delete(key))

    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs }

    if (current.resetTime < now) {
      // Reset window
      current.count = 1
      current.resetTime = now + config.windowMs
    } else {
      current.count++
    }

    rateLimitStore.set(key, current)

    if (current.count > config.maxRequests) {
      throw new RateLimitError(
        config.message || `Rate limit exceeded. Max ${config.maxRequests} requests per ${config.windowMs / 1000} seconds`
      )
    }

    // Add rate limit headers
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - current.count).toString())
    response.headers.set('X-RateLimit-Reset', current.resetTime.toString())

    return response
  }
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

export function requireAuth(): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    const session = await auth()

    if (!session?.user) {
      throw new UnauthorizedError('Authentication required')
    }

    if (!session.user.isActive) {
      throw new UnauthorizedError('Account deactivated')
    }

    // Add user to context
    context.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      isActive: session.user.isActive
    }
  }
}

// ============================================================================
// ROLE-BASED MIDDLEWARE (Permission system removed)
// ============================================================================

/**
 * @deprecated Permission system removed - use requireRole() instead
 * This function is deprecated and will throw an error if called.
 */
export function requirePermission(permission: string): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    throw new Error('Permission system deprecated - use requireRole() or requireAdmin() instead')
  }
}

/**
 * @deprecated Permission system removed - use requireRole() instead
 * This function is deprecated and will throw an error if called.
 */
export function requireAnyPermission(permissions: string[]): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    throw new Error('Permission system deprecated - use requireRole() or requireAdmin() instead')
  }
}

export function requireRole(role: string): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    if (!context.user) {
      throw new UnauthorizedError('Authentication required')
    }

    if (context.user.role !== role) {
      throw new ForbiddenError(`Role '${role}' required`)
    }
  }
}

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

interface LogConfig {
  logRequests?: boolean
  logResponses?: boolean
  logErrors?: boolean
  sensitiveFields?: string[]
}

export function logging(config: LogConfig = {}): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    const {
      logRequests = true,
      logResponses = false,
      logErrors = true,
      sensitiveFields = ['password', 'token', 'secret']
    } = config

    if (logRequests) {
      const sanitizedHeaders = sanitizeObject(
        Object.fromEntries(request.headers.entries()),
        sensitiveFields
      )

      console.log(`[${context.requestId}] ${request.method} ${request.url}`, {
        method: request.method,
        url: request.url,
        headers: sanitizedHeaders,
        userAgent: request.headers.get('user-agent'),
        userId: context.user?.id,
        timestamp: new Date().toISOString()
      })
    }

    // Response logging would be handled in the main handler wrapper
  }
}

// ============================================================================
// CORS MIDDLEWARE
// ============================================================================

interface CorsConfig {
  origin?: string | string[] | boolean
  methods?: string[]
  allowedHeaders?: string[]
  credentials?: boolean
}

export function cors(config: CorsConfig = {}): MiddlewareHandler {
  return async (request: NextRequest, context: RequestContext) => {
    const {
      origin = true,
      methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials = true
    } = config

    const response = NextResponse.next()

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
      response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
      response.headers.set('Access-Control-Max-Age', '86400')
    }

    // Set origin
    if (origin === true) {
      response.headers.set('Access-Control-Allow-Origin', '*')
    } else if (typeof origin === 'string') {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (Array.isArray(origin)) {
      const requestOrigin = request.headers.get('origin')
      if (requestOrigin && origin.includes(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin)
      }
    }

    if (credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response
  }
}

// ============================================================================
// MIDDLEWARE COMPOSER
// ============================================================================

export function createHandler(
  handler: ApiRoute,
  middlewares: MiddlewareHandler[] = []
): ApiRoute {
  return async (request: NextRequest, params?: any) => {
    const context: RequestContext = {
      requestId: generateRequestId(),
      startTime: Date.now(),
      params
    }

    try {
      // Run middlewares
      for (const middleware of middlewares) {
        const result = await middleware(request, context)
        if (result instanceof NextResponse) {
          return result
        }
      }

      // Run main handler
      const response = await handler(request, context)

      // Add standard headers
      response.headers.set('X-Request-ID', context.requestId)
      response.headers.set('X-Response-Time', `${Date.now() - context.startTime}ms`)

      return response
    } catch (error) {
      console.error(`[${context.requestId}] Error:`, error)

      if (error instanceof ApiError) {
        return NextResponse.json(error.toJSON(), { status: error.statusCode })
      }

      // Generic error
      return NextResponse.json(
        {
          error: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
          requestId: context.requestId,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const real = request.headers.get('x-real-ip')
  if (real) {
    return real
  }

  return 'unknown'
}

function sanitizeObject(obj: any, sensitiveFields: string[]): any {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized = { ...obj }
  
  for (const field of sensitiveFields) {
    if (field.toLowerCase() in sanitized) {
      sanitized[field.toLowerCase()] = '[REDACTED]'
    }
  }

  return sanitized
}

// ============================================================================
// COMMON MIDDLEWARE COMBINATIONS
// ============================================================================

export const authMiddleware = [requireAuth()]
export const adminMiddleware = [requireAuth(), requireRole('admin')]
export const editorMiddleware = [requireAuth(), requireAnyPermission(['posts.create', 'posts.update', 'posts.delete'])]

export const apiMiddleware = [
  logging(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100          // 100 requests per 15 minutes
  })
]

export const publicApiMiddleware = [
  cors(),
  logging({ logRequests: false }),
  rateLimit({
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 30      // 30 requests per minute
  })
]
