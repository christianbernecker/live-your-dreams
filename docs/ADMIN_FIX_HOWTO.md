# Admin-Bereich Fix - User Guide

## Problem
Nach dem letzten Update (Commit 5e48e6e) wurde die Admin-Authentifizierung von **permission-based** auf **role-based** umgestellt.

### Symptome
- Admin-Link fehlt in der linken Navigation
- `/admin` zeigt Fehlermeldung "Server Components render error"

## Root Cause
1. ✅ Database: Admin-User hat korrekt `admin` role in `user_roles` table
2. ✅ Auth Config: Lädt Rolle aus RBAC-System korrekt
3. ❌ **Session ist veraltet**: JWT-Token enthält noch alte Rolle (Token valid für 24h)

## Lösung: Session invalidieren

### Option 1: Logout + Re-Login (empfohlen)
1. Klicke auf "Abmelden" im Backoffice
2. Login mit Admin-Credentials
3. Admin-Link sollte jetzt sichtbar sein

### Option 2: Warte 24 Stunden
Der JWT-Token expired automatisch nach 24h, danach wird eine neue Session mit korrekter Rolle erstellt.

### Option 3: Cookies manuell löschen
1. Browser DevTools öffnen (F12)
2. Application > Cookies > `https://backoffice.liveyourdreams.online`
3. Alle Cookies löschen
4. Seite neu laden und re-login

## Was wurde gefixt (Code-Changes)

### [app/admin/page.tsx](../apps/backoffice/app/admin/page.tsx)
```diff
- import { hasPermission } from '@/lib/permissions';
+ // Removed - now using role-based checks

export default async function AdminPage() {
  const session = await auth();
+
+  // Admin-only access check (role-based, not permission-based)
+  if (!session?.user || session.user.role !== 'admin') {
+    throw new Error('Unauthorized: Admin access required');
+  }

  const stats = await getAdminStats();

-  // Filter sections based on permissions
-  const allowedSections = [];
-  for (const section of adminSections) {
-    if (await hasPermission(session, section.permission as any)) {
-      allowedSections.push(section);
-    }
-  }
+  // Admin sections - no permission filtering needed (already admin-only)
```

### [components/layout/SidebarNavigation.tsx](../apps/backoffice/components/layout/SidebarNavigation.tsx)
```typescript
// Admin-Link visibility check (seit Commit 5e48e6e)
const isAdmin = session?.user?.role === 'admin'

const visibleNavigationItems = navigationItems.filter(item => {
  if (item.adminOnly) {
    return isAdmin // Nur für role === 'admin'
  }
  return true
})
```

### [lib/auth.ts](../apps/backoffice/lib/auth.ts)
```typescript
// JWT Callback lädt Rolle aus RBAC-System
async authorize(credentials) {
  // ...

  // Load user role from RBAC system (simplified - no permissions)
  let primaryRole = 'viewer'; // Default role

  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
    include: { role: true }
  });

  if (userRoles.length > 0) {
    // Admin takes precedence
    for (const userRole of userRoles) {
      if (userRole.role.isActive && userRole.role.name === 'admin') {
        primaryRole = 'admin';
        break;
      }
    }
  }

  return {
    id: user.id,
    email: user.email,
    role: primaryRole, // ← Diese Rolle landet im JWT
    isActive: isActive,
  }
}
```

## Verifizierung

Nach Re-Login sollte:
1. ✅ Admin-Link in linker Navigation sichtbar sein
2. ✅ `/admin` Page ohne Fehler laden
3. ✅ Admin-Dashboard alle Statistiken anzeigen

## Database Status (Stand: 2025-10-03)

```sql
-- Admin User
SELECT id, email, role, "isActive" FROM users WHERE email = 'admin@liveyourdreams.online';
-- Result: admin_001, admin@liveyourdreams.online, admin, true

-- Admin Role Assignment (RBAC)
SELECT ur.user_id, r.name, r.display_name, r.is_active
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = 'admin_001';
-- Result: admin_001, admin, Administrator, true
```

✅ Database ist korrekt konfiguriert!

## Falls Problem weiterhin besteht

### Debug-Schritte:
1. Check Session:
   ```bash
   # Im Browser DevTools Console:
   fetch('/api/auth/session').then(r => r.json()).then(console.log)
   ```
   Erwartetes Resultat nach Re-Login: `{ user: { role: "admin", ... } }`

2. Check Database:
   ```bash
   npm run tsx scripts/check-admin-rbac.ts
   ```
   Sollte "✅ Admin user correctly assigned to admin role!" zeigen

3. Check Middleware:
   - Prüfe Browser Network Tab: `/admin` sollte Status 200 haben (nicht 302 Redirect)
   - Falls 302 → Session hat nicht `role: 'admin'` → Re-login nötig

## Commit Reference
- Fix-Commit: TBD (dieser Commit)
- Original Issue: Commit 5e48e6e (Simplify Permission System)
- Previous Fix: Commit d6e2258 (Admin-Bereich Recovery nach API-Key Integration)
