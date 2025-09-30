# LYD Blog Artikel – Quick Prompt

> Copy-Paste diesen Prompt in ChatGPT/Claude für schnelle Artikel-Erstellung

---

## 📋 PROMPT TEMPLATE

```
Du bist Content-Stratege für Live Your Dreams (LYD), eine Premium-Immobilienmarke.

AUFGABE:
Erstelle einen Blog-Artikel für [PLATFORM: WOHNEN / MAKLER / ENERGIE]

THEMA: "[Artikel-Titel]"
ZIELGRUPPE: [Beschreibung]
FOKUS-KEYWORD: "[keyword]"
LÄNGE: ~2.000 Wörter

STRUKTUR:
- H1 + Lead-Absatz (Problem-Setup)
- 4-6 H2-Hauptabschnitte (je ~200 Wörter)
- H3-Unterabschnitte mit Details
- FAQ-Block (mind. 5 Fragen)
- Fazit + CTA

SEO-REQUIREMENTS:
- Meta-Title: 50-60 Zeichen
- Meta-Description: 150-160 Zeichen  
- Fokus-Keyword in H1, ersten 100 Wörtern, 2-3 H2
- Interne Links: 2-3 (Platzhalter /link-ziel)

BILDER:
- Featured Image: 1600x900px von Unsplash (München-relevant)
- 2-4 Inline Images (Markdown ![alt](url))
- Alle Alt-Texte SEO-optimiert

OUTPUT:
Vollständiges JSON v1.1 Format:

{
  "version": "1.1",
  "source": {
    "agent": "chatgpt",
    "model": "gpt-4.1-turbo",
    "timestamp": "[ISO-8601]"
  },
  "content": {
    "platforms": ["PLATTFORM"],
    "category": "[Kategorie]",
    "subcategory": "[Optional]",
    "tags": ["tag1", "tag2", "tag3"],
    "title": "[Titel max 70 Zeichen]",
    "slug": "[url-safe-slug]",
    "excerpt": "[150-180 Zeichen Zusammenfassung]",
    "seo": {
      "metaTitle": "[50-60 Zeichen]",
      "metaDescription": "[150-160 Zeichen]",
      "focusKeyword": "[keyword]",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "canonicalUrl": "https://[platform].liveyourdreams.online/blog/[slug]",
      "og": {
        "title": "[OG-Titel]",
        "description": "[OG-Beschreibung]",
        "image": "[Unsplash-URL]",
        "type": "article"
      }
    },
    "format": "mdx",
    "body": "[Kompletter Markdown/MDX Content]",
    "featuredImage": {
      "src": "[Unsplash-URL ?w=1600&h=900]",
      "alt": "[SEO-optimierter Alt-Text mit München]",
      "width": 1600,
      "height": 900
    },
    "images": [
      {
        "id": "img-1",
        "src": "[Unsplash-URL ?w=1200]",
        "alt": "[Alt-Text]",
        "width": 1200,
        "height": 800,
        "caption": "[Optional]"
      }
    ],
    "jsonLd": {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "[Titel]",
      "description": "[Excerpt]",
      "image": "[Featured-Image-URL]",
      "datePublished": "[YYYY-MM-DD]",
      "dateModified": "[YYYY-MM-DD]",
      "author": {
        "@type": "Organization",
        "name": "Live Your Dreams [Plattform]"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Live Your Dreams",
        "logo": {
          "@type": "ImageObject",
          "url": "https://liveyourdreams.online/logo.png"
        }
      }
    }
  }
}

WICHTIG:
- JSON muss valide sein (keine Syntax-Fehler)
- Markdown im "body" Feld escapen (\" für ", \n für Zeilenumbrüche)
- Unsplash URLs mit ?w=1600&h=900&auto=format Parameter
- München-Bezug wo sinnvoll
- Praktische Beispiele, Checklisten, Tabellen

START!
```

---

## 🎯 VERWENDUNGS-BEISPIELE

### Beispiel 1: LYD Wohnen

```
[PLATFORM: WOHNEN]
THEMA: "Immobilienbewertung München: Die 5 besten Methoden 2025"
ZIELGRUPPE: Privatverkäufer, 35-55 Jahre, DIY-affin
FOKUS-KEYWORD: "immobilienbewertung münchen"
BESONDERHEITEN: Kosten-Vergleich Tabelle, ROI-Rechner CTA
```

### Beispiel 2: LYD Makler

```
[PLATFORM: MAKLER]
THEMA: "Luxury Real Estate München: Top 5 Premium-Lagen 2025"
ZIELGRUPPE: Premium-Käufer, 45+ Jahre, Investment-orientiert
FOKUS-KEYWORD: "luxury real estate münchen"
BESONDERHEITEN: Marktdaten Q4 2024, Investment-Strategie, diskret
```

### Beispiel 3: LYD Energie

```
[PLATFORM: ENERGIE]
THEMA: "Wärmepumpe: Kosten, Förderung & Amortisation (Guide 2025)"
ZIELGRUPPE: Eigentümer/Vermieter, 40-65 Jahre, Modernisierung
FOKUS-KEYWORD: "wärmepumpe kosten förderung"
BESONDERHEITEN: BAFA-Förderung Schritt-für-Schritt, ROI-Tabelle
```

---

## ✅ QUALITÄTSKONTROLLE (Checkliste)

Nach Erhalt des JSON von der KI:

- [ ] JSON ist valide (paste in jsonlint.com)
- [ ] Mindestlänge: 1.500 Wörter
- [ ] Meta-Title: 50-60 Zeichen
- [ ] Meta-Description: 150-160 Zeichen
- [ ] Featured Image: Unsplash URL mit Parametern
- [ ] Alt-Texte: Alle vorhanden und beschreibend
- [ ] FAQ: Mindestens 5 Fragen
- [ ] JSON-LD: Vollständig
- [ ] Slug: URL-safe (nur a-z, 0-9, -)
- [ ] CTA eingebunden

---

## 🚀 IMPORT IN LYD BACKOFFICE

1. JSON in Datei speichern: `artikel-name.json`
2. Login: https://backoffice.liveyourdreams.online
3. Navigation: Dashboard → Blog → Artikel importieren
4. JSON hochladen
5. Preview prüfen (SERP, OpenGraph)
6. Import durchführen
7. Status auf "REVIEW" oder "PUBLISHED" setzen

---

**Ready to go! 🎯**
