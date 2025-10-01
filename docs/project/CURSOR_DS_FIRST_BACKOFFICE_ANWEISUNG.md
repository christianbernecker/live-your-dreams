# 🚀 DS-FIRST BACKOFFICE AUSBAU (1:1 Cursor-Ready)

## ⚠️ UNVERHANDELBARE REGELN

**DESIGN SYSTEM FIRST - NULL TOLERANZ:**
- Nur DS-Wrapper verwenden (Button, Input, Select, Card, Modal, etc.)
- KEINE nativen HTML-Controls ohne lyd-* Klassen
- KEINE Inline-Styles oder Hartwerte (px, hex, rgba)
- KEINE Tailwind/Bootstrap/andere CSS-Frameworks
- CI bricht bei DS-Verstößen ab

## 📋 STEP-BY-STEP (Copy & Paste in Cursor)

### 1) Dependencies & MCPs installieren

```bash
npm i -D @modelcontextprotocol/sdk octokit node-fetch glob
chmod +x tools/mcp/*/index.mjs
```

**ENV Variables setzen (.env.local):**
```env
# GitHub MCP
GITHUB_TOKEN="ghp_xxxxx"  # Fine-grained PAT mit Repo-Rechten

# Neon MCP  
NEON_API_KEY="xxxxx"
NEON_PROJECT_ID="xxxxx"
NEON_DATABASE_NAME="neondb"
NEON_DEFAULT_USER="neondb_owner"
NEON_DEFAULT_PASSWORD="xxxxx"
```

### 2) Branch & DS-Enforcement aktivieren

```bash
git checkout -b feat/ds-first-user-roles-cms
```

**apps/backoffice/.eslintrc.json ergänzen:**
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "lyd/enforce-ds-wrappers": "error",
    "lyd/no-hard-classes": "error",
    "lyd/no-inline-styles": "error"
  }
}
```

**apps/backoffice/tools/check-design-conformance.mjs erstellen:**
```javascript
import { readFileSync } from 'fs';
import { glob } from 'glob';

const VIOLATIONS = {
  hardcodedColors: /(?:color|background(?:-color)?|border(?:-color)?)\s*:\s*(?:#[0-9a-f]{3,6}|rgb|rgba|hsl|hsla)/gi,
  hardcodedSizes: /(?:width|height|padding|margin|font-size|gap|border-radius)\s*:\s*\d+(?:px|rem|em)/gi,
  inlineStyles: /style\s*=\s*["'][^"']*["']/gi,
  nativeElements: /<(?:button|input|select|textarea|table|form)(?!\s+className=["'][^"']*lyd-)/gi
};

const files = glob.sync('apps/backoffice/**/*.{tsx,ts}', { ignore: ['**/node_modules/**'] });
let violations = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const [type, regex] of Object.entries(VIOLATIONS)) {
    const matches = [...content.matchAll(regex)];
    if (matches.length > 0) {
      console.error(`❌ ${file}: ${matches.length} ${type} violations`);
      violations += matches.length;
    }
  }
}

if (violations > 0) {
  console.error(`\n💥 ${violations} Design System violations found!`);
  process.exit(1);
} else {
  console.log('✅ Design System compliance: PASSED');
}
```

### 3) Prisma Schema erweitern

**prisma/schema.prisma - ZUSÄTZLICHE Modelle:**
```prisma
model Role {
  id          String       @id @default(cuid())
  name        String       @unique // 'admin' | 'editor' | 'viewer'
  description String?
  rolePermissions RolePermission[]
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Permission {
  id          String       @id @default(cuid())
  key         String       @unique // 'user.read', 'content.publish'
  description String?
  rolePermissions RolePermission[]
  userPermissions UserPermission[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}

model UserPermission {
  userId       String
  permissionId String
  user         User       @relation(fields: [userId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([userId, permissionId])
}

model ContentType {
  id          String   @id @default(cuid())
  key         String   @unique // 'post', 'page', 'news'
  name        String
  fields      Json     // schema definition
  entries     ContentEntry[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ContentStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}

model ContentEntry {
  id            String        @id @default(cuid())
  typeId        String
  type          ContentType   @relation(fields: [typeId], references: [id])
  slug          String        @unique
  title         String
  data          Json          // content data
  status        ContentStatus @default(DRAFT)
  publishedAt   DateTime?
  authorId      String?
  author        User?         @relation(fields: [authorId], references: [id])
  deletedAt     DateTime?     // soft delete
  auditEvents   AuditEvent[]  @relation("AuditContent")
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model AuditEvent {
  id           String   @id @default(cuid())
  type         String   // 'USER_CREATE', 'CONTENT_PUBLISH'
  actorUserId  String?
  actorUser    User?    @relation("AuditUser", fields: [actorUserId], references: [id])
  contentId    String?
  contentEntry ContentEntry? @relation("AuditContent", fields: [contentId], references: [id])
  meta         Json?    // diff, ip, userAgent
  createdAt    DateTime @default(now())
}

// User Modell erweitern:
model User {
  // ... existing fields ...
  roleId          String?
  role            Role?            @relation(fields: [roleId], references: [id])
  userPermissions UserPermission[]
  contentEntries  ContentEntry[]
  auditEvents     AuditEvent[]     @relation("AuditUser")
}
```

**Migration ausführen:**
```bash
npx prisma migrate dev --name "rbac-content-audit"
```

### 4) RBAC & Permissions (NUR Design System!)

**lib/rbac.ts:**
```typescript
export type PermissionKey =
  | 'user.read' | 'user.write' | 'user.invite' 
  | 'role.read' | 'role.write'
  | 'content.read' | 'content.write' | 'content.review' | 'content.publish'
  | 'content.delete' | 'content.restore' 
  | 'settings.read' | 'settings.write';

export const ROLE_PRESETS: Record<string, PermissionKey[]> = {
  admin: ['user.read','user.write','user.invite','role.read','role.write',
          'content.read','content.write','content.review','content.publish',
          'content.delete','content.restore','settings.read','settings.write'],
  editor: ['content.read','content.write','content.review','content.publish'],
  reviewer: ['content.read','content.review'],
  viewer: ['content.read']
};
```

**lib/permissions.ts:**
```typescript
import type { Session } from 'next-auth';
import { prisma } from './db';

export async function hasPermission(session: Session | null, key: string) {
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: { include: { rolePermissions: { include: { permission: true } } } },
      userPermissions: { include: { permission: true } }
    }
  });
  if (!user) return false;

  const rolePerms = user.role?.rolePermissions.map(rp => rp.permission.key) ?? [];
  const userPerms = user.userPermissions.map(up => up.permission.key);
  return new Set([...rolePerms, ...userPerms]).has(key);
}

export async function enforcePermission(session: Session | null, key: string) {
  const ok = await hasPermission(session, key);
  if (!ok) throw new Response('Forbidden', { status: 403 });
}
```

### 5) API Routes (Neon-optimiert)

**ALLE API-Routes MÜSSEN:**
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```

**app/api/users/route.ts:**
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import { enforcePermission } from '@/lib/permissions';
import { audit } from '@/lib/audit';

export async function GET() {
  const session = await auth();
  await enforcePermission(session, 'user.read');
  const users = await prisma.user.findMany({ include: { role: true } });
  return Response.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  await enforcePermission(session, 'user.write');
  const body = await req.json();
  const user = await prisma.user.create({ data: body });
  await audit('USER_CREATE', { userId: user.id }, session?.user?.id);
  return Response.json(user, { status: 201 });
}
```

### 6) Admin UI - NUR DS-WRAPPER!

**app/admin/users/page.tsx:**
```tsx
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

export default function UsersPage() {
  return (
    <div className="lyd-container">
      <Card className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">User Management</h1>
          <Button variant="primary" className="lyd-button">
            Neuer User
          </Button>
        </div>
        
        <Table className="lyd-table">
          <thead>
            <tr className="lyd-table-header">
              <th className="lyd-table-cell">Name</th>
              <th className="lyd-table-cell">Email</th>
              <th className="lyd-table-cell">Rolle</th>
              <th className="lyd-table-cell">Aktionen</th>
            </tr>
          </thead>
          {/* Table content - nur DS-Klassen! */}
        </Table>
      </Card>
    </div>
  );
}
```

### 7) CI Pipeline erweitern

**package.json scripts:**
```json
{
  "scripts": {
    "check:design": "node tools/check-design-conformance.mjs",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  }
}
```

**.github/workflows/backoffice-ci.yml:**
```yaml
- name: Design System Compliance
  run: npm run check:design
  
- name: Lint
  run: npm run lint
  
- name: Type Check  
  run: npm run typecheck
```

### 8) MCP Usage Beispiele

**In Cursor direkt verwendbar:**
```
# GitHub PR Management
github.listPullRequests({ state: "open" })
github.createPullRequest({ title: "feat: RBAC + CMS", head: "feat/ds-first-user-roles-cms" })

# Neon Database Branching
neon.createBranch({ name: "pr-123" })
neon.getConnectionUrl({ branchName: "pr-123" })

# Design System Compliance
ds-linter.scanDesignSystemViolations({ severity: "error" })
ds-linter.checkSingleFile({ filePath: "apps/backoffice/app/admin/users/page.tsx" })

# Documentation Search
docs.searchDocs({ query: "RBAC permissions" })
docs.getDoc({ filePath: "docs/CRITICAL_LEARNINGS_LOGIN_DEBUGGING.md" })
```

## ✅ DEFINITION OF DONE

**CI MUSS GRÜN SEIN:**
- [ ] `npm run check:design` - 0 Verstöße
- [ ] `npm run lint` - 0 Fehler  
- [ ] `npm run typecheck` - 0 Fehler
- [ ] Playwright Tests - RBAC + Smoke

**CODE REQUIREMENTS:**
- [ ] Alle UI-Komponenten nutzen DS-Wrapper
- [ ] Keine Inline-Styles oder Hartwerte
- [ ] Alle API-Routes: runtime='nodejs' + enforcePermission()
- [ ] User/Role/Content CRUD funktional
- [ ] Auditing aktiv (alle Mutationen loggen)
- [ ] Neon Database SSL + Channel Binding

**BUSINESS LOGIC:**
- [ ] Admin kann User + Rollen verwalten
- [ ] Editor kann Content erstellen/bearbeiten
- [ ] Reviewer kann Content freigeben  
- [ ] Viewer hat Read-Only Zugriff
- [ ] Content-Workflow: DRAFT → REVIEW → PUBLISHED
- [ ] Soft-Delete + Restore funktioniert

## 🚨 NULL-TOLERANZ POLICIES

**SOFORTIGER PR-REJECT bei:**
- Inline-Styles (`style=` Attribut)
- Nativen HTML-Controls ohne DS-Wrapper
- Hartwerten (px, hex, rgba, box-shadow)
- Fehlender Permission-Enforcement in APIs
- Fehlender runtime='nodejs' in DB-Routes

**Bei Verstößen:**
1. ds-linter.scanDesignSystemViolations() ausführen
2. Alle Violations fixen (DS-Wrapper verwenden)
3. check:design + lint erneut ausführen
4. Erst dann PR ready für Review

---

**🎯 RESULT:** Backoffice mit strikter DS-Konformität, vollständigem RBAC, Content-Management und Neon-Optimierung. Kein Kompromiss bei Design System Compliance!

