# +Codex Workflow - Dokumentation

## Übersicht

**Trigger:** Prompt beginnt mit `+Codex`
**Model:** gpt-5-codex (optimiert für Code)
**Reasoning:** Adaptiv (tendiert zu medium/high bei komplexen Tasks)
**Kosten:** Inkludiert in ChatGPT Plus ($20/Monat)

---

## Workflow

### 1. User schreibt: `+Codex: [Task]`

**Beispiel:**
```
+Codex: Implementiere User-Authentication mit 2FA
```

### 2. Claude Code Prozess:

1. **Analyse:** Verstehe Task & erstelle Lösung
2. **Implementation:** Code-Änderungen durchführen
3. **Codex Konsultation:**
   ```bash
   bash .aiconfig/scripts/codex-review.sh \
     "User Task: Implementiere User-Authentication mit 2FA" \
     "$(git diff HEAD~1)"
   ```
4. **Review-Verarbeitung:** Codex Feedback einarbeiten
5. **User-Meldung:** Finales Ergebnis + Review-Summary

### 3. Codex Review (gpt-5-codex)

**Analysiert:**
- Architecture & Design Patterns
- Security Vulnerabilities
- Performance Bottlenecks
- Edge Cases & Error Handling
- Code Quality & Maintainability
- Breaking Changes
- Technical Debt

**Liefert:**
- ✅ Kritische Issues (Must-Fix)
- ⚠️ Verbesserungsvorschläge (Should-Fix)
- 💡 Optionale Optimierungen (Nice-to-Have)

---

## Adaptive Reasoning

**gpt-5-codex entscheidet automatisch:**

- **Einfache Tasks** → Schnell (wenig Reasoning)
  - Beispiel: "Fix Typo in README"

- **Mittlere Tasks** → Medium Reasoning
  - Beispiel: "Refactor User Component"

- **Komplexe Tasks** → High Reasoning (bis 7+ Stunden)
  - Beispiel: "Migrate Auth System to OAuth2"

**Kein manuelles `reasoning.effort` nötig - gpt-5-codex optimiert selbst!**

---

## Grenzen (ChatGPT Plus)

**Usage Limits:**
- 30-150 Messages/5h (lokal)
- Weekly Limit vorhanden
- Bei Limit: "Use API key for additional tasks"

**Empfehlung:**
- Max 5-10 +Codex Reviews/Tag
- Für kritische/komplexe Tasks reservieren
- Einfache Reviews: Direkt durch Claude Code

**Upgrade-Option:**
- ChatGPT Pro ($200/Monat): 300-1500 Messages/5h
- "Basically no limits"

---

## Verwendung

### Standard (KEIN +Codex):
```
User: "Implementiere Feature X"
Claude: [implementiert direkt, kein Codex Call]
```

### Mit +Codex:
```
User: "+Codex: Implementiere Feature X"
Claude:
  1. [implementiert]
  2. [ruft Codex Review auf]
  3. [verarbeitet Feedback]
  4. [meldet finales Ergebnis]
```

---

## Script Details

**Location:** `.aiconfig/scripts/codex-review.sh`

**Aufruf:**
```bash
bash .aiconfig/scripts/codex-review.sh \
  "User Task Description" \
  "$(git diff HEAD~1)"
```

**Output:** Strukturiertes Review-Feedback von gpt-5-codex

---

## Best Practices

### Wann +Codex nutzen:

✅ **Empfohlen:**
- Security-kritischer Code (Auth, Permissions, Crypto)
- Komplexe Refactorings (Architecture Changes)
- Breaking Changes (API-Änderungen)
- Performance-kritische Komponenten
- Neue Features mit Edge Cases

❌ **Nicht nötig:**
- Typo-Fixes
- Simple Styling-Änderungen
- Documentation Updates
- Triviale Bugfixes

### Limit-Management:

- **Tracking:** Zähle +Codex Calls pro Tag
- **Priorisierung:** Reserviere für wichtige Reviews
- **Alternative:** Bei Limit → Git Commit → Manuelles Review später

---

## Technische Details

**Model:** gpt-5-codex
- Version: Latest (auto-updated)
- Context: 272k Tokens Input
- Output: 128k Tokens (inkl. Reasoning)
- Optimiert für: Agentic Coding, Code Review, Refactoring

**Flags:**
- `--model gpt-5-codex` - Codex-optimiertes GPT-5
- `--full-auto` - Auto-approval bei Fehlern (sandboxed)

**Sandbox:** workspace-write (sicher für Code-Review)

---

## Status

✅ **Workflow aktiv**
✅ **Script bereit:** `.aiconfig/scripts/codex-review.sh`
✅ **ChatGPT Plus Login:** Verifiziert
✅ **gpt-5-codex:** Verfügbar

**Nächster Schritt:** Teste mit `+Codex: [dein Task]`
