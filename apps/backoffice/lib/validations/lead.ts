import { z } from 'zod';

export const LeadSchema = z.object({
  propertyId: z.string().min(8, 'Property ID ist erforderlich'),
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  phone: z.string().optional(),
  name: z.string().optional(),
  message: z.string().max(4000, 'Nachricht zu lang (max. 4000 Zeichen)').optional(),
  source: z.enum(['MICROSITE', 'IMMOSCOUT24', 'PORTAL', 'PHONE', 'EMAIL', 'REFERRAL']).default('MICROSITE'),
  gdprConsent: z.boolean().refine(val => val === true, 'DSGVO-Einwilligung erforderlich'),
});

export const UpdateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING_SCHEDULED', 'OFFER_MADE', 'SOLD', 'LOST', 'SPAM']),
  assignedTo: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
