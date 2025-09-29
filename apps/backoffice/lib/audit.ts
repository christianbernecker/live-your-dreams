/**
 * Audit System
 * 
 * Provides comprehensive audit trail functionality for all system actions.
 * All mutations (create, update, delete) should be logged through this system.
 */

import type { Session } from 'next-auth';
import { prisma } from './db';

// ============================================================================
// AUDIT EVENT TYPES
// ============================================================================

export type AuditEventType =
  // Authentication Events
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT' 
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_PASSWORD_CHANGE'
  | 'AUTH_PASSWORD_RESET'
  
  // User Management
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'USER_ACTIVATE'
  | 'USER_DEACTIVATE'
  | 'USER_INVITE'
  | 'USER_ROLE_ASSIGN'
  | 'USER_ROLE_REMOVE'
  
  // Role & Permission Management
  | 'ROLE_CREATE'
  | 'ROLE_UPDATE'
  | 'ROLE_DELETE'
  | 'ROLE_PERMISSION_ADD'
  | 'ROLE_PERMISSION_REMOVE'
  
  // Content Management - Posts
  | 'POST_CREATE'
  | 'POST_UPDATE'
  | 'POST_DELETE'
  | 'POST_RESTORE'
  | 'POST_PUBLISH'
  | 'POST_UNPUBLISH'
  | 'POST_SUBMIT_REVIEW'
  | 'POST_APPROVE_REVIEW'
  | 'POST_REJECT_REVIEW'
  
  // Content Management - Generic
  | 'CONTENT_CREATE'
  | 'CONTENT_UPDATE'
  | 'CONTENT_DELETE'
  | 'CONTENT_RESTORE'
  | 'CONTENT_PUBLISH'
  | 'CONTENT_UNPUBLISH'
  | 'CONTENT_SUBMIT_REVIEW'
  | 'CONTENT_APPROVE_REVIEW'
  | 'CONTENT_REJECT_REVIEW'
  | 'CONTENT_TYPE_CREATE'
  | 'CONTENT_TYPE_UPDATE'
  | 'CONTENT_TYPE_DELETE'
  
  // Media Management
  | 'MEDIA_UPLOAD'
  | 'MEDIA_UPDATE'
  | 'MEDIA_DELETE'
  | 'MEDIA_MOVE'
  
  // System Settings
  | 'SETTINGS_UPDATE'
  | 'SETTINGS_SYSTEM_UPDATE'
  
  // Security Events
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_EXPORT'
  | 'BULK_OPERATION';

// ============================================================================
// AUDIT METADATA INTERFACES
// ============================================================================

export interface AuditMeta {
  // Request context
  userAgent?: string;
  ip?: string;
  method?: string;
  path?: string;
  
  // Change tracking
  previousValue?: any;
  newValue?: any;
  changedFields?: string[];
  
  // Additional context
  resourceType?: string;
  resourceName?: string;
  reason?: string;
  bulkCount?: number;
  
  // Custom metadata
  [key: string]: any;
}

// ============================================================================
// CORE AUDIT FUNCTIONS
// ============================================================================

/**
 * Log an audit event with full context
 */
export async function audit(
  type: AuditEventType,
  meta: AuditMeta,
  actorUserId?: string,
  options?: {
    targetUserId?: string;
    targetRoleId?: string;
    targetPostId?: string;
    contentId?: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        type,
        meta,
        actorUserId,
        actorIP: options?.ip,
        actorUserAgent: options?.userAgent,
        targetUserId: options?.targetUserId,
        targetRoleId: options?.targetRoleId,
        targetPostId: options?.targetPostId,
        contentId: options?.contentId
      }
    });
  } catch (error) {
    // Audit logging should never break the main application
    console.error('Failed to create audit event:', error);
    console.error('Audit details:', { type, meta, actorUserId, options });
  }
}

/**
 * Log audit event from session context (common pattern)
 */
export async function auditFromSession(
  session: Session | null,
  type: AuditEventType,
  meta: AuditMeta,
  request?: Request,
  options?: {
    targetUserId?: string;
    targetRoleId?: string;
    targetPostId?: string;
    contentId?: string;
  }
): Promise<void> {
  const ip = getClientIP(request);
  const userAgent = request?.headers.get('user-agent') || undefined;
  
  await audit(type, meta, session?.user?.id, {
    ...options,
    ip,
    userAgent
  });
}

// ============================================================================
// SPECIALIZED AUDIT FUNCTIONS
// ============================================================================

/**
 * Audit authentication events
 */
export async function auditAuth(
  type: 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'AUTH_LOGIN_FAILED' | 'AUTH_PASSWORD_CHANGE' | 'AUTH_PASSWORD_RESET',
  email: string,
  meta: Partial<AuditMeta> = {},
  request?: Request
): Promise<void> {
  const ip = getClientIP(request);
  const userAgent = request?.headers.get('user-agent') || undefined;
  
  await audit(type, {
    ...meta,
    email,
    ip,
    userAgent,
    method: request?.method,
    path: request ? new URL(request.url).pathname : undefined
  }, undefined, { ip, userAgent });
}

/**
 * Audit user management actions
 */
export async function auditUserAction(
  session: Session | null,
  type: AuditEventType,
  targetUserId: string,
  meta: Partial<AuditMeta> = {},
  request?: Request
): Promise<void> {
  await auditFromSession(session, type, {
    ...meta,
    resourceType: 'user',
    targetUserId
  }, request, { targetUserId });
}

/**
 * Audit role/permission changes
 */
export async function auditRoleAction(
  session: Session | null,
  type: AuditEventType,
  targetRoleId: string,
  meta: Partial<AuditMeta> = {},
  request?: Request
): Promise<void> {
  await auditFromSession(session, type, {
    ...meta,
    resourceType: 'role'
  }, request, { targetRoleId });
}

/**
 * Audit content changes (posts and generic content)
 */
export async function auditContentAction(
  session: Session | null,
  type: AuditEventType,
  contentId: string,
  contentType: 'post' | 'content',
  meta: Partial<AuditMeta> = {},
  request?: Request
): Promise<void> {
  const options = contentType === 'post' 
    ? { targetPostId: contentId }
    : { contentId };
    
  await auditFromSession(session, type, {
    ...meta,
    resourceType: contentType
  }, request, options);
}

/**
 * Audit bulk operations
 */
export async function auditBulkOperation(
  session: Session | null,
  type: AuditEventType,
  resourceType: string,
  count: number,
  meta: Partial<AuditMeta> = {},
  request?: Request
): Promise<void> {
  await auditFromSession(session, type, {
    ...meta,
    resourceType,
    bulkCount: count,
    operationType: 'bulk'
  }, request);
}

// ============================================================================
// CHANGE TRACKING HELPERS
// ============================================================================

/**
 * Generate diff between old and new values
 */
export function generateDiff(oldValue: any, newValue: any): AuditMeta {
  const changedFields: string[] = [];
  
  if (typeof oldValue === 'object' && typeof newValue === 'object') {
    // Compare objects field by field
    const allKeys = new Set([
      ...Object.keys(oldValue || {}), 
      ...Object.keys(newValue || {})
    ]);
    
    Array.from(allKeys).forEach(key => {
      if (oldValue?.[key] !== newValue?.[key]) {
        changedFields.push(key);
      }
    });
  } else if (oldValue !== newValue) {
    changedFields.push('value');
  }
  
  return {
    previousValue: oldValue,
    newValue,
    changedFields
  };
}

/**
 * Create audit metadata for CRUD operations
 */
export function createCrudMeta(
  operation: 'create' | 'update' | 'delete',
  resourceName: string,
  oldValue?: any,
  newValue?: any
): AuditMeta {
  const meta: AuditMeta = {
    resourceName,
    operationType: operation
  };
  
  if (operation === 'update' && oldValue && newValue) {
    Object.assign(meta, generateDiff(oldValue, newValue));
  } else if (operation === 'create' && newValue) {
    meta.newValue = newValue;
  } else if (operation === 'delete' && oldValue) {
    meta.previousValue = oldValue;
  }
  
  return meta;
}

// ============================================================================
// AUDIT QUERY FUNCTIONS
// ============================================================================

/**
 * Get audit events for a specific user (as actor)
 */
export async function getAuditEventsForUser(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    eventTypes?: AuditEventType[];
    dateFrom?: Date;
    dateTo?: Date;
  }
): Promise<any[]> {
  const { limit = 50, offset = 0, eventTypes, dateFrom, dateTo } = options || {};
  
  return await prisma.auditEvent.findMany({
    where: {
      actorUserId: userId,
      type: eventTypes ? { in: eventTypes } : undefined,
      createdAt: {
        gte: dateFrom,
        lte: dateTo
      }
    },
    include: {
      actorUser: { select: { id: true, name: true, email: true } },
      targetUser: { select: { id: true, name: true, email: true } },
      targetRole: { select: { id: true, name: true } },
      targetPost: { select: { id: true, title: true } },
      contentEntry: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

/**
 * Get audit events for a specific resource
 */
export async function getResourceAuditHistory(
  resourceType: 'user' | 'role' | 'post' | 'content',
  resourceId: string,
  limit = 50
): Promise<any[]> {
  const where = {
    [resourceType === 'user' ? 'targetUserId' : 
     resourceType === 'role' ? 'targetRoleId' :
     resourceType === 'post' ? 'targetPostId' : 'contentId']: resourceId
  };
  
  return await prisma.auditEvent.findMany({
    where,
    include: {
      actorUser: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract client IP from request (considering proxies)
 */
function getClientIP(request?: Request): string | undefined {
  if (!request) return undefined;
  
  // Check various headers for real IP (in order of preference)
  const headers = [
    'x-forwarded-for',
    'x-real-ip', 
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded'
  ];
  
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }
  
  return undefined;
}

/**
 * Sanitize audit metadata (remove sensitive information)
 */
export function sanitizeMeta(meta: AuditMeta): AuditMeta {
  const sanitized = { ...meta };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential'];
  
  function removeSensitiveFields(obj: any): any {
    if (obj && typeof obj === 'object') {
      const cleaned = { ...obj };
      for (const field of sensitiveFields) {
        if (field in cleaned) {
          cleaned[field] = '[REDACTED]';
        }
      }
      return cleaned;
    }
    return obj;
  }
  
  if (sanitized.previousValue) {
    sanitized.previousValue = removeSensitiveFields(sanitized.previousValue);
  }
  
  if (sanitized.newValue) {
    sanitized.newValue = removeSensitiveFields(sanitized.newValue);
  }
  
  return sanitized;
}
