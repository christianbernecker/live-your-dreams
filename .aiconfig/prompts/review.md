# Code Review Prompt

## Review-Checkliste (Senior Dev Mindset)

### Security
- [ ] Keine hardcoded secrets oder API keys
- [ ] Input Validation implementiert
- [ ] SQL Injection Schutz (Prisma nutzen)
- [ ] XSS Schutz (React escaping nutzen)
- [ ] CSRF Token bei Forms
- [ ] Authentication geprüft
- [ ] Authorization geprüft (RBAC)

### Performance
- [ ] Keine N+1 Queries
- [ ] Database Indexes vorhanden
- [ ] React.memo wo sinnvoll
- [ ] Lazy Loading für große Components
- [ ] Images optimiert (next/image)
- [ ] Bundle Size impact minimal

### Error Handling
- [ ] Try-Catch bei async Operations
- [ ] Error Boundaries für React
- [ ] Sinnvolle Error Messages (DE)
- [ ] Logging implementiert
- [ ] Fallback UI vorhanden

### Code Quality
- [ ] DRY Principle befolgt
- [ ] SOLID Principles
- [ ] Klare Naming Conventions
- [ ] Funktionen < 50 Zeilen
- [ ] Max 3 Verschachtelungsebenen
- [ ] TypeScript strict mode

### Design System
- [ ] KEINE Emojis in Production Code
- [ ] SVG Icons mit stroke="currentColor"
- [ ] CSS Custom Properties (--lyd-*)
- [ ] Konsistente Spacing/Sizing
- [ ] Responsive Design

### Testing
- [ ] Edge Cases bedacht
- [ ] Error Paths getestet
- [ ] Boundary Conditions
- [ ] Race Conditions vermieden

### Deployment
- [ ] Breaking Changes vermieden
- [ ] Backwards Compatible
- [ ] Database Migration plan
- [ ] Rollback möglich
- [ ] Monitoring vorhanden

## Review-Response Format

**KRITISCHE PROBLEME:**
- [Was WIRD in Production schiefgehen]

**VERBESSERUNGSVORSCHLÄGE:**
- [Konkrete Alternative mit Begründung]

**TECHNISCHE SCHULD:**
- [Was in 6 Monaten Probleme macht]

**DEPLOYMENT-RISIKEN:**
- [Was beim Deploy brechen könnte]

**ENTSCHEIDUNG:**
- [ ] Approved (mit kleinen Änderungen)
- [ ] Changes Requested (muss überarbeitet werden)
- [ ] Blocked (fundamentale Probleme)

