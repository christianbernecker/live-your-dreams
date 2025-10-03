# API KEY MONITORING & COST MANAGEMENT - FACHLICHE ANFORDERUNGEN

**Status:** In Entwicklung (wird nach Admin-Stabilisierung neu angegangen)  
**Priorität:** Hoch (Business-kritisch für AI-Feature Nutzung)  
**Erstellt:** 3. Oktober 2025  
**Version:** 1.0

---

## KONTEXT & BUSINESS-ZIEL

Das Live Your Dreams Backoffice nutzt AI-APIs (Anthropic Claude, OpenAI GPT) für verschiedene Features. Es fehlt aktuell an:
- Zentraler Verwaltung von API Keys
- Transparenz über Kosten pro Tag/Monat
- Möglichkeit, Limits zu setzen und Overruns zu vermeiden
- Nachvollziehbarkeit welches Feature wie viel kostet

**Business-Ziel:** Kostenkontrolle und transparentes Monitoring der AI-Nutzung für Product Owner und Admins.

---

## FACHLICHE ANFORDERUNGEN

### 1. API KEY VERWALTUNG

#### 1.1 Sichere Speicherung
- **Anforderung:** API Keys MÜSSEN verschlüsselt in der Datenbank gespeichert werden
- **Verschlüsselung:** AES-256-GCM (Industry Standard)
- **Umgebungsvariable:** `API_KEY_ENCRYPTION_SECRET` (64 Zeichen Hex)
- **Maskierung:** Keys werden im UI als `sk-...****abcd` angezeigt (erste 3 + letzte 4 Zeichen)

#### 1.2 Unterstützte Provider
- **Anthropic Claude** (claude-sonnet-4.5, opus-4, haiku-3.5)
- **OpenAI GPT** (gpt-5, gpt-5-mini, gpt-5-nano, o4-mini)
- Erweiterbar für weitere Provider (Gemini, Mistral, etc.)

#### 1.3 Key-Metadaten
Pro API Key:
- **Name:** Beschreibender Name (z.B. "Claude Production Key")
- **Provider:** ANTHROPIC oder OPENAI (Enum)
- **Status:** Aktiv/Inaktiv (Boolean)
- **Monthly Limit:** Optional - Max. Kosten pro Monat in Euro (Decimal)
- **Created At:** Zeitstempel der Erstellung
- **Last Used At:** Zeitstempel der letzten Nutzung (automatisch aktualisiert)

#### 1.4 Key-Management (CLI-basiert)
- **Script:** `scripts/add-api-key.ts`
- **Workflow:**
  ```bash
  npm run add-api-key
  # Interaktive Prompts:
  # 1. Provider auswählen (Anthropic / OpenAI)
  # 2. Name eingeben
  # 3. API Key einfügen (wird sofort verschlüsselt)
  # 4. Optional: Monthly Limit in EUR
  ```
- **Sicherheit:** Key wird NIEMALS in Logs oder Console ausgegeben
- **Validierung:** Key-Format wird geprüft (sk-ant-... bzw. sk-proj-...)

---

### 2. COST MONITORING DASHBOARD

#### 2.1 Zugriff
- **Route:** `/admin/api-keys`
- **Berechtigung:** Nur Admin-Rolle (RBAC)
- **Navigation:** Teil der Admin-Tab-Navigation (Admin / Benutzer / Rollen / API-Keys)

#### 2.2 Quick Stats (Header)
Drei Karten nebeneinander (responsive Grid):

**Karte 1: Gesamtkosten (Heute)**
- Große Zahl: `€X.XX`
- Farbe: Primary (Porsche Rot)
- Zusatz: `X API Calls`

**Karte 2: Gesamtkosten (Monat)**
- Große Zahl: `€X.XX`
- Farbe: Accent (Orange)
- Zusatz: `X API Calls`

**Karte 3: Tokens (Monat)**
- Große Zahl: `X.XXX.XXX`
- Zusatz: `Input/Output kombiniert`

#### 2.3 API Keys Table
**Spalten:**
1. **Provider:** Badge (ANTHROPIC = Blau, OPENAI = Grün)
2. **Name:** Beschreibender Name
3. **API Key:** Maskiert (`sk-...****abcd`)
4. **Status:** Badge (Aktiv = Grün, Inaktiv = Rot)
5. **Calls:** Anzahl API Calls (Total)
6. **Kosten (Monat):** `€X.XX`
7. **Zuletzt verwendet:** Datum/Zeit (Format: `DD.MM.YYYY HH:MM` oder "Nie")

**Funktionalität:**
- Sortierbar nach Kosten, Calls, Last Used
- Keine Edit/Delete Funktion (aus Sicherheitsgründen CLI-only)
- Tooltip bei Hover auf maskiertem Key: "Vollständigen Key nur via CLI abrufbar"

#### 2.4 Kosten-Verlauf Chart (30 Tage)
**Chart-Typ:** Balkendiagramm (Bar Chart)
- **X-Achse:** Datum (letzte 30 Tage)
- **Y-Achse:** Kosten in EUR
- **Farben:** 
  - Anthropic = Porsche Rot (Primary)
  - OpenAI = Orange (Accent)
- **Interaktivität:**
  - Hover: Zeigt exakte Werte (Datum, Provider, Kosten, Calls, Tokens)
  - Legende: Provider-Filter (Click um Provider ein/auszublenden)
- **Besonderheit:** Nur Tage MIT Calls werden angezeigt (keine Nullwerte)

**Technische Umsetzung:**
- Component: `DailyUsageChart.tsx`
- Datenquelle: `ApiUsageService.getDailyUsage(30)`
- Responsive: Horizontal Scroll bei < 768px Breite

#### 2.5 Letzte API Calls (Recent Activity)
**Table mit letzten 10 Calls:**

**Spalten:**
1. **Zeitstempel:** `DD.MM. HH:MM` (nur Tag/Monat, da aktueller Kontext)
2. **Feature:** Name des Features (z.B. "blog-generator", "image-analyzer")
3. **Model:** Verwendetes Model (z.B. "claude-sonnet-4.5")
4. **Tokens:** Total Input+Output Tokens
5. **Kosten:** `€X.XXXX` (4 Dezimalstellen da oft Centbruchteile)
6. **Status:** Badge (SUCCESS = Grün, ERROR = Rot)
7. **Dauer:** Millisekunden (z.B. "1234ms")

**Sortierung:** Neueste zuerst (DESC createdAt)

**Error Handling:**
- Bei ERROR Status: Hover zeigt Error Message
- Error Badge: Rot mit Tooltip

---

### 3. USAGE TRACKING (Backend)

#### 3.1 Automatisches Logging
**Wann:** Bei JEDEM AI-API Call (Anthropic & OpenAI)

**Geloggte Daten:**
- `apiKeyId` - Verwendeter Key (Foreign Key)
- `provider` - ANTHROPIC oder OPENAI
- `model` - Verwendetes Model (z.B. "claude-sonnet-4.5")
- `feature` - Feature-Identifier (z.B. "blog-generator")
- `inputTokens` - Anzahl Input Tokens
- `outputTokens` - Anzahl Output Tokens
- `totalTokens` - Summe Input+Output
- `totalCost` - Berechnete Kosten in EUR (Decimal)
- `status` - SUCCESS oder ERROR
- `errorMessage` - Falls ERROR: Fehlermeldung
- `durationMs` - API Call Dauer in Millisekunden
- `createdAt` - Zeitstempel

#### 3.2 Cost Calculation
**Provider-spezifische Pricing (Stand Oktober 2025):**

**Anthropic Claude:**
- Sonnet 4.5: $3.00 / 1M Input Tokens, $15.00 / 1M Output Tokens
- Opus 4: $15.00 / 1M Input Tokens, $75.00 / 1M Output Tokens
- Haiku 3.5: $1.00 / 1M Input Tokens, $5.00 / 1M Output Tokens

**OpenAI GPT:**
- GPT-5: $10.00 / 1M Input Tokens, $30.00 / 1M Output Tokens
- GPT-5 Mini: $0.30 / 1M Input Tokens, $1.20 / 1M Output Tokens
- GPT-5 Nano: $0.15 / 1M Input Tokens, $0.60 / 1M Output Tokens
- o4-mini: $0.40 / 1M Input Tokens, $1.60 / 1M Output Tokens

**Formel:**
```typescript
const costUSD = (inputTokens / 1_000_000 * inputPricePerM) + 
                (outputTokens / 1_000_000 * outputPricePerM);
const costEUR = costUSD * 1.10; // USD->EUR Conversion (ca. 10% Aufschlag)
```

**Konfiguration:** Zentral in `lib/config/ai-models.ts`

#### 3.3 Monthly Limit Enforcement
**Workflow:**
1. Vor jedem API Call: Prüfe aktuellen Monatsverbrauch des Keys
2. Falls `monthlyLimit` gesetzt UND erreicht:
   - Werfe Error: `MonthlyLimitExceeded`
   - Logge Event als ERROR
   - User bekommt Fehlermeldung (Frontend)
3. Falls Limit NICHT gesetzt oder nicht erreicht:
   - API Call durchführen
   - Usage loggen

**Business Rule:** Limit gilt pro Key, NICHT global

---

### 4. INTELLIGENTE MODEL-AUSWAHL (Nice-to-Have)

#### 4.1 Task-basierte Auswahl
Statt hardcoded Models pro Feature, intelligente Auswahl basierend auf Task-Typ:

**Task-Typen:**
- `coding` → Claude Sonnet 4.5 (bestes Coding-Model)
- `reasoning` → OpenAI o4-mini (bestes Reasoning)
- `content` → GPT-5 (beste Content-Generierung)
- `analysis` → Claude Opus 4 (tiefste Analyse)
- `general` → GPT-5 Mini (gutes Preis-Leistungs-Verhältnis)
- `fast` → Haiku 3.5 oder GPT-5 Nano (schnellste Antwort)

**Quality-Stufen:**
- `premium` → Beste Qualität (höchste Kosten)
- `standard` → Gutes Gleichgewicht
- `fast` → Schnellste Antwort (niedrigste Kosten)
- `nano` → Minimale Kosten

**API:**
```typescript
import { callAI } from '@/lib/api/ai';

const response = await callAI({
  task: 'coding',
  quality: 'premium',
  feature: 'blog-generator',
  messages: [{ role: 'user', content: '...' }],
});
```

**Fallback:** Falls Primary Model fehlschlägt, automatischer Fallback zu Secondary Model

#### 4.2 Convenience Functions
```typescript
// Für Code-Generierung
const code = await generateCode({ 
  prompt: '...', 
  feature: 'x' 
});

// Für Text-Analyse
const analysis = await analyzeText({ 
  text: '...', 
  task: 'sentiment', 
  feature: 'y' 
});

// Für schnelle Responses
const quick = await quickResponse({ 
  prompt: '...', 
  feature: 'z' 
});
```

---

## DATENBANK-SCHEMA

### Table: `ApiKey`
```prisma
model ApiKey {
  id            String        @id @default(cuid())
  provider      ApiProvider   // Enum: ANTHROPIC, OPENAI
  name          String        // Beschreibender Name
  keyHash       String        // AES-256-GCM verschlüsselt
  isActive      Boolean       @default(true)
  monthlyLimit  Decimal?      @db.Decimal(10, 2) // Optional: EUR
  createdAt     DateTime      @default(now())
  lastUsedAt    DateTime?
  usageLogs     ApiUsageLog[]
  
  @@index([provider, isActive])
}
```

### Table: `ApiUsageLog`
```prisma
model ApiUsageLog {
  id            String      @id @default(cuid())
  apiKeyId      String
  apiKey        ApiKey      @relation(fields: [apiKeyId], references: [id])
  provider      ApiProvider // ANTHROPIC oder OPENAI
  model         String      // z.B. "claude-sonnet-4.5"
  feature       String      // Feature-Identifier
  inputTokens   Int
  outputTokens  Int
  totalTokens   Int         // Input + Output
  totalCost     Decimal     @db.Decimal(10, 4) // EUR, 4 Dezimalstellen
  status        ApiStatus   // Enum: SUCCESS, ERROR
  errorMessage  String?
  durationMs    Int         // API Call Dauer
  createdAt     DateTime    @default(now())
  
  @@index([apiKeyId, createdAt])
  @@index([feature, createdAt])
  @@index([createdAt]) // Für Recent Calls
}
```

### Enums:
```prisma
enum ApiProvider {
  ANTHROPIC
  OPENAI
}

enum ApiStatus {
  SUCCESS
  ERROR
}
```

---

## SICHERHEITSANFORDERUNGEN

### 1. Verschlüsselung
- ✅ AES-256-GCM (NIST-konform)
- ✅ Unique IV pro Verschlüsselung (crypto.randomBytes(16))
- ✅ Auth Tag für Integritätsprüfung
- ✅ Encryption Secret: 64 Zeichen Hex (256 Bit)

### 2. Key-Handling
- ❌ NIEMALS Keys in Logs ausgeben
- ❌ NIEMALS Keys im Frontend vollständig anzeigen
- ✅ Maskierung: `sk-...****abcd` (erste 3 + letzte 4 Zeichen)
- ✅ CLI-only für Add/Delete Operations

### 3. Access Control
- ✅ Nur Admin-Rolle hat Zugriff auf `/admin/api-keys`
- ✅ API Route `/api/admin/api-stats` erfordert Admin-Session
- ✅ Kein direkter DB-Zugriff von Client Components

### 4. Environment Variables
```env
# Production (Vercel)
API_KEY_ENCRYPTION_SECRET=<64-Zeichen-Hex-String>

# NICHT in .env.local committen!
# Generate via: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

---

## API ROUTES

### GET `/api/admin/api-stats`
**Auth:** Admin-only  
**Response:**
```typescript
{
  keys: Array<{
    id: string;
    provider: 'ANTHROPIC' | 'OPENAI';
    name: string;
    maskedKey: string; // "sk-...****abcd"
    isActive: boolean;
    callCount: number;
    monthlyCost: number; // EUR
    lastUsedAt: string | null;
  }>;
  stats: {
    today: {
      totalCost: number;
      totalCalls: number;
      totalTokens: number;
    };
    month: {
      totalCost: number;
      totalCalls: number;
      totalTokens: number;
    };
  };
  dailyUsage: Array<{
    date: string; // "2025-10-03"
    anthropicCost: number;
    openaiCost: number;
    totalCalls: number;
  }>;
  recentCalls: Array<{
    id: string;
    createdAt: string;
    feature: string;
    model: string;
    totalTokens: number;
    totalCost: number;
    status: 'SUCCESS' | 'ERROR';
    durationMs: number;
  }>;
}
```

---

## DEPLOYMENT-CHECKLISTE

### Vor dem Deployment:
1. ✅ Prisma Migration erstellen & ausführen
2. ✅ `API_KEY_ENCRYPTION_SECRET` in Vercel hinzufügen
3. ✅ API Keys via `add-api-key.ts` Script hinzufügen
4. ✅ Test-Call durchführen (z.B. Blog-Generator)
5. ✅ Dashboard aufrufen & Stats prüfen

### Nach dem Deployment:
1. ✅ Vercel Logs prüfen (keine Encryption Errors)
2. ✅ `/admin/api-keys` aufrufen & Keys verifizieren
3. ✅ Test-Feature mit AI-Call nutzen
4. ✅ Dashboard: Neue Usage Logs erscheinen
5. ✅ Chart: Kosten-Verlauf wird angezeigt

---

## OFFENE PUNKTE & RISIKEN

### Risiken (aus gescheitertem ersten Versuch):
1. **Permission-System Konflikt:**
   - Problem: Admin-Link verschwand nach Deployment
   - Ursache: JWT-Token enthielt keine `permissions` nach Re-Login
   - Lösung: Erst RBAC-System stabilisieren, DANN API-Key Feature

2. **TypeScript Build Errors:**
   - Problem: React 18/19 Type-Konflikte bei `createPortal()`
   - Ursache: Monorepo mit inkonsistenten `@types/react` Versionen
   - Lösung: Type Assertions + `skipLibCheck: true` (temporär)

3. **Layout-Breaking:**
   - Problem: Admin-Seiten verloren `DashboardLayout` während Fixes
   - Ursache: Zu viele parallele Änderungen ohne Tests
   - Lösung: E2E-Tests für Admin-Bereich VORHER schreiben

### Offene Fragen:
- [ ] Wie werden Keys rotiert? (Lifecycle-Management)
- [ ] Benachrichtigung bei Monthly Limit erreicht?
- [ ] Historische Daten: Wie lange speichern? (DSGVO)
- [ ] Multi-Tenancy: Keys pro Workspace/Team?

---

## NÄCHSTE SCHRITTE (Neu-Implementierung)

### Phase 1: Backend Stabilisierung
1. Admin-Bereich vollständig funktionsfähig (inkl. Logout)
2. Permission-System Tests schreiben
3. E2E-Tests für `/admin/users` und `/admin/roles`

### Phase 2: API-Key Backend (ohne UI)
1. Datenbank-Migration
2. EncryptionService
3. ApiKeyService
4. ApiUsageService
5. CLI Script `add-api-key.ts`
6. Test-API-Call mit Logging

### Phase 3: Dashboard UI
1. `/admin/api-keys` Route
2. Quick Stats Header
3. API Keys Table
4. Recent Calls Table
5. TypeScript & Build verifikation

### Phase 4: Chart & Polish
1. DailyUsageChart Component
2. 30-Tage Verlauf
3. Responsive Design
4. Error Handling & Loading States

### Phase 5: Deployment & Monitoring
1. Vercel Environment Variables
2. Production Deployment
3. Live-Verifikation
4. Dokumentation & Handover

---

## TECHNOLOGIE-STACK

**Backend:**
- Node.js Crypto (AES-256-GCM)
- Prisma ORM (PostgreSQL via Neon)
- Next.js 14 App Router API Routes

**Frontend:**
- React 18 Client Components
- Design System V2 (LYD)
- Inline Styles (CSS Variables)

**AI SDKs:**
- `@anthropic-ai/sdk` (Claude)
- `openai` (GPT)

**Security:**
- NextAuth.js (Session-based RBAC)
- AES-256-GCM (NIST SP 800-38D)

---

## KONTAKT & OWNERSHIP

**Product Owner:** Christian Bernecker  
**Development Team:** Claude Code (AI Agent)  
**Priorität:** Hoch (Business-kritisch)  
**Deadline:** Nach Admin-Stabilisierung

**Letzte Änderung:** 3. Oktober 2025

