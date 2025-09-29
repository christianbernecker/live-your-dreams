# Design System Integration Guide

**Live Your Dreams Backoffice - Enterprise Design System Architecture**

## 🎯 Übersicht

Dieses Dokument beschreibt die korrekte Integration des Live Your Dreams Design Systems in neue und bestehende Backoffice-Seiten. Nach der erfolgreichen Migration von externen CSS-Dependencies zu einer robusten, lokalen Design System Architektur ist dies der definitive Guide für Entwickler.

## 🏗️ Architektur

### Lokales Design System (packages/design-system/)
```
packages/design-system/
├── dist/master.css          # 46KB, 176 CSS Classes
├── scripts/build-css.js     # Build-Pipeline  
└── package.json            # Lokales Package
```

### UI Components (packages/ui/)
```
packages/ui/
├── src/components/
│   ├── button/Button.tsx    # Enterprise Button Component
│   ├── table/Table.tsx      # Professional Table System
│   └── badge/Badge.tsx      # Status Badge System
├── stories/                 # Storybook Documentation
└── .storybook/             # Component Playground
```

## ✅ GOLDSTANDARD: Admin Users Page

Die `/admin/users` Page ist das **Referenz-Beispiel** für perfekte Design System Integration:

```tsx
// ✅ KORREKTE CSS KLASSEN
<table className="api-table">           // NICHT .lyd-table
  <tbody>
    <tr>
      <td>
        <span className="luxury-badge">  // NICHT .table-badge
          ADMINISTRATOR
        </span>
      </td>
      <td>
        <div className="table-actions">
          <button className="lyd-button ghost icon-only">  // Design System Button
            <svg>...</svg>
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

## 🎨 Design System CSS Klassen

### ✅ KORREKTE Klassen (verwende diese):
```css
/* Tables */
.api-table              → Professional table styling
.luxury-badge           → Status badges with colors  
.table-actions          → Action button containers

/* Buttons */
.lyd-button            → Base button class
.lyd-button.primary    → Primary button (gradient)
.lyd-button.secondary  → Secondary button  
.lyd-button.ghost      → Ghost button for subtle actions
.lyd-button.icon-only  → Icon-only buttons for actions

/* Cards & Layout */
.lyd-card              → Base card styling
.lyd-card.elevated     → Card with elevation
.lyd-grid              → Grid system
.lyd-stack             → Vertical spacing stack
```

### ❌ FALSCHE Klassen (verwende diese NICHT):
```css
.lyd-table            → Existiert nicht! Use .api-table
.table-badge          → Existiert nicht! Use .luxury-badge  
.table-action         → Existiert nicht! Use .lyd-button ghost icon-only
.btn                  → Verwende .lyd-button
```

## 🔧 Migration Patterns

### 1. Inline Styles → Design System Tokens

❌ **VORHER (Schlecht):**
```tsx
<div style={{
  fontSize: '18px',
  fontWeight: 'bold', 
  color: '#3b82f6',
  marginBottom: '16px'
}}>
  Überschrift
</div>
```

✅ **NACHHER (Korrekt):**
```tsx
<div style={{
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--lyd-primary)',
  marginBottom: 'var(--spacing-md)'
}}>
  Überschrift
</div>
```

### 2. Native HTML → Design System Components

❌ **VORHER (Schlecht):**
```tsx
<button className="bg-blue-500 text-white px-4 py-2">
  Submit
</button>
```

✅ **NACHHER (Korrekt):**
```tsx
<button className="lyd-button primary">
  Submit  
</button>
```

### 3. Custom Tables → Enterprise Tables

❌ **VORHER (Schlecht):**
```tsx
<table className="min-w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3">Name</th>
    </tr>
  </thead>
</table>
```

✅ **NACHHER (Korrekt):**
```tsx
<table className="api-table">
  <thead>
    <tr>
      <th>Name</th>
    </tr>  
  </thead>
</table>
```

## 📋 Migration Checklist

Für jede neue/bestehende Page:

### CSS Integration
- [ ] `@import '/master.css'` in globals.css  
- [ ] Inline styles → Design System tokens
- [ ] Custom CSS classes → Design System classes
- [ ] Color values → CSS variables

### Components  
- [ ] Native buttons → `.lyd-button` classes
- [ ] Custom tables → `.api-table` system
- [ ] Status indicators → `.luxury-badge`
- [ ] Cards → `.lyd-card` variants

### Layout
- [ ] Grid system → `.lyd-grid` classes
- [ ] Spacing → `.lyd-stack` or CSS variables
- [ ] Typography → Design System font tokens

### Testing
- [ ] Visual verification auf Live-URL
- [ ] Playwright tests aktualisiert
- [ ] Storybook stories erstellt (optional)

## 🧪 Testing & Verification

### 1. Visual Verification
```bash
npm run deploy                    # Deploy to Vercel
curl https://backoffice.../page   # Verify accessibility
```

### 2. Playwright Visual Tests  
```bash
npm run test:visual              # Screenshot comparisons
npm run test:visual:update       # Update baselines
```

### 3. Storybook Development
```bash
cd packages/ui
npm run storybook               # Interactive component development
```

## 🎯 Best Practices

### DO ✅
- Verwende immer Design System CSS-Klassen
- Teste auf Live-URL nach jeder Änderung  
- Dokumentiere neue Component-Patterns
- Halte Inline-Styles minimal (nur DS-Tokens)
- Befolge die Admin Users Page als Goldstandard

### DON'T ❌
- Keine externen CSS-Dependencies
- Keine nicht-existierenden Klassen (.lyd-table)
- Keine hardcoded colors/fonts
- Keine Custom-Components ohne DS-Integration
- Keine ungetesteten Deployments

## 🚀 Deployment Workflow

1. **Entwicklung:** Lokale Änderungen testen
2. **Build:** `npm run build` erfolgreich  
3. **Deploy:** `npm run deploy` 
4. **Verify:** Live-URL prüfen
5. **Test:** Playwright Visual Tests
6. **Document:** Updates in Guide/Playbook

## 📚 Ressourcen

- **Live Demo:** https://backoffice.liveyourdreams.online/admin/users
- **Storybook:** `packages/ui` Component Library
- **Visual Tests:** `apps/backoffice/tests/visual/`
- **Design System:** `packages/design-system/dist/master.css`

## 🔄 Updates

Dieses Dokument wird kontinuierlich aktualisiert. Bei Fragen oder Verbesserungsvorschlägen siehe Migration Playbook.

---

**Version:** 1.0  
**Letzte Aktualisierung:** 2024-09-26  
**Status:** Enterprise-Grade Architecture Aktiv

