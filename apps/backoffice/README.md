# Live Your Dreams - Backoffice V2

> **Design System Clean Implementation** - Komplette Neuentwicklung basierend auf [designsystem.liveyourdreams.online](https://designsystem.liveyourdreams.online)

## 🎯 Überblick

Das LYD Backoffice V2 ist eine vollständige Neuimplementierung mit fokussierter Design System Integration. Alle UI-Komponenten basieren direkt auf unserem zentralen Design System.

## 🚀 Quick Start

```bash
# Development Server starten
npm run dev

# Production Build
npm run build

# Type Checking
npm run type-check

# Deployment zu Vercel
npm run deploy
```

## 📐 Architektur

### Design System Integration
- **Master CSS Import**: Direkter Import von `designsystem.liveyourdreams.online/shared/master.css`
- **CSS Cascade Layers**: Strukturierte Integration über `@layer` Direktiven
- **Design Tokens**: Konsistente Verwendung von `--lyd-*` CSS-Variablen
- **Komponenten**: Authentische DS-Komponenten (`.lyd-button`, `.lyd-input`, etc.)

### Sicherheit
- **CSP Headers**: Content Security Policy über `middleware.ts`
- **Security Headers**: HSTS, X-Frame-Options, etc.
- **Error Boundaries**: Robuste Fehlerbehandlung über React Error Boundaries
- **Rate Limiting**: Vorbereitet für API-Schutz

### Performance
- **Next.js 14**: App Router mit optimiertem Build
- **Image Optimization**: Automatische Bildoptimierung
- **Turbo Mode**: Entwicklungsserver mit Turbo-Engine
- **Bundle Analyze**: Optional über `npm run analyze`

## 🔧 Entwicklung

### Lokale Entwicklung
1. **Environment Setup**:
   ```bash
   cp .env.local.example .env.local
   # Werte anpassen
   ```

2. **Development Server**:
   ```bash
   npm run dev
   # Öffnet: http://localhost:3001
   ```

### Deployment
```bash
# Preview Deployment
npm run deploy-preview

# Production Deployment  
npm run deploy
```

## 🎨 Design System Usage

### CSS Integration
Das Design System wird zentral über `app/globals.css` importiert:

```css
/* Direkter Import vom Live Design System */
@import url('https://designsystem.liveyourdreams.online/shared/master.css');

/* Lokale Erweiterungen in Cascade Layers */
@layer app {
  /* App-spezifische Styles */
}
```

### Komponenten
```tsx
// Authentische Design System Komponenten
<button className="lyd-button primary large">
  Anmelden
</button>

<div className="lyd-input-wrapper has-icon">
  <svg className="lyd-input-icon">...</svg>
  <input className="lyd-input" />
</div>

<div className="lyd-card elevated">
  <div className="lyd-card-header">...</div>
  <div className="lyd-card-body">...</div>
</div>
```

## 🛡️ Sicherheit

### Konfigurierte Security Features
- **Content Security Policy** (CSP)
- **HTTP Strict Transport Security** (HSTS)
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer Policy**: `strict-origin-when-cross-origin`

### Middleware Security
Alle Sicherheitsheader werden über `middleware.ts` gesetzt und gelten für alle Routes außer API-Auth.

## 📁 Verzeichnisstruktur

```
apps/backoffice/
├── app/
│   ├── components/          # React Komponenten
│   │   └── ErrorBoundary.tsx
│   ├── globals.css          # Design System Integration
│   ├── layout.tsx           # Root Layout mit Error Boundaries
│   └── page.tsx             # Login Page
├── middleware.ts            # Security Headers & CORS
├── next.config.mjs          # Next.js Konfiguration
└── package.json             # Dependencies & Scripts
```

## 🌐 Deployment

### Production URL
- **Live**: [backoffice.liveyourdreams.online](https://backoffice.liveyourdreams.online)
- **Vercel**: `backoffice-[hash]-christianberneckers-projects.vercel.app`

### DNS Konfiguration
```
backoffice.liveyourdreams.online CNAME cname.vercel-dns.com
```

## 📝 Logs & Monitoring

### Development
- **Build Logs**: Lokale Next.js Build-Ausgabe
- **Runtime Errors**: Console + Error Boundaries

### Production
- **Vercel Analytics**: Automatisches Performance-Monitoring
- **Error Tracking**: Error Boundaries mit Production-Logging
- **Security Headers**: Automatische CSP-Durchsetzung

## 🚧 Roadmap

- [ ] NextAuth.js Integration
- [ ] Database Schema (Users, Sessions)
- [ ] Dashboard Nach-Login Seiten
- [ ] API Routes für Backoffice-Funktionen
- [ ] Playwright E2E Tests

## 🤝 Contributing

1. **Design System First**: Alle UI-Änderungen zuerst im [Design System](https://designsystem.liveyourdreams.online)
2. **CSS Cascade Layers**: Neue Styles nur über Cascade Layers
3. **TypeScript Strict**: Vollständige Type-Safety erforderlich
4. **Security Headers**: Alle Routes müssen sichere Headers haben

---

**💡 Design System Integration Learnings**: Siehe [`/docs/DESIGN_SYSTEM_INTEGRATION_LEARNINGS.md`](/docs/DESIGN_SYSTEM_INTEGRATION_LEARNINGS.md) für bewährte Praktiken.