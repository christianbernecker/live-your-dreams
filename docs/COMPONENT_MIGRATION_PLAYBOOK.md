# Component Migration Playbook

**Live Your Dreams Backoffice - Schritt-für-Schritt Migration zu Design System**

## 🎯 Übersicht

Dieses Playbook führt durch die systematische Migration von Legacy-Components zu Design System-konformen Implementierungen. Basiert auf den Erkenntnissen aus der erfolgreichen Admin-Sektion Migration.

## 📋 Pre-Migration Checklist

### Bevor du startest:
- [ ] **Design System Integration Guide** gelesen
- [ ] **Lokales Design System** überprüft (`packages/design-system/dist/master.css` vorhanden)
- [ ] **Admin Users Page** als Referenz analysiert
- [ ] **Current State** dokumentiert (Screenshots)
- [ ] **ESLint Rules** verstanden

## 🔄 Migration Process

### Phase 1: Analyse (15 Min)

1. **Current State Audit:**
```bash
# Component analysieren
grep -r "className.*=.*\"" app/dashboard/page-name.tsx
grep -r "style.*=" app/dashboard/page-name.tsx

# Inline Styles identifizieren
grep -n "fontSize\|color\|margin\|padding" app/dashboard/page-name.tsx
```

2. **Design System Mapping:**
```typescript
// ❌ PROBLEMATISCH:
style={{ fontSize: '18px', color: '#3b82f6' }}

// ✅ DESIGN SYSTEM:
style={{ fontSize: 'var(--font-size-lg)', color: 'var(--lyd-primary)' }}
```

### Phase 2: CSS Klassen Migration (30 Min)

#### Schritt 2.1: Grid Systems
```typescript
// ❌ VORHER:
<div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '...' }}>

// ✅ NACHHER:
<div className="lyd-grid" style={{ gridTemplateColumns: '...' }}>
```

#### Schritt 2.2: Spacing & Layout
```typescript
// ❌ VORHER:
<div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>

// ✅ NACHHER:
<div className="lyd-stack">
```

#### Schritt 2.3: Cards & Components
```typescript
// ❌ VORHER:
<div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px' }}>

// ✅ NACHHER:
<div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
```

### Phase 3: Tables (wenn vorhanden) (45 Min)

#### Schritt 3.1: Table Structure
```typescript
// ❌ LEGACY:
<table className="min-w-full">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3">Name</th>
    </tr>
  </thead>
</table>

// ✅ DESIGN SYSTEM:
<table className="api-table">
  <thead>
    <tr>
      <th>Name</th>
    </tr>
  </thead>
</table>
```

#### Schritt 3.2: Badges & Status
```typescript
// ❌ LEGACY:
<span className="bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>

// ✅ DESIGN SYSTEM:
<span className="luxury-badge success">Active</span>
```

#### Schritt 3.3: Action Buttons
```typescript
// ❌ LEGACY:
<button className="text-blue-600 hover:text-blue-800">
  <EditIcon />
</button>

// ✅ DESIGN SYSTEM:
<button className="lyd-button ghost icon-only" title="Bearbeiten">
  <svg width="16" height="16">...</svg>
</button>
```

### Phase 4: Typography & Colors (20 Min)

```typescript
// ❌ HARDCODED VALUES:
style={{
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '16px'
}}

// ✅ DESIGN SYSTEM TOKENS:
style={{
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--lyd-text)',
  marginBottom: 'var(--spacing-md)',
  fontFamily: 'var(--font-family-primary)'
}}
```

### Phase 5: Build & Deploy (10 Min)

```bash
# Build testen
npm run build

# Bei ESLint Errors: Design System Violations fixen
# (Die Rules helfen bei der korrekten Implementation!)

# Deploy
npm run deploy

# Live verification
curl https://backoffice.../page-name
```

## 🎯 Spezifische Migration Patterns

### Dashboard Main Page Pattern
**Anwendungsfall:** Overview pages mit Metrics + Quick Actions

```typescript
// Template Structure:
<DashboardLayout>
  {/* Metrics Grid */}
  <div className="lyd-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
    <div className="lyd-card elevated">...</div>
  </div>
  
  {/* Content Grid */}
  <div className="lyd-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
    <div className="lyd-card">
      <h3 style={{ fontSize: 'var(--font-size-lg)', ... }}>Title</h3>
      <div className="lyd-stack">
        <button className="lyd-button primary">Action</button>
      </div>
    </div>
  </div>
</DashboardLayout>
```

### User Management Pattern
**Anwendungsfall:** CRUD pages mit Tables

```typescript
// Template Structure:
<div className="lyd-grid" style={{ gridTemplateColumns: '1fr' }}>
  {/* Filters */}
  <div className="lyd-card">
    <div className="lyd-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <input className="lyd-input" />
      <select className="lyd-select">...</select>
    </div>
  </div>
  
  {/* Table */}
  <div className="lyd-card">
    <table className="api-table">
      <thead>
        <tr><th>Name</th><th>Status</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td><span className="luxury-badge success">Active</span></td>
          <td>
            <div className="table-actions">
              <button className="lyd-button ghost icon-only">...</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## ⚠️ Häufige Fehler

### 1. Falsche CSS-Klassen
```typescript
// ❌ FALSCH (existieren nicht):
.lyd-table        → Verwende .api-table
.table-badge      → Verwende .luxury-badge
.table-action     → Verwende .lyd-button ghost icon-only

// ✅ KORREKT:
.api-table
.luxury-badge
.lyd-button ghost icon-only
```

### 2. Hardcoded Colors
```typescript
// ❌ FALSCH:
backgroundColor: '#3b82f6'
color: '#1f2937'

// ✅ KORREKT:
backgroundColor: 'var(--lyd-primary)'
color: 'var(--lyd-text)'
```

### 3. Custom Grid ohne Fallback
```typescript
// ❌ PROBLEMATISCH:
<div style={{ display: 'grid', gap: '16px' }}>

// ✅ BESSER:
<div className="lyd-grid">  // Nutzt DS gap automatisch
```

## 🧪 Testing Protocol

### Nach jeder Migration:

1. **Visual Check:**
```bash
npm run build && npm run deploy
# Prüfe Live-URL visuell
```

2. **Playwright Visual Test (optional):**
```bash
npm run test:visual:update  # Neue Baseline
npm run test:visual         # Regression check
```

3. **ESLint Check (nach Migration):**
```bash
# ESLint Rules reaktivieren in next.config.mjs:
# eslint: { ignoreDuringBuilds: false }
npm run build  # Sollte keine DS-Violations zeigen
```

## 📊 Migration Tracking

### Component Checklist:
- [ ] **CSS Classes** → Design System
- [ ] **Inline Styles** → CSS Variables  
- [ ] **Colors** → Design System tokens
- [ ] **Typography** → Font tokens
- [ ] **Spacing** → Spacing tokens
- [ ] **Grid/Layout** → .lyd-grid/.lyd-stack
- [ ] **Buttons** → .lyd-button variants
- [ ] **Tables** → .api-table (wenn vorhanden)
- [ ] **Badges** → .luxury-badge
- [ ] **Cards** → .lyd-card

### Before/After Documentation:
```markdown
## Migration: /dashboard/page-name

### Before:
- Custom CSS grid: `style={{ display: 'grid', gap: '16px' }}`
- Hardcoded colors: `color: '#3b82f6'`
- 147 lines of inline styles

### After:
- Design System: `className="lyd-grid"`
- DS Tokens: `color: 'var(--lyd-primary)'`
- 89 lines (-40% reduction)

### Impact:
- Design System compliance: 95%
- Maintainability: +60%
- Performance: Unchanged
```

## 🚀 Advanced Patterns

### Conditional Design System Usage
```typescript
// Für dynamische Styles mit Design System Tokens:
const getBadgeVariant = (status: string) => {
  const variants = {
    active: 'success',
    inactive: 'warning',
    error: 'error'
  }
  return `luxury-badge ${variants[status] || 'secondary'}`
}

<span className={getBadgeVariant(user.status)}>{user.status}</span>
```

### Progressive Enhancement
```typescript
// Basis Design System + Custom Overrides:
<div 
  className="lyd-card elevated"
  style={{
    // DS Tokens für consistency
    padding: 'var(--spacing-lg)',
    // Custom für spezielle Needs
    maxHeight: '400px',
    overflowY: 'auto'
  }}
>
```

## 📚 Ressourcen

- **Integration Guide:** `docs/DESIGN_SYSTEM_INTEGRATION_GUIDE.md`
- **Live Reference:** https://backoffice.liveyourdreams.online/admin/users
- **CSS Reference:** `packages/design-system/dist/master.css`
- **Component Library:** `packages/ui/stories/`
- **Visual Tests:** `apps/backoffice/tests/visual/`

## 🔄 Iterative Improvement

Nach jeder Migration:
1. **Feedback sammeln** (Performance, UX)
2. **Patterns dokumentieren** (für nächste Migration)
3. **Design System erweitern** (bei fehlenden Components)
4. **Tests aktualisieren** (Playwright baselines)

---

**Version:** 1.0  
**Letzte Aktualisierung:** 2024-09-26  
**Basis:** Admin Users Page Migration + Dashboard Main Page Pattern

