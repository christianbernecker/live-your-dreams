# Life Your Dreams - Architektur-Entscheidungen

## Design System Philosophie

### ✅ **CSS-Module First (KEIN Tailwind in Components)**

**Entscheidung:** Das Life Your Dreams Design System verwendet ausschließlich CSS-Module mit Design Token Integration.

```
Design System Components (packages/design-system-react):
├── Button → .lds-button, .lds-button--primary
├── Input → .lds-input, .lds-input--error  
├── Card → .lds-card, .lds-card-header
└── Badge → .lds-badge, .lds-badge--success

CSS-Module (packages/design-system/src/styles/components):
├── button.css → var(--color-brand-primary)
├── input.css → var(--typography-font-size-base)
└── card.css → var(--radius-lg)
```

**Warum CSS-Module statt Tailwind?**
- **Brand Consistency:** Zentrale Kontrolle über alle Styles
- **Token Integration:** Automatische Verwendung von Design Tokens
- **Performance:** Kleinere Bundle-Größen
- **Maintenance:** Änderungen an einem Ort, nicht in jedem Component

### ✅ **Backoffice Architektur**

**Entscheidung:** Backoffice darf Tailwind für **Layout** nutzen, aber importiert LDS Components für **UI-Elemente**.

```tsx
// ✅ ERLAUBT - Layout mit Tailwind:
<div className="min-h-screen bg-gray-50 py-8">
  <div className="max-w-7xl mx-auto px-4">
    
    // ✅ ERLAUBT - LDS Components:
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>Immobilien</LdsCardTitle>
      </LdsCardHeader>
      
      <LdsTable>
        <LdsButton variant="primary">Neu anlegen</LdsButton>
      </LdsTable>
    </LdsCard>
    
  </div>
</div>

// ❌ VERBOTEN - Tailwind für UI-Components:
<button className="bg-blue-500 text-white px-4 py-2">❌</button>

// ✅ KORREKT - LDS Component:
<LdsButton variant="primary">✅</LdsButton>
```

## Build-Pipeline

### Sequenzielle Builds (Dependencies)

```
1. design-tokens → CSS + TypeScript
2. design-system → CSS-Module + Types  
3. design-system-react → React Components
4. backoffice → Next.js App
5. designsystem-docs → Storybook
```

**Root Commands:**
- `pnpm build:libs` - Baut alle Libraries sequenziell
- `pnpm build:apps` - Baut alle Applications
- `pnpm build` - Komplett-Build in korrekter Reihenfolge

## Development Workflow

### 1. Design Token Änderungen
```bash
cd packages/design-tokens
# Edit tokens/base.json
pnpm build
# Automatisch verfügbar in CSS via var(--new-token)
```

### 2. Component Änderungen  
```bash
cd packages/design-system
# Edit src/styles/components/button.css
pnpm build

cd ../design-system-react
# Edit src/components/button.tsx (nur CSS-Klassen!)
pnpm build
```

### 3. Backoffice Development
```bash
cd apps/backoffice
pnpm dev
# Nutzt automatisch neueste LDS Components
```

## Qualitätssicherung

### Branding-Guards
- `pnpm check:brand` - Blockiert Build bei Fremd-Branding
- Ausschlüsse: `docs/` (externe Referenzen), `scripts/` (Check selbst)

### Testing-Strategie
- **Unit Tests:** Jest für React Components
- **A11y Tests:** axe-core in Storybook
- **Integration Tests:** Playwright für Backoffice
- **Visual Tests:** Storybook Chromatic (geplant)

## Deployment

### Interne Design System Docs
- **URL:** `designsystem.lifeyourdreams.de`
- **Auth:** Basic Auth (nicht öffentlich)
- **Headers:** `X-Robots-Tag: noindex, nofollow`

### Backoffice
- **Auth:** NextAuth.js mit Credentials Provider
- **Database:** PostgreSQL mit Prisma
- **Storage:** S3/MinIO für Media
- **Security:** CSP, Rate-Limiting, Protected Routes
