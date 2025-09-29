# ⚡ **Live Your Dreams - Quick Start Guide**

> **In 10 Minuten von Zero zu Hero - Lokale Entwicklungsumgebung**

---

## 🎯 **Schnellübersicht**

**Was bekommst du:**
- ✅ Lokale Next.js Backoffice App
- ✅ Design System Integration  
- ✅ Neon PostgreSQL Verbindung
- ✅ NextAuth Authentication
- ✅ Hot Reload Development

**Requirements:**
- Node.js 18+
- Git
- 10 Minuten Zeit

---

## 🚀 **1. Repository Clonen**

```bash
# Clone Repository
git clone https://github.com/christianbernecker/live-your-dreams.git
cd live-your-dreams

# Zum Backoffice wechseln
cd apps/backoffice
```

---

## 📦 **2. Dependencies Installieren**

```bash
# NPM Dependencies installieren
npm install

# Prisma Client generieren
npx prisma generate
```

---

## 🔧 **3. Environment Variables Setup**

**Erstelle `.env.local`:**
```bash
cp .env.example .env.local
```

**Fülle `.env.local` aus:**
```bash
# Database (verwende Production DB für Quick Start)
DATABASE_URL="postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret-change-this"

# Optional: OAuth (falls gewünscht)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**🔥 Pro-Tipp:** Für Quick Start verwenden wir die Production DB (Read-Only für Development).

---

## 🗄️ **4. Database Setup**

```bash
# Database Schema überprüfen
npx prisma db pull

# Seed Data laden (Admin User erstellen)
npx prisma db seed
```

**Admin Login:**
- Email: `admin@liveyourdreams.online`
- Password: `admin123`

---

## 🎨 **5. Design System Integration**

**Design System CSS ist bereits integriert via:**
```css
/* apps/backoffice/public/master.css */
/* Import LOCAL Design System Master CSS */
@import '/master.css';
```

**Verifikation:**
```bash
# Check ob Design System CSS existiert
ls -la public/master.css

# Falls nicht vorhanden:
curl -o public/master.css https://designsystem.liveyourdreams.online/shared/master.css
```

---

## 🚀 **6. Development Server Starten**

```bash
# Start Development Server
npm run dev

# Server läuft auf: http://localhost:3000
```

**Öffne Browser:** `http://localhost:3000`

---

## ✅ **7. Verifikation**

### **Login Test:**
1. Gehe zu `http://localhost:3000`
2. Login mit:
   - Email: `admin@liveyourdreams.online`
   - Password: `admin123`
3. Du solltest das Dashboard sehen

### **Admin Features Test:**
1. Gehe zu `/admin/users`
2. Du solltest User-Management sehen
3. Teste "Neuen Benutzer" erstellen
4. Gehe zu `/admin/roles`
5. Du solltest Role-Management sehen

### **Design System Test:**
1. Öffne `https://designsystem.liveyourdreams.online`
2. Alle Komponenten sollten laden
3. Buttons, Input, Cards sollten styled sein

---

## 🛠️ **Development Workflow**

### **Code Changes:**
```bash
# Auto-Reload beim Ändern von:
# - pages/ oder app/ (Next.js Routes)
# - components/ (React Components)  
# - lib/ (Utilities)
# - styles/ (CSS)

# Manual Restart nötig bei:
# - .env.local Changes
# - prisma/schema.prisma Changes
# - next.config.js Changes
```

### **Database Changes:**
```bash
# Schema Changes
npx prisma db push          # Push changes to dev DB
npx prisma generate         # Regenerate Prisma Client
npm run dev                 # Restart dev server

# View Database
npx prisma studio          # GUI für DB Management
```

### **Useful Commands:**
```bash
# Linting
npm run lint
npm run lint:fix

# Testing  
npm run test
npm run test:watch

# Build (lokaler Test)
npm run build
npm run start

# Database
npm run db:migrate         # Run migrations
npm run db:seed           # Seed database
npm run db:reset          # Reset database
npm run db:studio         # Open Prisma Studio
```

---

## 🔍 **Debugging**

### **Häufige Probleme:**

**🔴 Port 3000 bereits belegt:**
```bash
# Anderen Port verwenden
npm run dev -- -p 3001
# Oder in package.json: "dev": "next dev -p 3001"
```

**🔴 Database Connection Error:**
```bash
# Connection String prüfen
echo $DATABASE_URL

# Test Connection
npx prisma db pull
```

**🔴 NextAuth Error:**
```bash
# NEXTAUTH_SECRET generieren
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# In .env.local setzen
NEXTAUTH_SECRET="generated-secret-here"
```

**🔴 Design System CSS nicht geladen:**
```bash
# CSS manuell downloaden
curl -o public/master.css https://designsystem.liveyourdreams.online/shared/master.css

# Server restart
npm run dev
```

---

## 🎯 **Quick Tasks**

### **Neue Komponente erstellen:**
```bash
# 1. Komponente erstellen
touch components/ui/MyComponent.tsx

# 2. Design System CSS verwenden
<button className="lyd-button primary">Click Me</button>

# 3. Im Browser testen
```

### **Neue API Route erstellen:**
```bash
# 1. API Route erstellen  
touch app/api/my-endpoint/route.ts

# 2. Basic Handler
export async function GET(request: Request) {
  return Response.json({ message: 'Hello World' });
}

# 3. Via Browser testen: http://localhost:3000/api/my-endpoint
```

### **Neue Seite erstellen:**
```bash  
# 1. Page erstellen
mkdir app/my-page
touch app/my-page/page.tsx

# 2. Basic Page
export default function MyPage() {
  return <div>My New Page</div>;
}

# 3. Via Browser testen: http://localhost:3000/my-page
```

---

## 🚀 **Deployment (nach Development)**

### **Vercel Deployment:**
```bash
# Installation (einmalig)
npm install -g vercel

# Deployment
cd apps/backoffice
vercel --prod

# Domain wird automatisch generiert
# Oder Custom Domain konfigurieren
```

### **Environment Variables für Production:**
```bash
# Production Environment Variables via Vercel Dashboard
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

---

## 📚 **Weiterführende Docs**

**Nach Quick Start:**
- **[Vercel Deployment Guide](../deployment/VERCEL_COMPLETE_GUIDE.md)** - Production Deployment
- **[Design System Integration](../design-system/DESIGN_SYSTEM_INTEGRATION_GUIDE.md)** - Erweiterte DS Features
- **[Database Management](../deployment/NEON_DATABASE_SETUP.md)** - PostgreSQL Deep Dive
- **[Architecture Overview](../architecture/VERCEL_ARCHITECTURE.md)** - System Architecture

**Live Systeme:**
- 🌐 **[Design System](https://designsystem.liveyourdreams.online)** - Komponenten-Referenz
- 🏢 **[Production Backoffice](https://backoffice.liveyourdreams.online)** - Live System

---

## ✅ **Success Criteria**

**🎉 QUICK START ERFOLGREICH wenn:**
- [ ] `localhost:3000` ist erreichbar
- [ ] Login funktioniert (admin@liveyourdreams.online)
- [ ] Dashboard ist sichtbar
- [ ] `/admin/users` zeigt User-Management
- [ ] Design System Komponenten sind styled
- [ ] Hot Reload funktioniert bei Code-Changes

**🚀 BEREIT FÜR DEVELOPMENT!**

---

*Geschätzte Zeit: 5-10 Minuten | Updated: September 2025*
