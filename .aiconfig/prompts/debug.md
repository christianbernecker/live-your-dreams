# Debug Prompt

## Systematisches Debugging

### 1. Problem-Analyse
```
SYMPTOM:
[Was ist das beobachtbare Problem?]

ERWARTETES VERHALTEN:
[Was sollte passieren?]

AKTUELLES VERHALTEN:
[Was passiert stattdessen?]

REPRODUKTION:
[Schritte um Problem zu reproduzieren]
```

### 2. Kontext sammeln

**Environment:**
- [ ] Welche Umgebung? (Local/Preview/Production)
- [ ] Browser/Version?
- [ ] User-Agent?
- [ ] Console Errors?
- [ ] Network Tab Errors?

**Code Context:**
- [ ] Letzte Änderungen?
- [ ] Betroffene Dateien?
- [ ] Related Issues?
- [ ] Git Blame relevant?

**Database:**
- [ ] Welche Queries laufen?
- [ ] Timeout Errors?
- [ ] Migration Status?
- [ ] Data Consistency?

### 3. Debugging Tools

**Browser DevTools:**
```javascript
// Breakpoints setzen
debugger;

// Console Logging (mit Context)
console.log('[ComponentName]:', { prop1, prop2, state });

// Performance Profiling
console.time('operation');
// ... code
console.timeEnd('operation');
```

**Next.js Debugging:**
```bash
# Server-Side Logs
cd apps/backoffice && npm run dev

# Build Errors
npm run build

# Type Checking
npm run type-check
```

**Database Debugging:**
```bash
# MCP neon server nutzen
# oder Prisma Studio
cd apps/backoffice && npx prisma studio
```

### 4. Root Cause Analysis

**Fragen:**
1. Wann trat das Problem das erste Mal auf?
2. Was änderte sich seitdem?
3. Ist es reproduzierbar?
4. Betrifft es alle User oder nur bestimmte?
5. Gibt es ein Pattern?

**Isolierung:**
- [ ] Binary Search (Code auskommentieren)
- [ ] Minimal Reproduction erstellen
- [ ] In frischem Branch testen
- [ ] Dependencies prüfen (yarn.lock)

### 5. Fix-Strategie

**Quick Fix (für Hotfix):**
- Minimale Änderung
- Rückwärtskompatibel
- Sofort deploybar
- Tests später

**Proper Fix (für Feature Branch):**
- Root Cause beheben
- Refactoring wenn nötig
- Tests hinzufügen
- Dokumentation updaten

### 6. Verification

**Pre-Deploy:**
- [ ] Build erfolgreich
- [ ] Lint erfolgreich
- [ ] Type Check erfolgreich
- [ ] Manual Testing
- [ ] Edge Cases getestet

**Post-Deploy:**
- [ ] Monitoring prüfen
- [ ] Error Logs prüfen
- [ ] Performance Metrics
- [ ] User Reports beobachten

### 7. Documentation

**Was dokumentieren:**
- Root Cause
- Fix Applied
- Why this approach
- Related Issues
- Prevention measures

**Wo dokumentieren:**
- Git Commit Message
- GitHub Issue
- docs/ wenn relevant
- Code Comments wenn komplex

