# Admin Routes Test-Plan

## Problem (gelöst)
Die `authorized()` Callback-Funktion in `lib/auth.ts` hatte fehlerhaften Routing-Logic:
- Alle eingeloggten User wurden zu `/dashboard` redirected, außer sie waren bereits auf `/dashboard`
- Das blockierte `/admin`, `/admin/users`, `/admin/roles`, `/admin/api-keys`

## Lösung
**File: `apps/backoffice/lib/auth.ts`**

**Vorher:**
```typescript
async authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  
  if (isOnDashboard) {
    return true
  } else if (isLoggedIn) {
    return Response.redirect(new URL('/dashboard', nextUrl))  // ← Blockierte alle anderen Routen!
  }
  return true
}
```

**Nachher:**
```typescript
async authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
  const isOnAdmin = nextUrl.pathname.startsWith('/admin')
  
  // Protected routes: dashboard und admin
  if (isOnDashboard || isOnAdmin) {
    if (!isLoggedIn) {
      return false // Redirect to login
    }
    
    // Check if user is active
    if (!auth.user.isActive) {
      return Response.redirect(new URL('/auth/error?error=AccountDeactivated', nextUrl))
    }
    
    // Admin-Routen: Prüfe admin Role
    if (isOnAdmin) {
      const isAdmin = auth.user.role === 'admin'
      if (!isAdmin) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
    }
    
    return true
  }
  
  // Login-Seite: Redirect eingeloggte User zu Dashboard
  if (nextUrl.pathname === '/' && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }
  
  // Alle anderen Routen erlauben
  return true
}
```

## Änderungen in Admin-Seiten

**File: `apps/backoffice/app/admin/page.tsx`**
- ❌ Entfernt: useEffect mit Client-side Auth-Check
- ❌ Entfernt: router.push('/dashboard') Redirects
- ✅ Auth wird jetzt Server-side über NextAuth authorized() gehandelt

**File: `apps/backoffice/app/admin/api-keys/page.tsx`**
- ❌ Entfernt: 401 Status Check und Auth-Redirect
- ❌ Entfernt: useRouter Import
- ✅ Nur noch Daten-Fetching im useEffect

## Test-Szenarien

### 1. Als Admin User einloggen
```bash
# Test-Credentials (falls vorhanden)
Email: admin@liveyourdreams.online
Password: [siehe .env oder Datenbank]
```

**Erwartetes Verhalten:**
- ✅ Login erfolgreich → Redirect zu `/dashboard`
- ✅ Navigation zu `/admin` → Zeigt Admin Overview
- ✅ Navigation zu `/admin/users` → Zeigt User Management
- ✅ Navigation zu `/admin/roles` → Zeigt Role Management
- ✅ Navigation zu `/admin/api-keys` → Zeigt API Cost Monitoring

### 2. Als Non-Admin User einloggen
```bash
# Test mit Editor/Viewer Role
```

**Erwartetes Verhalten:**
- ✅ Login erfolgreich → Redirect zu `/dashboard`
- ❌ Navigation zu `/admin` → Redirect zu `/dashboard` (403-ähnlich)
- ❌ Navigation zu `/admin/users` → Redirect zu `/dashboard`
- ❌ Navigation zu `/admin/api-keys` → Redirect zu `/dashboard`

### 3. Ohne Login
```bash
# Inkognito-Modus oder ausgeloggt
```

**Erwartetes Verhalten:**
- ❌ Navigation zu `/admin` → Redirect zu `/` (Login-Seite)
- ❌ Navigation zu `/dashboard` → Redirect zu `/` (Login-Seite)
- ✅ Navigation zu `/` → Zeigt Login-Seite

### 4. Inaktiver Admin User
```bash
# User mit isActive = false
```

**Erwartetes Verhalten:**
- ❌ Login → Redirect zu `/auth/error?error=AccountDeactivated`

## Test-Checklist

- [ ] **Test 1:** Admin Login → `/admin` funktioniert
- [ ] **Test 2:** Admin Login → `/admin/users` funktioniert
- [ ] **Test 3:** Admin Login → `/admin/roles` funktioniert
- [ ] **Test 4:** Admin Login → `/admin/api-keys` funktioniert
- [ ] **Test 5:** Non-Admin User → `/admin` redirected zu `/dashboard`
- [ ] **Test 6:** Ausgeloggt → `/admin` redirected zu Login
- [ ] **Test 7:** Navigation Cards auf `/admin` funktionieren
- [ ] **Test 8:** API Stats werden geladen auf `/admin/api-keys`

## Debugging Commands

### Check User Role in Database
```bash
cd apps/backoffice
npx prisma studio
# → Öffnet http://localhost:5555
# → Prüfe users Tabelle → role Spalte
```

### Check Session
```bash
# In Browser DevTools Console:
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

### Check Debug Endpoint
```bash
curl http://localhost:3000/api/debug/user-roles \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

## Deployment-Verifikation

Nach Deployment zu Vercel:

```bash
# Check Production
curl https://backoffice.liveyourdreams.online/api/auth/session

# Test Admin Route (mit Session Cookie)
curl https://backoffice.liveyourdreams.online/admin \
  -H "Cookie: next-auth.session-token=PROD_TOKEN"
```

## Bekannte Limitierungen

1. **Keine Permission-Level Checks:** Admin-Check ist binär (admin/non-admin)
   - Zukünftig: Granulare Permissions über `auth.user.permissions`
   
2. **Client Components:** Admin-Seiten sind Client Components
   - Könnte zu Server Components konvertiert werden für bessere Performance
   - Würde `auth()` Helper direkt in Page Component erlauben

3. **API Route Auth:** `/api/admin/api-stats` muss eigene Auth-Checks haben
   - Derzeit: `auth()` Check im Route Handler
   - Sollte konsistent mit authorized() Callback sein

## Nächste Schritte (Optional)

1. **Server Component Migration:**
   ```typescript
   // app/admin/page.tsx als Server Component
   import { auth } from '@/lib/nextauth'
   
   export default async function AdminPage() {
     const session = await auth()
     // Kein useEffect mehr nötig
   }
   ```

2. **Permission-Based Access:**
   ```typescript
   if (isOnAdmin) {
     const hasPermission = auth.user.permissions.includes('admin.access')
     if (!hasPermission) {
       return Response.redirect(new URL('/dashboard', nextUrl))
     }
   }
   ```

3. **Audit Logging:**
   ```typescript
   // Log Admin Access
   await prisma.auditEvent.create({
     data: {
       type: 'ADMIN_ACCESS',
       actorUserId: auth.user.id,
       meta: { path: nextUrl.pathname }
     }
   })
   ```

---

**Status:** ✅ Fixes implementiert  
**Testing:** Pending - Lokaler Test erforderlich  
**Deployment:** Pending

