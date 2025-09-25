# Vercel Backoffice Deployment Guide

**Updated:** 2025-09-25  
**Status:** Production Ready mit Design System Foundations

---

## 🎯 **Deployment Strategy**

**WICHTIG:** Deploye **nur das Backoffice**, nicht das gesamte Projekt für bessere Performance und Isolation.

### **Kommando für isoliertes Backoffice-Deployment:**

```bash
# Im Backoffice-Verzeichnis
cd apps/backoffice
vercel --prod --yes
```

### **Warum isoliert deployen?**
- ✅ **Schnellere Builds** - Nur relevante Files werden uploaded
- ✅ **Weniger Build-Konflikte** - Keine Storybook/Design System Build-Issues
- ✅ **Bessere Performance** - Kleinere Deployment-Pakete
- ✅ **Stabilere Deployments** - Isolierte Dependencies

---

## 📦 **Aktuelle Production URLs**

### **Live Applications:**
- **Backoffice (Vercel):** https://lyd-backoffice.vercel.app
- **Design System:** https://designsystem.liveyourdreams.online
- **Custom Domain:** https://backoffice.liveyourdreams.online *(DNS routing issue)*

### **Key Pages:**
- **Login:** https://lyd-backoffice.vercel.app/login
- **Dashboard:** https://lyd-backoffice.vercel.app/dashboard
- **Properties:** https://lyd-backoffice.vercel.app/properties

---

## 🏗️ **Design System Foundations Architecture**

### **CSS Cascade Layers:**
```css
@layer tokens, base, components, utilities, app;
```

**Predictable Priority Order:**
1. **tokens** - CSS Custom Properties (Lowest priority)
2. **base** - Reset + Basic Typography
3. **components** - UI Component Styles
4. **utilities** - Helper Classes
5. **app** - Application-specific overrides (Highest priority)

### **Import Structure:**
```css
/* apps/backoffice/app/globals.css */
@import "../../../packages/design-tokens/css/index.css" layer(tokens);
@import "../../../packages/design-system/base.css" layer(base);
@import "../../../packages/design-system/components.css" layer(components);
@import "../../../packages/design-system/utilities.css" layer(utilities);
```

---

## 🔧 **Build Process**

### **Pre-Deployment Checklist:**
```bash
# 1. Build Test
cd apps/backoffice
npm run build

# 2. Visual Test (optional)
npm run test

# 3. Deploy
vercel --prod --yes
```

### **Dependencies Verified:**
- ✅ Next.js 14.2.33
- ✅ next/font optimization
- ✅ Design System CSS Foundations
- ✅ @layer cascade structure

---

## 🧪 **Testing Strategy**

### **Visual Regression Tests:**
```bash
cd apps/backoffice
npm run test:ui
```

### **Accessibility Tests:**
```bash
npm run test -- --grep "a11y"
```

### **Update Snapshots (nach Design-Änderungen):**
```bash
npm run test:update
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Module not found Errors**
```bash
# Problem: Relative imports nicht gefunden
# Lösung: Prüfe @import Pfade in globals.css
```

#### **2. CSS nicht angewendet**
```bash
# Problem: @layer Reihenfolge falsch
# Lösung: Prüfe @layer Definition in globals.css
```

#### **3. Font Loading Issues**
```bash
# Problem: next/font nicht korrekt konfiguriert
# Lösung: Prüfe Inter Font Import in layout.tsx
```

### **Emergency Rollback:**
```bash
# Falls Deployment fehlschlägt
vercel --prod --yes --force
```

---

## 📊 **Performance Metrics**

### **Aktuelle Build Performance:**
- **Build Time:** ~30s
- **Bundle Size:** 87.3 kB shared JS
- **Routes:** 28 pages generated
- **Lighthouse Score:** TBD (nach vollem DS-Integration)

### **Design System Integration:**
- ✅ **CSS Cascade Layers** - Predictable Priority
- ✅ **Design Tokens** - CSS Custom Properties
- ✅ **next/font** - Zero Layout Shift
- ✅ **No Global Hacks** - Kein `:has()` oder z-index nuclear

---

## 🔄 **Rollout Process**

### **1. Development:**
```bash
cd apps/backoffice
npm run dev
# Test unter http://localhost:3000
```

### **2. Testing:**
```bash
npm run test
npm run test:ui
```

### **3. Deployment:**
```bash
vercel --prod --yes
```

### **4. Verification:**
- Teste Login-Seite: https://lyd-backoffice.vercel.app/login
- Prüfe Design System Integration
- Verifiziere Performance

---

**✅ PATCH DEPLOYMENT GUIDE - Design System Foundations mit @layer erfolgreich implementiert und deployed!**
