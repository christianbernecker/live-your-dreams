# 🗄️ **Neon PostgreSQL - Database Setup**

> **Serverless PostgreSQL Datenbank für Live Your Dreams**

---

## 🎯 **Current Production Database**

**Connection String:**
```
postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Dashboard:** [console.neon.tech](https://console.neon.tech)

---

## 🏗️ **Neon Architecture**

```mermaid
graph TD
    A[Vercel App] --> B[Connection Pooler]
    B --> C[Neon Compute]
    C --> D[Storage Layer]
    D --> E[S3-Compatible Storage]
    
    F[Branch: Main] --> C
    G[Branch: Preview] --> H[Separate Compute]
    H --> D
```

### **Neon Features:**
- ✅ **Serverless:** Auto-scaling, nur bei Nutzung aktiv
- ✅ **Branching:** Database Branches für Development/Testing
- ✅ **Point-in-time Recovery:** Backup & Restore
- ✅ **Connection Pooling:** Optimierte Verbindungen
- ✅ **EU Region:** GDPR-konform in eu-west-2

---

## 🚀 **Setup & Konfiguration**

### **1. Neon Account & Projekt**

```bash
# Neon CLI installieren (optional)
npm install -g neonctl

# Login
neonctl auth

# Projekt-Info
neonctl projects list
```

### **2. Database Schema (Prisma)**

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  firstName   String?  @map("first_name")
  lastName    String?  @map("last_name")
  password    String
  isActive    Boolean  @default(true) @map("is_active")
  isVerified  Boolean  @default(false) @map("is_verified")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relations
  roles       UserRole[]
  auditEvents AuditEvent[] @relation("UserAuditEvents")
  
  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String   @map("display_name")
  description String?
  color       String   @default("#3b82f6")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relations
  users       UserRole[]
  permissions RolePermission[]
  
  @@map("roles")
}

model UserRole {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  roleId     String   @map("role_id")
  assignedAt DateTime @default(now()) @map("assigned_at")
  assignedBy String   @map("assigned_by")
  
  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, roleId])
  @@map("user_roles")
}

// Weitere Models...
```

### **3. Environment Variables**

**Lokale Entwicklung (.env.local):**
```bash
# Neon Database
DATABASE_URL="postgresql://neondb_owner:password@host/neondb?sslmode=require"

# Alternative: Direct Connection (ohne Connection Pool)
DIRECT_DATABASE_URL="postgresql://neondb_owner:password@host/neondb?sslmode=require&channel_binding=require"
```

**Vercel Production:**
```bash
# Via Vercel CLI setzen
vercel env add DATABASE_URL production
# Wert: postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require
```

---

## 🔄 **Database Migrations**

### **Prisma Migration Workflow:**

```bash
# Schema ändern
# → prisma/schema.prisma bearbeiten

# Migration erstellen
npx prisma migrate dev --name add_new_feature

# Schema pushen (Development)
npx prisma db push

# Client generieren
npx prisma generate

# Production Migration
npx prisma migrate deploy
```

### **Seed Data Setup:**

**prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin User erstellen
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@liveyourdreams.online' },
    update: {},
    create: {
      email: 'admin@liveyourdreams.online',
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      password: await bcrypt.hash('admin123', 12),
      isActive: true,
      isVerified: true,
    },
  });

  // Admin Role erstellen
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: 'Administrator',
      description: 'System Administrator with full access',
      color: '#ef4444',
      isActive: true,
    },
  });

  // Role Assignment
  await prisma.userRole.upsert({
    where: { 
      userId_roleId: { 
        userId: adminUser.id, 
        roleId: adminRole.id 
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
      assignedBy: 'system',
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Seeding ausführen:**
```bash
npx prisma db seed
```

---

## 📊 **Database Management**

### **Neon Console:**
- **Dashboard:** [console.neon.tech](https://console.neon.tech)
- **SQL Editor:** Direkte Query-Ausführung
- **Monitoring:** Connection & Performance Metrics
- **Backup:** Point-in-time Recovery

### **Prisma Studio:**
```bash
# GUI für Database Management
npx prisma studio

# Öffnet: http://localhost:5555
```

### **Direct SQL Access:**
```bash
# Via psql (lokaler PostgreSQL Client)
psql 'postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require'

# Basis-Queries
\dt                    # Alle Tabellen
SELECT * FROM users;   # User-Daten
SELECT * FROM roles;   # Rollen-Daten
```

---

## 🔧 **Performance & Optimierung**

### **Connection Pooling:**
```typescript
// lib/db.ts - Optimierte Prisma Setup
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### **Query-Optimierungen:**
```typescript
// Effiziente Queries mit Prisma
const usersWithRoles = await prisma.user.findMany({
  include: {
    roles: {
      include: {
        role: true,
      },
    },
  },
  where: {
    isActive: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

---

## 🚨 **Backup & Recovery**

### **Neon Branching (Database Branches):**
```bash
# Branch für Testing erstellen
neonctl branches create --name testing

# Branch-spezifische Connection String
neonctl connection-string testing
```

### **Point-in-time Recovery:**
- **Retention:** 7 Tage (Free Plan) / 30+ Tage (Paid)
- **Granularität:** Minute-genau
- **Via Console:** Backup & Restore UI

### **Manual Backup:**
```bash
# Schema Export
npx prisma db pull --url="$DATABASE_URL"

# Data Export (via pg_dump)
pg_dump "$DATABASE_URL" > backup.sql

# Restore
psql "$DATABASE_URL" < backup.sql
```

---

## 🔍 **Monitoring & Debugging**

### **Connection Monitoring:**
```typescript
// Prisma Connection Test
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected. Users: ${userCount}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}
```

### **Performance Debugging:**
```bash
# Slow Query Analysis
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

---

## 📋 **Migration Checklist**

### **Schema Changes:**
- [ ] Prisma Schema aktualisiert
- [ ] Migration erstellt (`prisma migrate dev`)
- [ ] Migration tested (lokale DB)
- [ ] Production Migration (`prisma migrate deploy`)
- [ ] Rollback-Plan vorhanden

### **Data Changes:**
- [ ] Seed Script aktualisiert
- [ ] Test-Daten bereinigt
- [ ] Production-Daten gesichert
- [ ] Migration ausgeführt
- [ ] Verifikation durchgeführt

---

## ✅ **Success Criteria**

**🎯 DATENBANK BEREIT wenn:**
- Connection String funktioniert
- Schema ist deployed
- Admin User existiert
- Seed Data ist geladen
- Backups sind konfiguriert
- Performance ist optimal (< 100ms)

---

*Aktualisiert: September 2025 | Neon Serverless PostgreSQL*
