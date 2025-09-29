# LYD Blog Backoffice – Fachliches & Technisches Briefing (v1.0)

**Scope:** Multi‑Brand Blog für **Live Your Dreams** mit Sub‑Brands **LYD Wohnen**, **LYD Makler**, **LYD Energie**. Externe KI/Agenten liefern Inhalte im definierten Austauschformat; das Backoffice übernimmt *validierenden Import*, *Review*, *Tagging/Distribution* und *Publikation* auf angeschlossene Frontends.

> **Prämissen**
> 1) **Keine interne KI‑Generierung zum Start.** Inhalte kommen aus Drittsystemen (z. B. ChatGPT Agent).  
> 2) **Designsystem‑First:** Alle UI‑Bausteine im Backoffice müssen das **LYD Design System** nutzen (Komponenten, Spacing, Farben, Typo).  
> 3) **SEO‑First Publishing:** Blog wird früh live geschaltet und kontinuierlich bespielt (Basis für Reichweite).  
> 4) **Sichere HTML‑Grafiken:** Externe Inhalte können komplexe **HTML/SVG/iframes** enthalten. Diese werden **kontrolliert** importiert, **sanitized** und dargestellt.

---

## 1) Fachliches Konzept

### 1.1 Ziele & Erfolgsmetriken
- **Ziel 1: Sichtbarkeit (SEO)** – organische Rankings für Kern‑Themen je Sub‑Brand; KPI: Impressionen/Clicks/Top‑10‑Keywords.  
- **Ziel 2: Conversion‑Enablement** – CTAs je Sub‑Brand (Bewertung anfragen, Beratung buchen, Förderung prüfen). KPI: CTR der CTAs, Leads.  
- **Ziel 3: Produktions‑Effizienz** – reibungsloser Import von extern erzeugtem Content mit minimalem manuellen Aufwand. KPI: Import‑Fehlerrate, Durchlaufzeit bis „Publish“.

### 1.2 Zielgruppen je Sub‑Brand
- **LYD Wohnen**: Privatverkäufer/Käufer im Großraum München (später DE), DIY‑affin, preis‑ & prozesssensibel; Content: Verkaufsratgeber, Markt/Preis, Recht & Pflichtangaben.  
- **LYD Makler**: Premium‑Segment & Zeitknappe (45+), hoher Objektwert; Content: Markt‑Insights, Investment, Off‑Market, Case‑Stories, Qualitätsbeweise.  
- **LYD Energie**: Eigentümer, Vermieter, Modernisierer; Content: GEG‑Pflichten, Förderungen, Technik‑Vergleiche, Fahrpläne/Amortisation.

### 1.3 Content‑Typ „BlogPost“ – redaktionelle Regeln
- **Ton & Stil**: Sub‑Brand‑spezifisch (Wohnen: informativ/vertrauensbildend; Makler: premium/professionell; Energie: technisch fundiert/verständlich).  
- **Struktur**: H2/H3 alle ~150–200 Wörter; kurze Absätze; FAQ‑Block; interne Links.  
- **SEO‑Grundlagen**: Fokus‑Keyword, semantische Keywords, **Meta‑Title/Description**, **OpenGraph**, **JSON‑LD (BlogPosting/Article)**, Canonical, Alt‑Texte.  
- **Medien**: Hero/Inline‑Bilder (WebP bevorzugt), optional **HTML‑Grafiken** (z. B. interaktive Tabellen/Diagramme), Tabellen/Listen.  
- **Barrierefreiheit**: Sinnvolle Headings, Alt‑Texte, Kontraste, verständliche Linkanker.  
- **Compliance**: Quellenangaben (wo sinnvoll), keine irreführenden Angaben; bei Energie‑Themen: korrekte Gesetzesbezüge.

### 1.4 Distribution & Tagging (Multi‑Brand)
- **Plattformen**: `WOHNEN`, `MAKLER`, `ENERGIE` (Artikel kann **1..3** Plattformen besitzen).  
- **Routing**: Jede Plattform hat eigenes Frontend & Feed.  
- **Sichtbarkeitslogik**:  
  - **Pflicht**: Mind. 1 Plattform.  
  - **Kategorie‑Guardrails** (redaktionell, optional technisch enforced):  
    - `WOHNEN`: Ratgeber/Markt/Recht/DIY.  
    - `MAKLER`: Premium/Investment/Referenzen.  
    - `ENERGIE`: GEG/Förderung/Technik.  
- **CTA‑Injection** je Plattform: z. B. *Bewertung* (Wohnen), *Beratung* (Makler), *Förder‑Check* (Energie).  
- **Status‑Workflow**: `DRAFT → REVIEW → SCHEDULED → PUBLISHED → ARCHIVED` (+ `REJECTED` optional).  
- **Scheduling**: Zeitgesteuertes Publish pro Zeitzone (Europe/Berlin).

---

## 2) Austauschformat für externe KI (Import‑Spezifikation)

> **Ziel:** Ein einziges robustes Format, das sowohl **klassische Markdown/MDX‑Artikel** als auch **aufwändige HTML‑Grafiken** + Assets unterstützt.

### 2.1 Top‑Level JSON (Versionierbar)
```json
{
  "version": "1.1",
  "source": { "agent": "chatgpt", "model": "gpt-4.1", "timestamp": "2025-09-29T14:00:00Z" },
  "content": { /* siehe unten */ },
  "assets": [ /* optionale Binär- oder Textassets (Base64 oder URLs) */ ]
}
```

### 2.2 `content` Objekt (Pflichtfelder + flexible Blöcke)
```json
{
  "platforms": ["WOHNEN"],
  "category": "Verkaufsratgeber",
  "subcategory": "Privatverkauf",
  "tags": ["München", "Provision sparen", "2025"],

  "title": "Immobilie ohne Makler verkaufen: Der komplette Guide 2025",
  "slug": "immobilie-ohne-makler-verkaufen-guide-2025",
  "excerpt": "So verkaufen Sie in München rechtssicher ohne Courtage – Schritt-für-Schritt mit Checklisten.",

  "seo": {
    "metaTitle": "Ohne Makler verkaufen – so gelingt’s (Guide 2025)",
    "metaDescription": "Schritt-für-Schritt Anleitung inkl. Checklisten, Kosten & Recht. München‑Bezug.",
    "focusKeyword": "immobilie ohne makler verkaufen",
    "keywords": ["privatverkauf immobilie", "maklerprovision sparen"],
    "canonicalUrl": "https://wohnen.liveyourdreams.online/blog/immobilie-ohne-makler-verkaufen-guide-2025",
    "og": {
      "title": "Immobilie ohne Makler verkaufen",
      "description": "Kompletter Guide 2025 mit Praxisbezug München.",
      "image": "asset:hero-1.webp",
      "type": "article"
    }
  },

  "format": "mdx",                      
  "body": "# H1... MDX/Markdown ...",   

  "htmlBlocks": [
    {
      "id": "fig-sales-01",
      "title": "Provision vs. Festpreis – Vergleich",
      "html": "<figure class=\"lyd-figure\"><svg>...</svg><figcaption>...</figcaption></figure>",
      "css": ".lyd-figure{max-width:100%;margin:16px 0}",
      "js": "",                                  
      "sandbox": {
        "allowedIframes": ["https://www.youtube-nocookie.com"],
        "allow": "fullscreen; picture-in-picture",
        "height": 420
      }
    }
  ],

  "featuredImage": { "src": "asset:hero-1.webp", "alt": "Hausverkauf München" },
  "images": [
    { "src": "https://cdn.example.com/img/room.webp", "alt": "Wohnzimmer", "width": 1600, "height": 900 }
  ],

  "jsonLd": { "@context": "https://schema.org", "@type": "BlogPosting", "headline": "...", "datePublished": "2025-09-29" }
}
```

### 2.3 `assets` (optional)
Zwei Modi:
1) **URL‑Modus**: `src` verweist auf bereits erreichbare URLs.  
2) **Inline‑Modus**: `asset:<name>` in `content` referenziert hier definierte Assets.
```json
{
  "name": "hero-1.webp",
  "mime": "image/webp",
  "encoding": "base64",
  "data": "<BASE64>"
}
```
**Importer** lädt Inline‑Assets nach S3 (oder CDN), ersetzt `asset:<name>` durch endgültige URL.

### 2.4 MD/MDX/HTML – was die KI liefern darf
- `format = "md"`: Markdown (ggf. mit `rehype-raw` für **kleine** HTML‑Snippets).  
- `format = "mdx"`: MDX (React‑kompatible Komponenten **deaktiviert** im Backoffice Preview; im Frontend optional whitelisted).  
- `format = "html"`: Voll‑HTML nur, wenn strikt **sanitized**; größere Einbettungen gehen über `htmlBlocks`.

### 2.5 Validierungs‑Checkliste beim Import
- Pflichtfelder vorhanden (Title/Slug/Excerpt/Platforms/Format/Body **oder** HtmlBlocks).  
- Slug‑Kollision prüfen & automatisch vorschlagen (`-2`, `-3`).  
- Bilder: Alt‑Text Pflicht für featured/inline.  
- HTML‑Sicherheit: nur erlaubte Tags/Attribute (siehe 5.3).  
- JSON‑LD: Schema `BlogPosting`/`Article` mindestens mit `headline`, `datePublished`, `author/publisher` (falls angegeben).  
- Maxgrößen: JSON ≤ 2 MB, Asset einzeln ≤ 10 MB (konfigurierbar).

---

## 3) Datenmodell & Storage

### 3.1 Prisma‑Modelle (Erweiterung)
```prisma
enum BlogStatus { DRAFT REVIEW SCHEDULED PUBLISHED ARCHIVED }
enum Platform { WOHNEN MAKLER ENERGIE }

model BlogPost {
  id               String      @id @default(cuid())
  title            String      @db.VarChar(120)
  slug             String      @unique
  excerpt          String      @db.VarChar(200)
  content          String      @db.Text               // Markdown/MDX/HTML (primär body)
  format           String      @default("mdx")        // md | mdx | html

  // SEO
  metaTitle        String?     @db.VarChar(120)
  metaDescription  String?     @db.VarChar(200)
  focusKeyword     String?
  keywords         String[]    @default([])
  canonicalUrl     String?
  ogTitle          String?
  ogDescription    String?
  ogImage          String?

  // Structured Data
  jsonLd           Json?

  // Visuals
  featuredImageUrl String?
  featuredImageAlt String?

  // Blocks (HTML/SVG/Iframes) – als JSON gespeichert
  htmlBlocks       Json?       // [{ id, title, html, css, js, sandbox }]
  images           Json?       // optionale zusätzliche Bildobjekte

  // Taxonomie & Distribution
  platforms        Platform[]  @default([])
  category         String
  subcategory      String?
  tags             String[]    @default([])

  // Workflow
  status           BlogStatus  @default(DRAFT)
  scheduledFor     DateTime?
  publishedAt      DateTime?

  // Audit
  authorId         String
  importSource     String?     // chatgpt | claude | manual
  importModel      String?
  importTimestamp  DateTime?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  @@index([status, scheduledFor])
  @@index([platforms])
  @@fulltext([title, content])
}
```

### 3.2 Medien‑Speicher
- **S3/CloudFront** für Bilder & hochgeladene Assets.  
- Importer speichert Assets unter `/blog/<yyyy>/<mm>/<slug>/...` und schreibt endgültige URLs zurück.

---

## 4) API & Import‑Workflow

### 4.1 Endpunkte
- `POST /api/blog/import` – JSON/ZIP Import (validiert, speichert Daten/Assets, Status `DRAFT`).  
- `POST /api/blog/validate` – Dry‑Run‑Validierung (ohne Persistenz).  
- `PUT /api/blog/:id` – Metadaten/Content aktualisieren.  
- `POST /api/blog/:id/publish` – Status→`PUBLISHED`, `publishedAt` setzen & **Distribution** in ausgewählte Frontends triggern.  
- `POST /api/blog/bulk-import` – NDJSON/ZIP Batch.

### 4.2 ZIP‑Import (optional, empfohlen für HTML‑Grafiken)
```
package.zip
├── manifest.json          # entspricht oben definiertem JSON
├── assets/
│   ├── hero-1.webp
│   ├── chart.css
│   └── diagram.svg
└── blocks/
    └── fig-sales-01.html  # optional: große HTML‑Blöcke getrennt
```
Importer liest `manifest.json`, lädt Assets, injiziert HTML‑Blöcke in `htmlBlocks`.

### 4.3 Distribution Hooks
Nach `publish` optional **Webhooks** pro Plattform:
```
POST $WOHNEN_ENDPOINT  Authorization: Bearer <KEY>
Body: { postId, slug } → Frontend revalidiert Route /blog/[slug]
```
Frontend transformiert `BlogPost` in Plattform‑Template (CTA‑Injection).

---

## 5) Backoffice UI (Designsystem‑konform)

### 5.1 Seitenstruktur
```
/apps/backoffice/app/(auth)/dashboard/blog/
  ├─ page.tsx               # Übersicht (Tabelle, Filter, Quick Actions)
  ├─ import/page.tsx        # Upload/Import + Preview
  ├─ [id]/edit/page.tsx     # Editor/Review (ohne KI‑Gen)
  └─ components/*           # DS‑Konforme Bausteine
```

### 5.2 Übersicht – Komponenten
- **Filterleiste** (Status, Plattformen, Kategorien, Zeitraum) – DS Buttons/Selects.  
- **Tabelle** mit Spalten: Title • Plattformen • Kategorie • Status • Geplant/Veröffentlicht • Autor • Aktionen.  
- **Stat‑Karten** (Posts live, in Review, geplant) – DS Cards.  
- **Quick Action** „Import starten“ – Primary Button.

### 5.3 Import‑UI
- **Dropzone** (JSON/ZIP) mit DS‑Styles.  
- **Semantic Preview**: Title, Plattform‑Badges, Kategorie, SERP‑Vorschau, **Security‑Check**.  
- **HTML‑Sicherheitscheck** (aus `body` + `htmlBlocks`):
  - Erlaubte Tags: `p, h1..h6, ul, ol, li, strong, em, a (rel=nofollow noopener noreferrer), img (src,width,height,alt,loading=lazy), figure, figcaption, table, thead, tbody, tr, th, td, code, pre, blockquote, hr, br, svg (subset), path, rect, circle`.
  - Erlaubte iFrames **nur whitelisted** Origins (z. B. `youtube-nocookie.com`).  
  - Unerlaubte Attribute/JS‑Handler werden entfernt; Styles nur inline/aus CSS‑Block, keine externen Skripte außer explizit whitelisted.  
- **CTA** „Validieren & als Draft anlegen“.

### 5.4 Editor/Review
- Read‑only **Content Preview** (ReactMarkdown/MDX‑Renderer mit `rehype-sanitize`‑Schema / Plattform‑Theme).  
- Metadaten‑Form (Title/Slug/Excerpt/Plattformen/SEO‑Felder).  
- **Copy‑Prompt Panel** (siehe 6) – Ein‑Klick in Zwischenablage.  
- **SERP‑Preview** (Google‑Stil) & **OG‑Preview** (Card).  
- **Publish/Schedule** (DatePicker, Plattform‑Verteilung anzeigen).

### 5.5 Design System – Styles/Patterns
- Verwende DS‑Klassen: `.lyd-button`, `.lyd-button-primary`, `.lyd-button-secondary`, `.component-card`, `.backoffice-layout`, `.backoffice-main`, `.lyd-badge`, `.lyd-table`, `.lyd-input`, `.lyd-select`, `.lyd-toggle` etc.  
- Abstände über DS‑Spacing‑Variablen, keine Inline‑Styles.  
- Farblogik: Primärverlauf **Deep→Royal Blue** (Brand).  
- Responsiv: Mobile First; Tabellen mit Sticky‑Headern und Truncation für Slugs/Titel.

---

## 6) „Copy Prompt“ für externe KI (UI + Inhalt)

### 6.1 UI‑Baustein (Auszug)
```tsx
function CopyAgentPrompt() {
  const jsonTemplate = `{"version":"1.1","source":{"agent":"chatgpt","model":"gpt-4.1","timestamp":"${new Date().toISOString()}"},"content":{"platforms":["WOHNEN"],"category":"","subcategory":"","tags":[],"title":"","slug":"","excerpt":"","seo":{"metaTitle":"","metaDescription":"","focusKeyword":"","keywords":[],"canonicalUrl":"","og":{"title":"","description":"","image":"","type":"article"}},"format":"mdx","body":"# Titel...","htmlBlocks":[],"featuredImage":{"src":"","alt":""},"images":[],"jsonLd":{"@context":"https://schema.org","@type":"BlogPosting","headline":"","datePublished":"${new Date().toISOString().slice(0,10)}"}}}`;
  return (
    <div className="component-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Agent‑Anweisung & JSON‑Template</h3>
        <button className="lyd-button lyd-button-primary" onClick={() => navigator.clipboard.writeText(jsonTemplate)}>Inhalt kopieren</button>
      </div>
      <p className="mt-2 text-sm">Nutze diese Vorgaben in deinem KI‑Agenten. Ersetze Felder und liefere optional Assets (ZIP/Inline).</p>
      <pre className="mt-3 text-xs overflow-auto">{jsonTemplate}</pre>
    </div>
  );
}
```

### 6.2 Agent‑Briefing (Text, wird ebenfalls per Copy angeboten)
```
Du schreibst für Live Your Dreams. Wähle je Inhalt passende Plattformen: WOHNEN | MAKLER | ENERGIE.
Liefere **immer** valides JSON v1.1 gemäß Template.

Pflicht:
- title (≤120), slug, excerpt (≤200), platforms (1..3), category, format (md|mdx|html), body **oder** htmlBlocks, jsonLd (BlogPosting/Article).
- Für Bilder: Alt‑Text.
- Für HTML‑Grafiken: htmlBlocks mit optionaler CSS/JS‑Sektion; iFrames nur YouTube‑NoCookie, Parameter angeben.

SEO:
- metaTitle/metaDescription, focusKeyword, keywords[], canonicalUrl.
- Struktur: H2/H3, FAQ‑Block, interne Links.

Format:
- mdx bevorzugt; umfangreiche Interaktivität über htmlBlocks.
- Assets als URLs **oder** Base64‑Assets im Paket.
```

---

## 7) Rendering‑Pipeline (Preview & Frontend)

### 7.1 Markdown/MDX
- Backoffice‑Preview: `react-markdown` (MD) **oder** MDX‑Renderer im Safe‑Mode.  
- Plugins: `remark-gfm`, `rehype-raw` (nur wenn nötig), **immer** `rehype-sanitize` mit LYD‑Schema (siehe 5.3).  
- Code‑Blöcke: Syntax‑Highlighting (Shiki/Prism) – neutraler DS‑Style.

### 7.2 HTML‑Blöcke
- Einbettung in `<section class="lyd-htmlblock" data-id="...">…</section>`.  
- Optional „Sandbox“ Wrapper: iFrames mit `sandbox`, `allow`, `referrerpolicy`, feste Höhe/Breite.  
- Inline‑CSS injizieren; Inline‑JS **nur** wenn explizit freigegeben. Kein Zugriff auf `window.top`.

### 7.3 Bilder
- Lazy‑Loading, `width/height` setzen, responsive `sizes/srcset`; WebP bevorzugt; Fallback JPEG.  
- DS‑Komponenten für **Figure/Card** nutzen (einheitliche Ränder/Kantenradius).

---

## 8) SEO & Qualitätssicherung

### 8.1 SERP/OG‑Preview & Linting
- **SERP‑Preview** (Title, URL, Meta Description).  
- **OG‑Preview** (Bild/Titel/Desc).  
- **SEO‑Linter**: Checks für Title/Description‑Länge, Keyword‑Verwendung (sanft), Bild‑Alt‑Texte, H‑Struktur, Canonical, JSON‑LD vorhanden.

### 8.2 JSON‑LD
- `BlogPosting`/`Article` mit: `headline`, `description`, `datePublished`, `author/publisher`, `image` (falls vorhanden), `mainEntityOfPage`, `keywords`.  
- Validierung gegen Schema; Warnung statt Blocker (außer invalides JSON).

### 8.3 Sitemaps & Revalidierung
- `sitemap.xml` je Plattform; Rebuild/Invalidate nach Publish.  
- ISR/Revalidation Hooks pro Frontend‑Seite (`/blog/[slug]`).

---

## 9) Sicherheit, Rechte & Governance

- **XSS‑Schutz**: Sanitizing‑Schema, `rel="nofollow noopener noreferrer"` auf externen Links, iFrame‑Whitelist.  
- **Uploads**: MIME/Größen‑Limits, Virenscan (ClamAV/Lambda, optional).  
- **RBAC**: Rollen `Author`, `Editor`, `Publisher`, `Admin` mit passenden Rechten.  
- **Auditlog**: Importquelle, Modell, Timestamps, Änderungen.  
- **Copyright/Lizenzen**: Pflicht zur Angabe/Bereitstellung bei Assets.  
- **DSGVO**: Keine personenbezogenen Daten in Artikeln; Logs ohne IPs persistieren.

---

## 10) Umsetzung in Cursor.ai – Schritt‑für‑Schritt

1) **Prisma Modelle** erweitern (siehe §3.1) und Migration ausführen.  
2) **S3/CDN** vorbereiten; envs: `AWS_REGION`, `AWS_S3_BUCKET`.  
3) **API‑Routes**: `/api/blog/import`, `/api/blog/validate`, `/api/blog/[id]`, `/api/blog/[id]/publish`, `/api/blog/bulk-import`.  
4) **Sanitizer Schema** definieren (Whitelist aus §5.3).  
5) **Backoffice‑Screens** bauen (Übersicht, Import, Edit/Review) mit DS‑Komponenten.  
6) **Copy‑Prompt Panel** integrieren (JSON‑Template + Agent‑Briefing).  
7) **Preview‑Renderer** (MD/MDX + HTML‑Blocks).  
8) **SEO‑Preview/Linter** einschalten.  
9) **Webhook‑Distribution** je Plattform.  
10) **Sitemap/ISR** pro Plattform.

---

## 11) Code‑Snippets (Kurz, produktionsnah)

### 11.1 Zod‑Schema für Import (Server)
```ts
const HtmlBlock = z.object({
  id: z.string(),
  title: z.string().optional(),
  html: z.string().min(1),
  css: z.string().optional(),
  js: z.string().optional(),
  sandbox: z.object({
    allowedIframes: z.array(z.string().url()).default([]),
    allow: z.string().optional(),
    height: z.number().min(100).max(2000).default(420)
  }).optional()
});

export const ImportSchema = z.object({
  version: z.literal('1.1'),
  source: z.object({ agent: z.string(), model: z.string(), timestamp: z.string() }),
  content: z.object({
    platforms: z.array(z.enum(['WOHNEN','MAKLER','ENERGIE'])).min(1),
    category: z.string(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).default([]),
    title: z.string().min(10).max(120),
    slug: z.string().regex(/^[a-z0-9-]{5,}$/),
    excerpt: z.string().min(40).max(200),
    seo: z.object({
      metaTitle: z.string().max(120).optional(),
      metaDescription: z.string().max(200).optional(),
      focusKeyword: z.string().optional(),
      keywords: z.array(z.string()).default([]),
      canonicalUrl: z.string().url().optional(),
      og: z.object({ title: z.string().optional(), description: z.string().optional(), image: z.string().optional(), type: z.string().optional() }).optional()
    }),
    format: z.enum(['md','mdx','html']).default('mdx'),
    body: z.string().optional(),
    htmlBlocks: z.array(HtmlBlock).default([]),
    featuredImage: z.object({ src: z.string(), alt: z.string().min(3) }).optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string().min(3), width: z.number().optional(), height: z.number().optional() })).default([]),
    jsonLd: z.record(z.any()).optional()
  })
}).superRefine((val, ctx) => {
  const hasContent = !!val.content.body || (val.content.htmlBlocks && val.content.htmlBlocks.length>0);
  if (!hasContent) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'body oder htmlBlocks erforderlich' });
});
```

### 11.2 Route Handler (Import, verkürzt)
```ts
export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = ImportSchema.parse(json);

  // 1) Slug‑Check
  if (await db.blogPost.findUnique({ where: { slug: parsed.content.slug } })) {
    return NextResponse.json({ error: 'Slug existiert' }, { status: 409 });
  }

  // 2) Assets (optional) → S3 & URL‑Rewrite
  // ... uploadAssets(parsed.assets)

  // 3) Persist
  const post = await db.blogPost.create({ data: mapImportToModel(parsed) });

  return NextResponse.json({ id: post.id, status: 'DRAFT' });
}
```

### 11.3 Sanitizer‑Schema (Auszug)
```ts
import sanitize from 'rehype-sanitize';
import { defaultSchema } from 'hast-util-sanitize';

const allowed = structuredClone(defaultSchema);
allowed.tagNames.push('figure','figcaption','svg','path','rect','circle','table','thead','tbody','tr','th','td','iframe');
allowed.attributes!['a'] = [['href'], ['rel'], ['target']];
allowed.attributes!['img'] = [['src'], ['alt'], ['width'], ['height'], ['loading']];
allowed.attributes!['iframe'] = [['src'], ['width'], ['height'], ['allow'], ['sandbox'], ['allowfullscreen']];

export const sanitizePlugin = [sanitize(allowed)];
```

### 11.4 SERP‑Preview (vereinfachter React‑Block)
```tsx
function SerpPreview({ title, slug, description }) {
  return (
    <div className="component-card">
      <div className="text-[#1a0dab] text-lg truncate">{title}</div>
      <div className="text-[#006621] text-sm">liveyourdreams.online › blog › {slug}</div>
      <div className="text-[#545454] text-sm">{description}</div>
    </div>
  );
}
```

---

## 12) Qualitätssicherung & Betrieb

- **Pre‑Publish Check**: Sanitizing ok, Bilder vorhanden, JSON‑LD valide, interne Links erreichbar (optional).  
- **Rollback**: Status zurück auf `DRAFT`/`ARCHIVED`, Frontend revalidieren.  
- **Monitoring**: Import‑Fehlerquote, 95. Perzentil Renderzeit, Bildgrößen/CLS.  
- **Backups**: tägliche DB‑Snapshots; S3 Lifecycle‑Policies.  
- **Roadmap**: Später KI‑Assist für „Linting/Verbesserungen“ (ohne Autogenerierung), Analyse‑Dashboard, Autorenprofile, Multilingual.

---

## 13) Zusammenfassung
Dieses Briefing definiert **ein robustes Import‑Format (JSON v1.1)**, UI/UX‑Bausteine im **LYD‑Designsystem**, eine sichere **Render‑Pipeline** für **MD/MDX/HTML‑Grafiken**, sowie **Distribution** über Sub‑Brands. Damit kann die externe KI Inhalte perfekt anliefern – und das Backoffice diese schnell, sicher und SEO‑optimiert veröffentlichen.

