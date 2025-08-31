# Life Your Dreams Design System

Eigenständig entwickeltes Design System für die Life Your Dreams Immobilienvermarktungs-Plattform.

## Architektur

Das LDS (Life Your Dreams Design System) wurde von Grund auf entwickelt, basierend auf den CI-Guidelines aus dem Strategiedokument. Es nutzt **keine** externe Design System Basis.

### Komponenten-Philosophie

- **Token-First:** Alle Styles verwenden Design Tokens
- **CSS-Module:** Echte `.lds-*` Klassen statt Utility-First
- **A11y-Native:** Accessibility von Anfang an eingebaut
- **Brand-Consistent:** Vollständige Integration der LYD Brand Identity

### Verwendung

```css
/* CSS-Import in Komponenten */
@import '@lifeyourdreams/design-system/dist/styles/components/button.css';
```

```tsx
// React-Komponente
import { LdsButton } from '@lifeyourdreams/design-system-react';

<LdsButton variant="primary" size="lg">
  Immobilie anlegen
</LdsButton>
```

## Design Tokens

Basierend auf Kapitel 21 der Strategie-Dokumentation:
- **Deep Blue:** #000066 (Primary Brand)
- **Royal Blue:** #3366CC (Secondary Brand)
- **Typography:** System-UI Stack
- **Spacing:** 4px-64px Scale
- **Motion:** Standard/Emphasized Easing
