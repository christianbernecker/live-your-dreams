-- Manual Migration: Add Extended Energy Certificate Fields
-- GEG § 87 Pflichtangaben Erweiterung
-- Datum: 2024-12-19

-- Erweitere Properties Tabelle um fehlende Energieausweis-Felder
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "energyCertType" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "energyCertIssueYear" INTEGER;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "energyCertValidUntil" TIMESTAMP(3);
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "heatingConsumption" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "hotWaterConsumption" DOUBLE PRECISION;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "consumptionYears" TEXT;

-- Kommentare für bessere Dokumentation
COMMENT ON COLUMN "properties"."energyCertType" IS 'Art des Energieausweises: Wohnung oder Nichtwohngebäude';
COMMENT ON COLUMN "properties"."energyCertIssueYear" IS 'Ausstellungsjahr des Energieausweises (GEG § 87)';
COMMENT ON COLUMN "properties"."energyCertValidUntil" IS 'Gültigkeitsdatum des Energieausweises (10 Jahre ab Ausstellung)';
COMMENT ON COLUMN "properties"."heatingConsumption" IS 'Heizenergieverbrauch in kWh/(m²·a) - nur bei Verbrauchsausweis';
COMMENT ON COLUMN "properties"."hotWaterConsumption" IS 'Warmwasserverbrauch in kWh/(m²·a) - optional bei Verbrauchsausweis';
COMMENT ON COLUMN "properties"."consumptionYears" IS 'Referenzzeitraum für Verbrauchsdaten (Format: JJJJ-JJJJ)';

-- Index für häufige Abfragen (Energieausweis Gültigkeit)
CREATE INDEX IF NOT EXISTS "properties_energyCertValidUntil_idx" ON "properties"("energyCertValidUntil");

-- Update existierende Datensätze mit Standard-Werten
UPDATE "properties" 
SET 
  "energyCertType" = 'Wohnung',
  "energyCertIssueYear" = EXTRACT(YEAR FROM "createdAt") - 1,
  "energyCertValidUntil" = "createdAt" + INTERVAL '10 years'
WHERE "energyCertType" IS NULL;
