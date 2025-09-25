import { z } from 'zod'

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const IdSchema = z.string().min(1, 'ID ist erforderlich')

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
})

// ============================================================================
// USER VALIDATION SCHEMAS
// ============================================================================

export const CreateUserSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer')
})

export const UpdateUserSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  firstName: z.string().min(1, 'Vorname ist erforderlich').optional(),
  lastName: z.string().min(1, 'Nachname ist erforderlich').optional(),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein').optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional()
})

// ============================================================================
// ROLE VALIDATION SCHEMAS
// ============================================================================

export const PermissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  category: z.string()
})

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Rollenname ist erforderlich').regex(/^[a-z_]+$/, 'Name darf nur Kleinbuchstaben und Unterstriche enthalten'),
  displayName: z.string().min(1, 'Anzeigename ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Ungültiger Farbcode'),
  permissions: z.array(PermissionSchema).min(1, 'Mindestens eine Berechtigung ist erforderlich')
})

export const UpdateRoleSchema = CreateRoleSchema.partial()

// ============================================================================
// POST/CONTENT VALIDATION SCHEMAS
// ============================================================================

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(200, 'Titel zu lang'),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  excerpt: z.string().max(300, 'Auszug zu lang').optional(),
  slug: z.string().min(1, 'Slug ist erforderlich').regex(/^[a-z0-9-]+$/, 'Ungültiger Slug'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(60, 'Meta-Titel zu lang').optional(),
  metaDescription: z.string().max(160, 'Meta-Beschreibung zu lang').optional(),
  publishAt: z.coerce.date().optional()
})

export const UpdatePostSchema = CreatePostSchema.partial()

// ============================================================================
// MEDIA VALIDATION SCHEMAS
// ============================================================================

export const FileUploadSchema = z.object({
  filename: z.string().min(1, 'Dateiname ist erforderlich'),
  mimetype: z.string().min(1, 'MIME-Type ist erforderlich'),
  size: z.number().max(10 * 1024 * 1024, 'Datei zu groß (max. 10MB)'),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional()
})

// ============================================================================
// SETTINGS VALIDATION SCHEMAS
// ============================================================================

export const UpdateSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site-Name ist erforderlich').optional(),
  siteDescription: z.string().optional(),
  siteUrl: z.string().url('Ungültige URL').optional(),
  contactEmail: z.string().email('Ungültige E-Mail-Adresse').optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  defaultRole: z.enum(['admin', 'editor', 'viewer']).optional(),
  maxFileSize: z.number().min(1, 'Maximale Dateigröße muss mindestens 1MB sein').optional(),
  allowedFileTypes: z.array(z.string()).optional()
})

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
  timestamp: z.string().optional(),
  path: z.string().optional()
})

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => z.object({
  data: z.array(itemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string().optional()
  }).optional()
})

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export type ValidationResult<T> = {
  success: boolean
  data?: T
  error?: {
    message: string
    details: any
  }
}

export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Validierungsfehler',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      }
    }
    
    return {
      success: false,
      error: {
        message: 'Unbekannter Validierungsfehler',
        details: error
      }
    }
  }
}

// ============================================================================
// MIDDLEWARE HELPERS
// ============================================================================

export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => {
    return validateData(schema, data)
  }
}

export function validateQueryParams<T>(schema: z.ZodSchema<T>) {
  return (params: unknown): ValidationResult<T> => {
    return validateData(schema, params)
  }
}
