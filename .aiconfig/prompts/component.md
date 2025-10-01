# Component Creation Prompt

## Ziel
Erstelle eine neue React Component im Backoffice mit vollständiger Integration.

## Checklist
- [ ] Component in `/apps/backoffice/components/` erstellen
- [ ] TypeScript Types definieren
- [ ] Props Interface mit JSDoc
- [ ] Error Handling implementieren
- [ ] Loading States berücksichtigen
- [ ] SVG-Icons nutzen (KEINE Emojis!)
- [ ] Design System Compliance prüfen
- [ ] Deutsche Kommentare
- [ ] Export in index.ts hinzufügen

## Template
```typescript
'use client' // Falls Client Component

import { ReactNode } from 'react'

interface ComponentNameProps {
  /** Beschreibung */
  prop1: string
  /** Optional Prop */
  prop2?: number
  children?: ReactNode
}

/**
 * ComponentName - Beschreibung der Funktionalität
 * 
 * @example
 * <ComponentName prop1="value" />
 */
export function ComponentName({ 
  prop1, 
  prop2 = 0,
  children 
}: ComponentNameProps) {
  // Implementation
  
  return (
    <div className="component-wrapper">
      {/* Content */}
    </div>
  )
}
```

## Post-Creation
- [ ] Build testen: `cd apps/backoffice && npm run build`
- [ ] Linter prüfen: `npm run lint`
- [ ] Commit: `git commit -m "feat(backoffice): ComponentName hinzugefügt"`

