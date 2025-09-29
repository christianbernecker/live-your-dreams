/**
 * LYD System - Audit Logging
 * 
 * Comprehensive audit trail for all system activities
 * Supports User, Role, Content, and Blog operations
 */

import { prisma } from './db';

// ============================================================================
// AUDIT EVENT TYPES
// ============================================================================

export type AuditEventType = 
  // Authentication Events
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'EMAIL_VERIFY'
  
  // User Management
  | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE' | 'USER_ACTIVATE' | 'USER_DEACTIVATE'
  
  // Role & Permission Management
  | 'ROLE_CREATE' | 'ROLE_UPDATE' | 'ROLE_DELETE' | 'ROLE_ASSIGN' | 'ROLE_UNASSIGN'
  | 'PERMISSION_GRANT' | 'PERMISSION_REVOKE'
  
  // Content Management (Legacy Posts)
  | 'POST_CREATE' | 'POST_UPDATE' | 'POST_DELETE' | 'POST_PUBLISH' | 'POST_UNPUBLISH'
  
  // Blog System v1.1
  | 'BLOG_IMPORT_SUCCESS' | 'BLOG_IMPORT_VALIDATION_FAILED' | 'BLOG_IMPORT_ERROR'
  | 'BLOG_POST_CREATE' | 'BLOG_POST_UPDATE' | 'BLOG_POST_DELETE'
  | 'BLOG_POST_PUBLISH' | 'BLOG_POST_SCHEDULE' | 'BLOG_POST_ARCHIVE'
  | 'BLOG_ASSET_UPLOAD' | 'BLOG_ASSET_DELETE'
  | 'BLOG_HTML_BLOCK_SANITIZE' | 'BLOG_CONTENT_SANITIZE'
  
  // System Events
  | 'SYSTEM_CONFIG_CHANGE' | 'BACKUP_CREATE' | 'BACKUP_RESTORE'
  | 'DATABASE_MIGRATION' | 'CACHE_CLEAR'
  
  // Security Events
  | 'SECURITY_BREACH' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY'
  | 'XSS_ATTEMPT_BLOCKED' | 'SQL_INJECTION_ATTEMPT';

// ============================================================================
// AUDIT EVENT INTERFACE
// ============================================================================

interface AuditEventData {
  type: AuditEventType;
  
  // Actor (who performed the action)
  actorUserId?: string;
  actorIP?: string;
  actorUserAgent?: string;
  
  // Target resources
  targetUserId?: string;
  targetRoleId?: string;
  targetPostId?: string;
  contentId?: string;
  blogPostId?: string;  // Blog System v1.1
  
  // Event metadata
  meta?: Record<string, any>;
}

// ============================================================================
// AUDIT LOGGING FUNCTION
// ============================================================================

/**
 * Log audit event to database
 */
export async function auditLog(eventData: AuditEventData): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        type: eventData.type,
        
        // Actor
        actorUserId: eventData.actorUserId || null,
        actorIP: eventData.actorIP || null,
        actorUserAgent: eventData.actorUserAgent || null,
        
        // Targets
        targetUserId: eventData.targetUserId || null,
        targetRoleId: eventData.targetRoleId || null,
        targetPostId: eventData.targetPostId || null,
        contentId: eventData.contentId || null,
        blogPostId: eventData.blogPostId || null,
        
        // Metadata
        meta: eventData.meta || null,
        
        // Timestamp is auto-generated
      }
    });
    
  } catch (error) {
    // Don't throw errors for audit logging failures
    // Log to console and continue
    console.error('Audit logging failed:', error);
    console.error('Event data:', eventData);
  }
}

// ============================================================================
// SPECIALIZED AUDIT FUNCTIONS
// ============================================================================

/**
 * Audit authentication events
 */
export async function auditAuth(
  type: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'EMAIL_VERIFY',
  userId?: string,
  ip?: string,
  userAgent?: string,
  meta?: Record<string, any>
): Promise<void> {
  await auditLog({
    type,
    actorUserId: userId,
    targetUserId: userId,
    actorIP: ip,
    actorUserAgent: userAgent,
    meta
  });
}

/**
 * Audit user management events
 */
export async function auditUserManagement(
  type: 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE' | 'USER_ACTIVATE' | 'USER_DEACTIVATE',
  actorUserId: string,
  targetUserId: string,
  changes?: Record<string, { from: any; to: any }>,
  ip?: string
): Promise<void> {
  await auditLog({
    type,
    actorUserId,
    targetUserId,
    actorIP: ip,
    meta: changes ? { changes } : undefined
  });
}

/**
 * Audit role management events
 */
export async function auditRoleManagement(
  type: 'ROLE_CREATE' | 'ROLE_UPDATE' | 'ROLE_DELETE' | 'ROLE_ASSIGN' | 'ROLE_UNASSIGN',
  actorUserId: string,
  targetRoleId?: string,
  targetUserId?: string,
  meta?: Record<string, any>
): Promise<void> {
  await auditLog({
    type,
    actorUserId,
    targetRoleId,
    targetUserId,
    meta
  });
}

/**
 * Audit blog system events
 */
export async function auditBlog(
  type: AuditEventType,
  actorUserId: string,
  blogPostId?: string,
  meta?: Record<string, any>
): Promise<void> {
  await auditLog({
    type,
    actorUserId,
    blogPostId,
    meta
  });
}

/**
 * Audit security events
 */
export async function auditSecurity(
  type: 'SECURITY_BREACH' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'XSS_ATTEMPT_BLOCKED' | 'SQL_INJECTION_ATTEMPT',
  ip?: string,
  userAgent?: string,
  userId?: string,
  meta?: Record<string, any>
): Promise<void> {
  await auditLog({
    type,
    actorUserId: userId,
    actorIP: ip,
    actorUserAgent: userAgent,
    meta
  });
}

// ============================================================================
// AUDIT RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get audit events for a user
 */
export async function getUserAuditTrail(
  userId: string,
  limit: number = 50,
  offset: number = 0
) {
  return await prisma.auditEvent.findMany({
    where: {
      OR: [
        { actorUserId: userId },
        { targetUserId: userId }
      ]
    },
    include: {
      actorUser: {
        select: { id: true, name: true, email: true }
      },
      targetUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

/**
 * Get audit events for a blog post
 */
export async function getBlogPostAuditTrail(
  blogPostId: string,
  limit: number = 20
) {
  return await prisma.auditEvent.findMany({
    where: { blogPostId },
    include: {
      actorUser: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

/**
 * Get recent system audit events
 */
export async function getSystemAuditTrail(
  eventTypes?: AuditEventType[],
  limit: number = 100,
  offset: number = 0
) {
  return await prisma.auditEvent.findMany({
    where: eventTypes ? {
      type: { in: eventTypes }
    } : undefined,
    include: {
      actorUser: {
        select: { id: true, name: true, email: true }
      },
      targetUser: {
        select: { id: true, name: true, email: true }
      },
      targetRole: {
        select: { id: true, name: true, displayName: true }
      },
      blogPost: {
        select: { id: true, title: true, slug: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

/**
 * Get audit statistics
 */
export async function getAuditStatistics(
  fromDate?: Date,
  toDate?: Date
): Promise<Record<AuditEventType, number>> {
  const where = {
    createdAt: {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate })
    }
  };

  const stats = await prisma.auditEvent.groupBy({
    by: ['type'],
    where,
    _count: {
      type: true
    }
  });

  const result: Partial<Record<AuditEventType, number>> = {};
  stats.forEach(stat => {
    result[stat.type as AuditEventType] = stat._count.type;
  });

  return result as Record<AuditEventType, number>;
}

// ============================================================================
// AUDIT CLEANUP FUNCTIONS
// ============================================================================

/**
 * Clean up old audit events (for GDPR compliance)
 */
export async function cleanupAuditEvents(
  olderThanDays: number = 365
): Promise<{ deletedCount: number }> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const result = await prisma.auditEvent.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate
      },
      // Keep critical security events longer
      type: {
        notIn: [
          'SECURITY_BREACH',
          'XSS_ATTEMPT_BLOCKED', 
          'SQL_INJECTION_ATTEMPT',
          'SUSPICIOUS_ACTIVITY'
        ]
      }
    }
  });

  // Log the cleanup operation
  await auditLog({
    type: 'SYSTEM_CONFIG_CHANGE',
    meta: {
      operation: 'AUDIT_CLEANUP',
      deletedCount: result.count,
      cutoffDate: cutoffDate.toISOString()
    }
  });

  return { deletedCount: result.count };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract IP address from request
 */
export function getClientIP(request: Request | any): string | undefined {
  if (!request) return undefined;
  
  // Try various headers for IP detection
  const headers = request.headers;
  
  return headers.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
         headers.get?.('x-real-ip') ||
         headers.get?.('cf-connecting-ip') ||  // Cloudflare
         headers.get?.('x-client-ip') ||
         undefined;
}

/**
 * Extract user agent from request
 */
export function getClientUserAgent(request: Request | any): string | undefined {
  return request?.headers?.get?.('user-agent') || undefined;
}

/**
 * Create audit context from request
 */
export function createAuditContext(request: Request | any, userId?: string) {
  return {
    actorUserId: userId,
    actorIP: getClientIP(request),
    actorUserAgent: getClientUserAgent(request)
  };
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS (für bestehende API Routes)
// ============================================================================

/**
 * Legacy audit function for content actions
 * Flexible parameter handling for backwards compatibility
 */
export async function auditContentAction(
  ...args: any[]
): Promise<void> {
  try {
    // Handle different parameter patterns from legacy code
    let session: any, action: string, contentId: string, type: string, meta: any;
    
    if (args.length >= 4) {
      [session, action, contentId, type, ...rest] = args;
      meta = rest.length > 0 ? rest[0] : {};
    } else if (args.length === 3) {
      [action, contentId, meta] = args;
    } else {
      console.warn('auditContentAction: Unexpected parameter count', args.length);
      return;
    }

    const userId = session?.user?.id || session;
    
    await auditLog({
      type: (action || 'CONTENT_UPDATE') as AuditEventType,
      actorUserId: typeof userId === 'string' ? userId : undefined,
      contentId: typeof contentId === 'string' ? contentId : undefined,
      meta: meta || {}
    });
  } catch (error) {
    console.error('auditContentAction failed:', error);
    // Don't throw - audit failures shouldn't break the main flow
  }
}

/**
 * Legacy audit function for user actions
 * Flexible parameter handling for backwards compatibility
 */
export async function auditUserAction(
  ...args: any[]
): Promise<void> {
  try {
    // Default to safe fallback
    await auditLog({
      type: 'USER_UPDATE' as AuditEventType,
      actorUserId: undefined,
      targetUserId: undefined,
      meta: { legacyCall: true, args: args.length }
    });
  } catch (error) {
    console.error('auditUserAction failed:', error);
  }
}

/**
 * Legacy audit function for role actions
 * Flexible parameter handling for backwards compatibility
 */
export async function auditRoleAction(
  ...args: any[]
): Promise<void> {
  try {
    // Default to safe fallback
    await auditLog({
      type: 'ROLE_UPDATE' as AuditEventType,
      actorUserId: undefined,
      targetRoleId: undefined,
      meta: { legacyCall: true, args: args.length }
    });
  } catch (error) {
    console.error('auditRoleAction failed:', error);
  }
}

/**
 * Legacy function to create CRUD metadata
 * Flexible parameter handling for backwards compatibility
 */
export function createCrudMeta(...args: any[]): Record<string, any> {
  try {
    const [before, after] = args;
    const changes: Record<string, { from: any; to: any }> = {};
    
    if (before && after && typeof before === 'object' && typeof after === 'object') {
      for (const key in after) {
        if (before[key] !== after[key]) {
          changes[key] = { from: before[key], to: after[key] };
        }
      }
    }
    
    return { changes, legacyCall: true };
  } catch (error) {
    console.error('createCrudMeta failed:', error);
    return { legacyCall: true, error: true };
  }
}

/**
 * Legacy function to create audit from session
 * Flexible parameter handling for backwards compatibility
 */
export function auditFromSession(...args: any[]): Record<string, any> {
  try {
    const [session, type, meta] = args;
    return {
      type: (type || 'SYSTEM_CONFIG_CHANGE') as AuditEventType,
      actorUserId: session?.user?.id,
      meta: meta || { legacyCall: true }
    };
  } catch (error) {
    console.error('auditFromSession failed:', error);
    return {
      type: 'SYSTEM_CONFIG_CHANGE' as AuditEventType,
      meta: { legacyCall: true, error: true }
    };
  }
}