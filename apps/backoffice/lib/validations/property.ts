import { z } from 'zod';

export const PropertySchema = z.object({
  title: z.string().min(5, 'Titel muss mindestens 5 Zeichen haben').max(200),
  description: z.string().optional(),
  type: z.enum(['WOHNUNG', 'HAUS', 'REIHENHAUS', 'DOPPELHAUS', 'MEHRFAMILIENHAUS', 'GEWERBE']),
  city: z.string().min(2, 'Stadt ist erforderlich'),
  postcode: z.string().regex(/^\d{5}$/, 'Postleitzahl muss 5-stellig sein'),
  address: z.string().optional(),
  price: z.number().min(10000, 'Preis muss mindestens 10.000€ sein'),
  livingArea: z.number().min(10, 'Wohnfläche muss mindestens 10m² sein').optional(),
  totalArea: z.number().optional(),
  roomCount: z.number().min(0.5).max(20).optional(),
  bedrooms: z.number().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(10).optional(),
  buildYear: z.number().min(1800).max(new Date().getFullYear() + 5).optional(),
  
  // Energy Certificate
  energyType: z.enum(['Verbrauch', 'Bedarf']).optional(),
  energyValue: z.number().min(0).max(1000).optional(),
  energyClass: z.enum(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']).optional(),
  energyCarrier: z.string().optional(),
});

export const CreatePropertySchema = PropertySchema;
export const UpdatePropertySchema = PropertySchema.partial();

export type PropertyInput = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertySchema>;
