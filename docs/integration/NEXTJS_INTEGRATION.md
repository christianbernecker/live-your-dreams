# Live Your Dreams Design System - Next.js Integration

## 🎯 **FOKUS: NUR NEXT.JS FÜR UNSER BACKOFFICE**

Das LYD Design System ist **speziell für unser Next.js Backoffice** optimiert. Keine unnötige Komplexität mit Angular, Vue oder anderen Frameworks.

---

## 📦 **INTEGRATION IN APPS/BACKOFFICE**

### **SCHRITT 1: Design System Komponenten laden**

```typescript
// apps/backoffice/app/layout.tsx
'use client';

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load LYD Design System Web Components
    import('@/lib/lyd-design-system');
  }, []);

  return (
    <html lang="de">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter">
        {children}
      </body>
    </html>
  );
}
```

### **SCHRITT 2: Design System Library erstellen**

```typescript
// apps/backoffice/lib/lyd-design-system.ts
// Live Your Dreams Design System für Next.js Backoffice

// Component Definitions für TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lyd-button': {
        variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
        size?: 'small' | 'medium' | 'large';
        disabled?: boolean;
        loading?: boolean;
        children?: React.ReactNode;
        onClick?: () => void;
      };
      'lyd-input': {
        label?: string;
        placeholder?: string;
        type?: string;
        variant?: 'default' | 'search' | 'currency' | 'area';
        disabled?: boolean;
        required?: boolean;
        value?: string;
        onChange?: (e: CustomEvent) => void;
      };
      'lyd-card': {
        variant?: 'default' | 'elevated' | 'glass' | 'outlined';
        hoverable?: boolean;
        clickable?: boolean;
        children?: React.ReactNode;
        onClick?: () => void;
      };
    }
  }
}

// Load Web Components
if (typeof window !== 'undefined') {
  // Button Component
  import('${process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL}/src/components/lyd-button.js');
  
  // Input Component  
  import('${process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL}/src/components/lyd-input.js');
  
  // Card Component
  import('${process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL}/src/components/lyd-card.js');
}

export {};
```

### **SCHRITT 3: Environment Variables**

```bash
# apps/backoffice/.env.local
NEXT_PUBLIC_DESIGN_SYSTEM_URL="http://designsystem.liveyourdreams.online"
```

---

## 🚀 **VERWENDUNG IM BACKOFFICE**

### **Property Management Page**

```tsx
// apps/backoffice/app/properties/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Load design system
    import('@/lib/lyd-design-system');
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Immobilien-Verwaltung
          </h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre Immobilienangebote
          </p>
        </div>
        
        <lyd-button 
          variant="primary" 
          size="large"
          onClick={() => window.location.href = '/properties/new'}
        >
          🏠 Neue Immobilie
        </lyd-button>
      </div>

      {/* Property Search */}
      <div className="mb-8">
        <lyd-card variant="elevated">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Immobilien suchen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <lyd-input
                variant="search"
                label="Standort"
                placeholder="München, Berlin, Hamburg..."
              />
              
              <lyd-input
                variant="currency"
                label="Maximaler Preis"
                placeholder="750000"
              />
              
              <lyd-input
                variant="area"
                label="Mindestgröße"
                placeholder="120"
              />
            </div>
            
            <div className="mt-4">
              <lyd-button variant="primary">
                🔍 Suchen
              </lyd-button>
              <lyd-button variant="outline" style="margin-left: 12px;">
                Filter zurücksetzen
              </lyd-button>
            </div>
          </div>
        </lyd-card>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <lyd-card key={property.id} variant="elevated" hoverable clickable>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">
                  €{property.price.toLocaleString()}
                </div>
                <lyd-button variant="primary" size="small">
                  Details
                </lyd-button>
              </div>
            </div>
          </lyd-card>
        ))}
      </div>
    </div>
  );
}
```

### **Lead Management Page**

```tsx
// apps/backoffice/app/leads/page.tsx
'use client';

import { useEffect } from 'react';

export default function LeadsPage() {
  useEffect(() => {
    import('@/lib/lyd-design-system');
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Lead-Management
        </h1>
        
        <div className="flex gap-3">
          <lyd-button variant="outline">
            📥 Import
          </lyd-button>
          <lyd-button variant="primary">
            ➕ Neuer Lead
          </lyd-button>
        </div>
      </div>

      {/* Lead Form */}
      <lyd-card variant="elevated">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Neuen Lead erfassen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <lyd-input
              label="Vorname"
              placeholder="Max"
              required
            />
            
            <lyd-input
              label="Nachname" 
              placeholder="Mustermann"
              required
            />
            
            <lyd-input
              type="email"
              label="E-Mail"
              placeholder="max.mustermann@email.com"
              required
            />
            
            <lyd-input
              type="tel"
              label="Telefon"
              placeholder="+49 123 456789"
            />
          </div>
          
          <div className="mt-6 flex gap-3">
            <lyd-button variant="primary" size="large">
              💾 Lead speichern
            </lyd-button>
            <lyd-button variant="ghost">
              Abbrechen
            </lyd-button>
          </div>
        </div>
      </lyd-card>
    </div>
  );
}
```

---

## 📋 **KOMPONENTEN-REFERENZ FÜR NEXT.JS**

### **🚀 LYD Button**
```tsx
<lyd-button 
  variant="primary|secondary|outline|ghost"
  size="small|medium|large"
  disabled={boolean}
  loading={boolean}
>
  Button Text
</lyd-button>
```

### **📝 LYD Input**
```tsx
<lyd-input
  label="Label Text"
  placeholder="Placeholder..."
  variant="default|search|currency|area"
  type="text|email|tel|number"
  required={boolean}
  disabled={boolean}
/>
```

### **🏠 LYD Card**
```tsx
<lyd-card
  variant="default|elevated|glass|outlined"
  hoverable={boolean}
  clickable={boolean}
>
  <div className="p-6">
    Card Content
  </div>
</lyd-card>
```

---

## 🎯 **BACKOFFICE-SPEZIFISCHE KOMPONENTEN**

### **Property Management Shortcuts**

```tsx
// Schnelle Property Actions
<lyd-button variant="primary" size="large">
  🏠 Neue Immobilie
</lyd-button>

<lyd-button variant="secondary">
  📊 Analytics
</lyd-button>

<lyd-button variant="outline">
  📄 Exposé generieren
</lyd-button>

<lyd-button variant="ghost">
  ⚙️ Einstellungen
</lyd-button>
```

### **Form Patterns**

```tsx
// Real Estate Form Pattern
<div className="space-y-4">
  <lyd-input variant="search" label="Immobilie suchen" />
  <lyd-input variant="currency" label="Preis" />
  <lyd-input variant="area" label="Wohnfläche" />
  
  <div className="flex gap-3 pt-4">
    <lyd-button variant="primary">Speichern</lyd-button>
    <lyd-button variant="outline">Vorschau</lyd-button>
  </div>
</div>
```

---

## 🔧 **TECHNISCHE IMPLEMENTATION**

### **TypeScript Support**

```typescript
// apps/backoffice/types/lyd-components.d.ts
export interface LydButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface LydInputProps {
  label?: string;
  placeholder?: string;
  variant?: 'default' | 'search' | 'currency' | 'area';
  type?: 'text' | 'email' | 'tel' | 'number';
  required?: boolean;
  disabled?: boolean;
}

export interface LydCardProps {
  variant?: 'default' | 'elevated' | 'glass' | 'outlined';
  hoverable?: boolean;
  clickable?: boolean;
}
```

### **Event Handling**

```tsx
// Event Listeners für LYD Components
useEffect(() => {
  const handleLydClick = (e: CustomEvent) => {
    console.log('LYD Component clicked:', e.detail);
  };

  const handleLydInput = (e: CustomEvent) => {
    console.log('Input value:', e.detail.value);
  };

  document.addEventListener('lyd-click', handleLydClick);
  document.addEventListener('lyd-input', handleLydInput);

  return () => {
    document.removeEventListener('lyd-click', handleLydClick);
    document.removeEventListener('lyd-input', handleLydInput);
  };
}, []);
```

---

## 📊 **VORTEILE DER NEXT.JS-FOKUSSIERUNG**

### **✅ VEREINFACHUNG:**
- **Ein Framework** - Keine Multi-Framework Komplexität
- **Fokussierte Entwicklung** - Optimiert für unser Backoffice
- **Bessere Performance** - Weniger Bundle-Größe
- **Einfachere Wartung** - Ein Codebase

### **✅ NEXT.JS OPTIMIERUNGEN:**
- **Server Components** ready
- **App Router** kompatibel
- **TypeScript** vollständig unterstützt
- **Tailwind CSS** Integration

---

## 🚀 **DEPLOYMENT AKTUALISIEREN**

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">docker build --platform linux/amd64 -f Dockerfile.designsystem -t lyd-design-system:nextjs-focused . && docker tag lyd-design-system:nextjs-focused 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:nextjs-focused && docker push 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:nextjs-focused && echo "✅ Next.js-fokussierte Version deployed"
