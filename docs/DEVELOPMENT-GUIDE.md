# 🚀 Live Your Dreams - Development Guide

## Quick Start für neue Entwickler

### 1. Setup Local Environment

```bash
# Repository klonen
git clone https://github.com/christianbernecker/live-your-dreams.git
cd live-your-dreams

# Node Version setzen (nvm)
nvm use 20

# Dependencies installieren
cd apps/backoffice
npm install

# Environment Variables
cp .env.example .env.local
# Editieren Sie .env.local mit Ihren Credentials

# Database Setup
docker-compose up -d postgres
npx prisma migrate dev
npx prisma db seed

# Development Server
npm run dev
# Öffnen: http://localhost:3000
```

---

## 📋 Development Workflow

### Feature Development

#### 1. Neue Komponente erstellen

```tsx
// components/properties/PropertyDetailCard.tsx
'use client';

import { Property } from '@/types/property';

interface PropertyDetailCardProps {
  property: Property;
  onEdit?: (id: string) => void;
}

export function PropertyDetailCard({ 
  property, 
  onEdit 
}: PropertyDetailCardProps) {
  return (
    <div className="component-card">
      <h3>{property.title}</h3>
      {/* Component Logic */}
    </div>
  );
}
```

#### 2. API Route implementieren

```typescript
// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { propertySchema } from '@/lib/validations/property';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await db.property.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        leads: {
          select: { id: true, status: true }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    const property = await db.property.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### 3. Validation Schema

```typescript
// lib/validations/property.ts
import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(5000),
  type: z.enum(['APARTMENT', 'HOUSE', 'PENTHOUSE', 'COMMERCIAL']),
  price: z.number().min(10000).max(100000000),
  livingArea: z.number().min(10).max(1000),
  roomCount: z.number().min(1).max(20),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  postcode: z.string().regex(/^\d{5}$/),
  
  // Optional fields
  hasBalcony: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  energyClass: z.string().regex(/^[A-H]\+?$/).optional(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
```

#### 4. Database Migration

```bash
# Schema ändern in prisma/schema.prisma
# Dann:
npx prisma migrate dev --name add_property_features

# Für Production:
npx prisma migrate deploy
```

---

## 🎨 Design System Usage

### Component Styling

```tsx
// ✅ RICHTIG - Design System CSS Variables
<div style={{
  padding: 'var(--spacing-lg)',
  backgroundColor: 'var(--lyd-white)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--lyd-line)'
}}>
  <h3 style={{ 
    color: 'var(--lyd-deep)',
    fontSize: 'var(--font-size-lg)'
  }}>
    {title}
  </h3>
</div>

// ❌ FALSCH - Keine Tailwind Classes!
<div className="p-6 bg-white rounded-lg border">
  <h3 className="text-gray-900 text-lg">{title}</h3>
</div>
```

### Button Components

```tsx
// Primary Button
<button className="lyd-button lyd-button-primary">
  Speichern
</button>

// Secondary Button
<button className="lyd-button lyd-button-secondary">
  Abbrechen
</button>

// Custom Button
<button style={{
  ...buttonBaseStyles,
  background: 'var(--lyd-gradient)',
  color: 'white',
  padding: '12px 24px'
}}>
  Custom Action
</button>
```

### Responsive Grid

```tsx
// Property Grid
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: 'var(--spacing-lg)'
}}>
  {properties.map(property => (
    <PropertyCard key={property.id} {...property} />
  ))}
</div>

// Dashboard Stats
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 'var(--spacing-md)'
}}>
  <StatCard title="Total" value={total} />
  <StatCard title="Active" value={active} />
</div>
```

---

## 🔄 State Management

### Client State mit React Hooks

```tsx
// hooks/useProperties.ts
import { useState, useEffect } from 'react';
import { Property } from '@/types/property';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data: PropertyInput) => {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      const newProperty = await res.json();
      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    }
    
    throw new Error('Failed to create property');
  };

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    create: createProperty
  };
}
```

### Server State mit Server Components

```tsx
// app/dashboard/page.tsx
import { db } from '@/lib/db';

async function getDashboardStats() {
  const [properties, leads, viewings] = await Promise.all([
    db.property.count(),
    db.lead.count({ where: { status: 'NEW' } }),
    db.viewing.findMany({
      where: { date: { gte: new Date() } },
      take: 5,
      orderBy: { date: 'asc' }
    })
  ]);

  return { properties, leads, viewings };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  
  return (
    <Dashboard stats={stats} />
  );
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
// components/PropertyCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PropertyCard } from './PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    price: 500000,
    city: 'München',
    livingArea: 75
  };

  it('renders property title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('€500.000')).toBeInTheDocument();
  });

  it('calculates price per m²', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('6.667 €/m²')).toBeInTheDocument();
  });
});
```

### API Tests

```typescript
// __tests__/api/properties.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/properties/route';

describe('/api/properties', () => {
  test('GET returns properties list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const json = JSON.parse(res._getData());
    expect(Array.isArray(json)).toBe(true);
  });

  test('POST creates new property', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'New Property',
        price: 400000,
        // ... other fields
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    
    const json = JSON.parse(res._getData());
    expect(json.title).toBe('New Property');
  });
});
```

### E2E Tests mit Playwright

```typescript
// e2e/properties.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Properties Management', () => {
  test('should display properties grid', async ({ page }) => {
    await page.goto('/properties');
    
    // Check if grid is visible
    await expect(page.locator('.property-grid')).toBeVisible();
    
    // Check if at least one property card exists
    await expect(page.locator('.property-card').first()).toBeVisible();
  });

  test('should filter properties by status', async ({ page }) => {
    await page.goto('/properties');
    
    // Click on Published filter
    await page.click('button:has-text("Veröffentlicht")');
    
    // Check if only published properties are shown
    const badges = await page.locator('.status-badge').allTextContents();
    badges.forEach(badge => {
      expect(badge).toBe('Veröffentlicht');
    });
  });

  test('should create new property', async ({ page }) => {
    await page.goto('/properties/new');
    
    // Fill form
    await page.fill('input[name="title"]', 'Test Property');
    await page.fill('input[name="price"]', '500000');
    await page.selectOption('select[name="type"]', 'APARTMENT');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Check redirect
    await expect(page).toHaveURL(/\/properties\/[\w-]+/);
    
    // Check success message
    await expect(page.locator('.success-toast')).toBeVisible();
  });
});
```

---

## 📦 Build & Deployment

### Production Build

```bash
# Build optimieren
npm run build

# Build analysieren
npm run analyze

# Production Preview
npm run start
```

### Docker Development

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci

# Source code (wird gemountet)
VOLUME ["/app"]

# Ports
EXPOSE 3000

# Development server
CMD ["npm", "run", "dev"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backoffice:
    build:
      context: ./apps/backoffice
      dockerfile: Dockerfile.dev
    volumes:
      - ./apps/backoffice:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/lyd
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: lyd
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## 🔍 Debugging

### VS Code Launch Config

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Debug Logging

```typescript
// lib/debug.ts
const DEBUG = process.env.NODE_ENV === 'development';

export function debugLog(component: string, message: string, data?: any) {
  if (!DEBUG) return;
  
  console.log(
    `%c[${component}]%c ${message}`,
    'color: #0066ff; font-weight: bold',
    'color: inherit',
    data || ''
  );
}

// Usage
debugLog('PropertyCard', 'Rendering property', { id: property.id });
```

---

## 📊 Performance Optimization

### Image Optimization

```tsx
// components/PropertyImage.tsx
import Image from 'next/image';

export function PropertyImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      quality={85}
      placeholder="blur"
      blurDataURL={generateBlurDataURL()}
      loading="lazy"
      style={{
        width: '100%',
        height: 'auto',
        objectFit: 'cover'
      }}
    />
  );
}
```

### Database Queries

```typescript
// ✅ Optimized - Select only needed fields
const properties = await db.property.findMany({
  select: {
    id: true,
    title: true,
    price: true,
    city: true,
    images: {
      select: { url: true },
      take: 1
    },
    _count: {
      select: { leads: true }
    }
  },
  take: 20,
  orderBy: { createdAt: 'desc' }
});

// ❌ Unoptimized - Fetches everything
const properties = await db.property.findMany({
  include: {
    images: true,
    leads: true,
    owner: true,
    rooms: true
  }
});
```

### Caching Strategy

```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getProperties = unstable_cache(
  async () => {
    return await db.property.findMany({
      where: { status: 'PUBLISHED' }
    });
  },
  ['properties'],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['properties']
  }
);

// Invalidate cache
import { revalidateTag } from 'next/cache';

export async function createProperty(data) {
  const property = await db.property.create({ data });
  revalidateTag('properties');
  return property;
}
```

---

*Erstellt für das Live Your Dreams Development Team*  
*Version 1.0.0 - September 2024*
