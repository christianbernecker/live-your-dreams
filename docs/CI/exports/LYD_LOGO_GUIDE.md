# LYD Logo-Varianten - Brand Guide

## 🎨 Logo-Übersicht

### **Basis-Design**
- **Sichel-Form:** Gradient von Deep Blue (#000066) zu Royal Blue (#3366CC)
- **Typographie:** System-UI/Apple System Sans-Serif
- **Format:** SVG (Vektor, skalierbar)
- **Farbschema:** Live Your Dreams Brand-Farben

---

## 📁 Verfügbare Varianten

### **Variante 1: LYD + Subline**
**Datei:** `LYD_Logo_Variant_1.svg`
```
[Sichel] LYD
         LIVE YOUR DREAMS
```
**Eigenschaften:**
- Haupttext "LYD": 120px, Bold (font-weight: 700)
- Subline: 72px, Light (font-weight: 300)
- Letter-spacing: 8px (Haupttext), 4px (Subline)

**Verwendung:**
- ✅ Website Header
- ✅ Business Cards 
- ✅ Dokumentationen
- ✅ E-Mail Signaturen

---

### **Variante 2: LYD Only (Large)**
**Datei:** `LYD_Logo_Variant_2.svg`
```
[Sichel] LYD
```
**Eigenschaften:**
- Haupttext "LYD": 360px, Medium (font-weight: 500)
- Keine Subline
- Letter-spacing: 25px
- Position: Y=560 (optimiert)

**Verwendung:**
- ✅ App Icons
- ✅ Social Media Profile
- ✅ Favicon-Basis
- ✅ Merchandise
- ✅ Große Displays/Poster

---

### **Variante 3: LYD | MAKLER**
**Datei:** `LYD_Logo_Makler.svg`
```
[Sichel] LYD | MAKLER
```
**Eigenschaften:**
- Haupttext "LYD": 360px, Medium (font-weight: 500)
- Zusatztext "| MAKLER": 160px, Light (font-weight: 300)
- Letter-spacing: 25px (LYD), 8px (MAKLER)

**Verwendung:**
- ✅ Makler-Services
- ✅ Immobilien-Marketing
- ✅ Business Development
- ✅ Spezialisierte Landingpages

---

### **Variante 4: LYD | WOHNEN**
**Datei:** `LYD_Logo_Wohnen.svg`
```
[Sichel] LYD | WOHNEN
```
**Eigenschaften:**
- Haupttext "LYD": 360px, Medium (font-weight: 500)
- Zusatztext "| WOHNEN": 160px, Light (font-weight: 300)
- Letter-spacing: 25px (LYD), 8px (WOHNEN)

**Verwendung:**
- ✅ Wohnungssuche-Services
- ✅ Mieter-fokussierte Inhalte
- ✅ Wohnen-in-München Branding
- ✅ Sub-Brand Marketing

---

## 🎯 Brand-Farben

```css
/* Primäre Farben */
--deep-blue: #000066    /* Gradient Start */
--royal-blue: #3366CC   /* Gradient Ende */

/* Verwendung */
background: linear-gradient(to bottom, #3366CC, #000066);
```

---

## 📐 Technische Specs

### **Canvas-Größe**
- **Breite:** 2000pt (2000px)
- **Höhe:** 700pt (700px)  
- **ViewBox:** 0 0 2000 700
- **Aspect Ratio:** ~2.86:1

### **Sichel-Position**
- **Transform:** translate(0, 700) scale(0.1, -0.1)
- **Fill:** Linear Gradient (crescentGradient)

### **Text-Positionierung**
- **X-Offset:** 370pt
- **Y-Position Variante 1:** 440pt (LYD), 540pt (Subline)  
- **Y-Position Variante 2:** 480pt (zentriert)

---

## 🚀 Backoffice Integration

### **Aktueller Status**
```typescript
// apps/backoffice/app/page.tsx - Zeile 10
<h1 className="text-4xl font-bold text-brand mb-4">Live Your Dreams</h1>
```

### **Logo-Integration Vorschlag**
```jsx
// Variante 1: Mit SVG Komponente
<div className="flex items-center">
  <img src="/logo/LYD_Logo_Variant_1.svg" alt="LYD" className="h-12" />
</div>

// Variante 2: Als Background/Hero
<div className="bg-gradient-to-b from-royal-blue to-deep-blue">
  <img src="/logo/LYD_Logo_Variant_2.svg" alt="LYD" className="h-24" />
</div>
```

---

## 📱 Responsive Verwendung

### **Desktop (>1024px)**
- Variante 1: Header-Logo
- Variante 2: Hero-Section

### **Tablet (768px - 1024px)** 
- Variante 1: Kompakt im Header
- Variante 2: Skaliert für Touch-Targets

### **Mobile (<768px)**
- Variante 2: Icon-Style
- Simplified Version ohne Subline

---

## ✅ Do's and Don'ts

### **✅ DO:**
- SVG-Format für Web verwenden
- Original-Proportionen beibehalten
- Brand-Farben verwenden (#000066, #3366CC)
- Auf ausreichend Kontrast achten

### **❌ DON'T:**
- Logo verzerren oder stauchen
- Andere Farben verwenden
- Sichel-Element entfernen
- Text-Hierarchie ändern

---

## 🔄 Export-Formate

### **Für Web/Digital**
- SVG (verlustfrei, responsive)
- PNG (2000x700px für Raster-Apps)

### **Für Print**
- SVG zu PDF konvertieren
- Oder EPS für professionellen Druck

### **Für Social Media**
- PNG 400x400px (quadratisch)
- PNG 1200x400px (Banner)

**Tipp:** Verwende SVG wo immer möglich - es ist zukunftssicher und skaliert perfekt!
