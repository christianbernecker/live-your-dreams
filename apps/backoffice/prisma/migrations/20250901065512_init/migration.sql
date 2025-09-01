-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('WOHNUNG', 'HAUS', 'REIHENHAUS', 'DOPPELHAUS', 'MEHRFAMILIENHAUS', 'GEWERBE');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'SOLD', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('WOHNZIMMER', 'SCHLAFZIMMER', 'KUECHE', 'BADEZIMMER', 'GAESTE_WC', 'FLUR', 'BALKON', 'TERRASSE', 'GARTEN', 'KELLER', 'DACHBODEN', 'GARAGE', 'SONSTIGES');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('MICROSITE', 'IMMOSCOUT24', 'PORTAL', 'PHONE', 'EMAIL', 'REFERRAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING_SCHEDULED', 'OFFER_MADE', 'SOLD', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "ListingPlatform" AS ENUM ('IMMOSCOUT24', 'IMMOWELT', 'EBAY_KLEINANZEIGEN', 'MICROSITE');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'ERROR', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "password" TEXT,
    "totpSecret" TEXT,
    "totpEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "PropertyType" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DRAFT',
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "address" TEXT,
    "price" INTEGER NOT NULL,
    "livingArea" DOUBLE PRECISION,
    "totalArea" DOUBLE PRECISION,
    "roomCount" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "buildYear" INTEGER,
    "energyType" TEXT,
    "energyValue" DOUBLE PRECISION,
    "energyClass" TEXT,
    "energyCarrier" TEXT,
    "slug" TEXT,
    "micrositeUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "area" DOUBLE PRECISION,
    "description" TEXT,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Bucket" TEXT NOT NULL,
    "cdnUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "caption" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "variants" JSONB,
    "propertyId" TEXT,
    "roomId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT,
    "message" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'MICROSITE',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "gdprConsentAt" TIMESTAMP(3),
    "optInToken" TEXT,
    "optInAt" TIMESTAMP(3),
    "audit" JSONB,
    "propertyId" TEXT NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "platform" "ListingPlatform" NOT NULL,
    "externalId" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "lastSyncAt" TIMESTAMP(3),
    "syncError" TEXT,
    "publishedAt" TIMESTAMP(3),
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_status_city_idx" ON "properties"("status", "city");

-- CreateIndex
CREATE INDEX "properties_createdBy_status_idx" ON "properties"("createdBy", "status");

-- CreateIndex
CREATE UNIQUE INDEX "media_s3Key_key" ON "media"("s3Key");

-- CreateIndex
CREATE INDEX "media_propertyId_createdAt_idx" ON "media"("propertyId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leads_optInToken_key" ON "leads"("optInToken");

-- CreateIndex
CREATE INDEX "leads_propertyId_createdAt_idx" ON "leads"("propertyId", "createdAt");

-- CreateIndex
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt");

-- CreateIndex
CREATE INDEX "listings_propertyId_status_idx" ON "listings"("propertyId", "status");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
