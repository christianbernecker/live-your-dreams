# Beispiele: Intelligente AI API Usage

Dieses Dokument zeigt konkrete Beispiele, wie die **neue intelligente AI API** in zukünftigen Features verwendet werden kann.

## ✨ NEU: Task-basierte Model-Auswahl

Statt Models hardcoded anzugeben, wählst du einfach den **Task** und die **Quality**-Stufe:

```typescript
import { callAI } from '@/lib/api/ai';

const response = await callAI({
  task: 'coding',        // System wählt bestes Coding-Model (Claude Sonnet 4.5)
  quality: 'premium',    // Höchste Qualität
  feature: 'code-generator',
  messages: [{ role: 'user', content: 'Schreibe eine Funktion...' }],
});
```

**Vorteile:**
- ✅ Automatisch immer neuestes Model
- ✅ Task-optimierte Model-Wahl
- ✅ Kostenoptimierung durch Quality-Stufen
- ✅ Fallback bei Provider-Ausfällen

---

## 1. Blog AI Assistant

**Feature**: KI-gestützter Content-Assistent für Blog-Posts

```typescript
// app/api/blog/ai-assist/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { callAI } from '@/lib/api/ai';  // ✨ NEU: Intelligente API

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { blogId, prompt, context } = await req.json();

  try {
    const response = await callAI({
      task: 'general',           // ✨ Task statt Model
      quality: 'standard',       // ✨ Kostenoptimiert
      feature: 'blog-ai-assistant',
      messages: [
        {
          role: 'user',
          content: `Du bist ein hilfreicher Content-Assistent.

Context: ${context}

User Request: ${prompt}

Bitte hilf dem User mit seinem Blog-Post.`
        }
      ],
      userId: session.user.id,
      maxTokens: 2048,
      metadata: { blogId }
    });

    return NextResponse.json({
      suggestion: response.content,
      usage: response.usage
    });
  } catch (error) {
    console.error('AI Assistant Error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
}
```

---

## 2. Code Generator (Premium Quality)

**Feature**: Automatische Code-Generierung

```typescript
// app/api/code/generate/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { generateCode } from '@/lib/api/ai';  // ✨ Convenience Function

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { prompt } = await req.json();

  try {
    // ✨ Automatisch bestes Coding-Model (Claude Sonnet 4.5)
    const code = await generateCode({
      prompt,
      feature: 'code-generator',
      userId: session.user.id,
      quality: 'premium',  // Höchste Qualität für Code
    });

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Code Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 });
  }
}
```

---

## 3. Content Moderation (Fast & Günstig)

**Feature**: Automatische Moderation von User-Kommentaren

```typescript
// app/api/comments/moderate/route.ts
import { NextResponse } from 'next/server';
import { quickResponse } from '@/lib/api/ai';  // ✨ Fast & Günstig

export async function POST(req: Request) {
  const { commentId, content } = await req.json();

  try {
    // ✨ Schnellste & günstigste Option (GPT-5-nano)
    const result = await quickResponse({
      prompt: `Analysiere folgenden Kommentar:

"${content}"

Bewerte:
1. Ist der Kommentar angemessen? (ja/nein)
2. Enthält er Spam? (ja/nein)
3. Ist er beleidigend? (ja/nein)

Antwort als JSON:
{
  "appropriate": true/false,
  "spam": true/false,
  "offensive": true/false,
  "reason": "..."
}`,
      feature: 'comment-moderation',
    });

    const moderation = JSON.parse(result);

    return NextResponse.json({
      approved: moderation.appropriate && !moderation.spam && !moderation.offensive,
      moderation
    });
  } catch (error) {
    console.error('Moderation Error:', error);
    return NextResponse.json({ error: 'Failed to moderate' }, { status: 500 });
  }
}
```

---

## 4. SEO Meta Tags Generator

**Feature**: Automatische Meta-Tags Generierung

```typescript
// app/api/blog/generate-meta/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { analyzeText } from '@/lib/api/ai';  // ✨ Convenience Function

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { blogId, title, content } = await req.json();

  try {
    const metaJson = await analyzeText({
      text: `Titel: ${title}\n\nContent: ${content.substring(0, 500)}...`,
      task: `Erstelle SEO-optimierte Meta-Tags:

1. Meta Description (max 160 Zeichen)
2. Meta Keywords (max 10, kommasepariert)
3. OG Title (max 60 Zeichen)
4. OG Description (max 200 Zeichen)

Antwort als JSON:
{
  "metaDescription": "...",
  "metaKeywords": "...",
  "ogTitle": "...",
  "ogDescription": "..."
}`,
      feature: 'seo-meta-generator',
      userId: session.user.id,
      quality: 'standard',  // Standard Quality ausreichend
    });

    const meta = JSON.parse(metaJson);
    return NextResponse.json(meta);
  } catch (error) {
    console.error('Meta Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate meta tags' }, { status: 500 });
  }
}
```

---

## 5. Complex Reasoning Task

**Feature**: Deep Analysis mit Reasoning-Model

```typescript
// app/api/analysis/deep-dive/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { reasonAbout } from '@/lib/api/ai';  // ✨ Reasoning-optimiert

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { question, context } = await req.json();

  try {
    // ✨ Automatisch Reasoning-Model (GPT o4-mini)
    const analysis = await reasonAbout({
      question,
      context,
      feature: 'deep-analysis',
      userId: session.user.id,
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
```

---

## 6. Vision Task (Multi-Modal)

**Feature**: Bild-Analyse

```typescript
// app/api/images/analyze/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { callAI } from '@/lib/api/ai';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { imageUrl, context } = await req.json();

  try {
    const response = await callAI({
      task: 'vision',  // ✨ Automatisch Vision-Model
      quality: 'premium',
      feature: 'image-analysis',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: `Analysiere dieses Bild und erstelle:

1. SEO Alt-Text (max 125 Zeichen)
2. Social Media Caption
3. Keywords (kommasepariert)

Context: ${context || 'Reise & Lifestyle Blog'}

Antwort als JSON.`
            }
          ]
        }
      ],
      userId: session.user.id,
      metadata: { imageUrl }
    });

    const result = JSON.parse(response.content);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
```

---

## Task & Quality Matrix

| Task          | Premium Model           | Standard Model        | Fast Model        | Best For                      |
|---------------|-------------------------|-----------------------|-------------------|-------------------------------|
| `coding`      | Claude Sonnet 4.5       | Claude Sonnet 4       | Claude Haiku 3.5  | Code Generation               |
| `reasoning`   | GPT o4-mini             | GPT-5                 | GPT-5 Mini        | Deep Analysis                 |
| `general`     | GPT-5                   | GPT-5 Mini            | GPT-5 Nano        | Text Tasks                    |
| `fast`        | GPT-5 Mini              | Claude Haiku          | GPT-5 Nano        | Quick Responses               |
| `vision`      | Claude Sonnet 4.5       | GPT-4o                | GPT-4o            | Image Analysis                |

---

## Quality Levels

- **`premium`**: Höchste Qualität, teurer (z.B. Code, komplexe Analysen)
- **`standard`**: Gute Balance, empfohlen für die meisten Tasks
- **`fast`**: Schnell & günstig, für einfache Tasks
- **`nano`**: Sehr günstig, nur für triviale Tasks

---

## Best Practices

### 1. Wähle den richtigen Task
```typescript
// ✅ Gut
await callAI({ task: 'coding', ... })  // Für Code

// ❌ Schlecht
await callAI({ task: 'general', ... })  // Für Code suboptimal
```

### 2. Optimiere Quality für Kosten
```typescript
// ✅ Gut - Moderation braucht kein Premium
await callAI({ task: 'fast', quality: 'nano', ... })

// ❌ Schlecht - Überdimensioniert
await callAI({ task: 'reasoning', quality: 'premium', ... })  // Für einfache Moderation
```

### 3. Nutze Convenience Functions
```typescript
// ✅ Gut - Klar & einfach
await generateCode({ prompt: '...', feature: 'x' })

// ❌ Umständlich
await callAI({ task: 'coding', quality: 'premium', messages: [...] })
```

### 4. Tracking via Feature-Namen
```typescript
// ✅ Gut - Aussagekräftig
feature: 'blog-ai-assistant'

// ❌ Schlecht - Nicht trackbar
feature: 'test1'
```

### 5. Error Handling
```typescript
try {
  const response = await callAI({...});
  return response.content;
} catch (error) {
  console.error('AI Error:', error);
  // Fallback oder User-Notification
  return 'Standardantwort';
}
```

---

## Monitoring im Dashboard

Alle API Calls werden automatisch im `/admin` Dashboard getrackt:

- **Feature Breakdown**: Welches Feature verursacht die meisten Kosten?
- **Model Distribution**: Welche Models werden verwendet?
- **Daily Costs**: Kosten-Entwicklung über Zeit
- **Quality Metrics**: Welche Quality-Stufen werden genutzt?

So kannst du datenbasiert optimieren!
