# Component Development Standards - Post Dropdown Epic

## Engineering-First Development Principles

### Component Reliability Hierarchy (Proven)
```
1. Custom Components + Design System CSS    (100% Kontrolle)
2. Native HTML + Design System CSS          (95% Kontrolle) 
3. Design System CSS Classes Only           (90% Kontrolle)
4. Design System Components                  (60% Kontrolle - RISK)
```

## Pre-Development Checklist

### CSS-First Verification
- [ ] Relevante CSS-Klassen existieren in `master.css`?
- [ ] CSS Custom Properties definiert für Styling?
- [ ] Spacing-Systematik konsistent (32px Standard)?
- [ ] Mobile-responsive Regeln vorhanden?

### Component API Skepticism  
- [ ] Component State Management zuverlässig?
- [ ] Alle Props funktionieren in Production?
- [ ] TypeScript-Typen korrekt definiert?
- [ ] Event-Handler propagieren korrekt?

## Development Standards

### Custom Component Architecture
```typescript
// Standard Custom Component Pattern
interface CustomComponentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string; }>;
}

const CustomComponent: React.FC<CustomComponentProps> = ({ 
  value, onChange, placeholder, options 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.component-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="component-container">
      {/* Implementation */}
    </div>
  );
};
```

### CSS-in-JS für Critical Styles
```typescript
// styled-jsx für !important Regeln
<style jsx>{`
  .component-trigger:focus {
    border-color: var(--lyd-primary, #3b82f6) !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
  }
  .component-option:hover {
    background-color: var(--lyd-gray-50, #f9fafb) !important;
  }
`}</style>
```

## Layout Standards

### Consistent Spacing System
```css
/* Standard Gap-Systematik */
--spacing-xs: 8px;   /* Inline-Elemente */
--spacing-sm: 16px;  /* Component-Interne Abstände */
--spacing-md: 24px;  /* Section-Abstände */ 
--spacing-lg: 32px;  /* Card-Abstände (Standard) */
--spacing-xl: 48px;  /* Page-Section-Abstände */
```

### Flexbox Layout Pattern
```typescript
// Standard Layout Container
<div style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '32px' // Standard Card-Spacing
}}>
  <div className="lyd-card">{/* Header */}</div>
  <div className="lyd-card">{/* Filters */}</div>  
  <div className="lyd-card">{/* Content */}</div>
</div>
```

## Quality Assurance

### Build-Pipeline as Quality Gate
- TypeScript Compilation = Funktionale Qualität
- ESLint Rules = Code Style Qualität  
- Live Deployment = Visual Qualität
- User Testing = UX Qualität

### Post-Development Verification
- [ ] Live-URL visuell geprüft (alle Browser-States)
- [ ] Mobile-responsive Layout funktioniert  
- [ ] Filter/State-Management korrekt
- [ ] Performance acceptable (< 3s Load)
- [ ] Accessibility: Keyboard-Navigation funktioniert

## Component Selection Decision Tree

```
Critical UI Element?
├─ Yes → Custom Component (Full Control)
│   ├─ Complex State? → useState + useEffect
│   ├─ Click Outside? → addEventListener Pattern
│   └─ Styling? → Design System CSS + styled-jsx
└─ No → Evaluate Complexity
    ├─ Simple (Button, Text) → Design System Classes
    ├─ Medium (Input, Select) → Native HTML + DS CSS  
    └─ Complex (Modal, Dropdown) → Custom Component
```

## Success Metrics Benchmarks

### Performance Targets
- **Build Time:** < 30s (TypeScript + Next.js)
- **Bundle Size:** < 5KB per page route
- **First Load:** < 3s (vercel metrics)
- **Deployment Cycles:** < 3 attempts für Funktionalität

### Code Quality Targets  
- **TypeScript Errors:** 0 (Build-Blocking)
- **Design System Compliance:** 100% (Visual QA)
- **CSS Specificity Conflicts:** 0 (Production Testing)
- **Component API Reliability:** Custom > 95%, DS < 70%

## Risk Mitigation

### High-Risk Patterns (AVOID)
```typescript
// ❌ Design System Component für kritische UI
<InputLikeSelect 
  value={state} 
  onChange={handler} 
  options={options} 
/>

// ❌ !important in React Inline-Styles  
<div style={{ position: 'absolute !important' }}>

// ❌ Utility Classes für komplexe Layouts
<div className="d-flex gap-md align-items-center">
```

### Low-Risk Patterns (PREFER)
```typescript  
// ✅ Custom Component mit Design System Styling
<CustomSelect
  value={state}
  onChange={handler} 
  options={options}
  className="lyd-custom-select"
/>

// ✅ styled-jsx für !important
<style jsx>{`
  .element:focus {
    border-color: var(--lyd-primary) !important;
  }  
`}</style>

// ✅ Explizite Flexbox für Layouts  
<div style={{ 
  display: 'flex', 
  gap: '16px', 
  alignItems: 'center' 
}}>
```

## Maintenance Guidelines

### Documentation Requirements
- Component APIs documented in TypeScript interfaces
- CSS Custom Properties mapped zu Design Tokens  
- Click-Outside Patterns standardisiert
- Mobile-Responsive Breakpoints definiert

### Refactoring Triggers
- Design System Component API Failures
- CSS Specificity Conflicts in Production
- TypeScript Build Errors
- User-Reported UI Inconsistencies

**Engineering Philosophy:** Prefer Explicit Control over Abstract Convenience.  
**Quality Gate:** If it doesn't work in Production, it doesn't work.  
**Success Metric:** Zero trial-and-error deployments for UI functionality.
