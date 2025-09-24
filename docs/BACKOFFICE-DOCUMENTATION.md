# 📚 Live Your Dreams Backoffice - Entwicklungsdokumentation

## 🎯 Übersicht

Das LYD Backoffice ist eine moderne, vollständig funktionale Immobilienverwaltungs-Plattform, entwickelt mit Next.js 14 und dem hauseigenen Design System.

### Quick Links
- **Live URL**: https://backoffice.liveyourdreams.online
- **Design System**: http://designsystem.liveyourdreams.online (Auth: admin/lyd-design-2024)
- **Repository**: https://github.com/christianbernecker/live-your-dreams

---

## 🏗️ Architektur

### Tech Stack

| Layer | Technologie | Version | Zweck |
|-------|------------|---------|-------|
| **Frontend** | Next.js (App Router) | 14.2.33 | React Framework mit SSR |
| **Sprache** | TypeScript | 5.3.x | Type Safety |
| **Styling** | Design System CSS | Custom | Eigene CSS Variables & Komponenten |
| **State** | React Hooks | 18.x | Client State Management |
| **API** | Next.js API Routes | 14.x | Backend Endpoints |
| **Database** | PostgreSQL | 16 | Relationale Datenbank |
| **ORM** | Prisma | 5.22.0 | Type-safe Database Access |
| **Auth** | NextAuth.js | 4.24.x | Authentication & Sessions |
| **Storage** | AWS S3 | - | Media Storage |
| **Hosting** | AWS ECS Fargate | - | Container Orchestration |
| **CDN** | CloudFront | - | Content Delivery |
| **DNS** | Route53 | - | Domain Management |

### System-Architektur

```mermaid
graph TB
    subgraph "Client"
        B[Browser]
    end
    
    subgraph "AWS Cloud"
        subgraph "Edge"
            CF[CloudFront CDN]
            R53[Route53 DNS]
        end
        
        subgraph "Application Layer"
            ALB[Application Load Balancer]
            subgraph "ECS Cluster"
                BO[Backoffice Container]
                DS[Design System Container]
            end
        end
        
        subgraph "Data Layer"
            RDS[(PostgreSQL RDS)]
            S3[S3 Bucket]
            SM[Secrets Manager]
        end
    end
    
    B --> R53
    R53 --> CF
    CF --> ALB
    ALB --> BO
    ALB --> DS
    BO --> RDS
    BO --> S3
    BO --> SM
```

---

## 📁 Projektstruktur

```
/apps/backoffice/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth-geschützte Routes
│   │   ├── dashboard/         # Dashboard mit Statistiken
│   │   ├── properties/        # Immobilienverwaltung
│   │   ├── leads/            # Lead-Management
│   │   ├── pricing/          # Preisrechner
│   │   └── settings/         # Einstellungen
│   ├── (public)/             # Öffentliche Routes
│   │   └── [slug]/           # Microsite-Generator
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication APIs
│   │   ├── properties/      # Property CRUD APIs
│   │   ├── leads/          # Lead APIs
│   │   └── integrations/   # External Services
│   ├── globals.css          # Design System CSS
│   ├── layout.tsx          # Root Layout
│   └── providers.tsx       # Context Providers
├── components/              # React Components
│   ├── dashboard/          # Dashboard-spezifisch
│   ├── properties/         # Property Components
│   ├── leads/             # Lead Components
│   └── shared/            # Wiederverwendbare Components
├── lib/                    # Utilities & Services
│   ├── api/              # API Helpers
│   ├── auth/             # Auth Configuration
│   ├── db.ts             # Prisma Client
│   └── validations/      # Zod Schemas
├── prisma/                # Database Schema
│   ├── schema.prisma     # Prisma Schema
│   └── migrations/       # Database Migrations
├── public/               # Static Assets
├── types/               # TypeScript Types
├── .env.local          # Environment Variables
├── next.config.mjs     # Next.js Configuration
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind (wird entfernt)
└── tsconfig.json       # TypeScript Config
```

---

## 🎨 Design System Integration

### CSS Variables

```css
:root {
  /* Farben */
  --lyd-primary: #0066ff;      /* Primärfarbe */
  --lyd-secondary: #3366CC;     /* Sekundärfarbe */
  --lyd-deep: #000066;          /* Dunkles Blau */
  --lyd-text: #111;             /* Textfarbe */
  --lyd-grey: #666;             /* Grauton */
  --lyd-line: #e5e7eb;          /* Linien/Borders */
  --lyd-bg: #f8fafc;            /* Hintergrund */
  --lyd-white: #ffffff;         /* Weiß */
  --lyd-gradient: linear-gradient(135deg, #000066, #3366CC);
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Font Sizes */
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Core Components

```css
/* Card Component */
.component-card {
  background: var(--lyd-white);
  border: 1px solid var(--lyd-line);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

/* Button Component */
.lyd-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  cursor: pointer;
}

.lyd-button-primary {
  background: var(--lyd-gradient);
  color: white;
  border: 2px solid var(--lyd-primary);
}

.lyd-button-secondary {
  background: transparent;
  color: var(--lyd-primary);
  border: 2px solid var(--lyd-primary);
}

/* Layout Components */
.backoffice-layout {
  display: flex;
  min-height: 100vh;
}

.backoffice-sidebar {
  width: 280px;
  background: var(--lyd-gradient);
  color: white;
  padding: 24px;
  position: fixed;
  height: 100vh;
}

.backoffice-main {
  flex: 1;
  margin-left: 280px;
  padding: 32px;
  background: var(--lyd-bg);
}
```

---

## 🔧 Entwicklungsumgebung

### Prerequisites

- Node.js 20+
- Docker Desktop
- AWS CLI configured
- PostgreSQL (local oder RDS)

### Installation

```bash
# Repository klonen
git clone https://github.com/christianbernecker/live-your-dreams.git
cd live-your-dreams/apps/backoffice

# Dependencies installieren
npm install

# Umgebungsvariablen einrichten
cp .env.example .env.local

# Datenbank initialisieren
npx prisma migrate dev
npx prisma db seed

# Entwicklungsserver starten
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/lyd_backoffice"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# AWS (für Production)
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="lyd-media"

# External Services
IS24_CLIENT_ID="your-client-id"
IS24_CLIENT_SECRET="your-secret"
```

---

## 📊 Datenbank-Schema

### Core Tables

```prisma
model User {
  id              String     @id @default(uuid())
  email           String     @unique
  name            String?
  role            UserRole   @default(AGENT)
  hashedPassword  String
  totpSecret      String?
  totpEnabled     Boolean    @default(false)
  properties      Property[]
  leads           Lead[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Property {
  id              String         @id @default(uuid())
  title           String
  slug            String         @unique
  type            PropertyType
  status          PropertyStatus @default(DRAFT)
  
  // Location
  address         String
  city            String
  postcode        String
  latitude        Float?
  longitude       Float?
  
  // Details
  price           Int
  livingArea      Float
  totalArea       Float?
  roomCount       Float
  bathrooms       Int
  floor           Int?
  totalFloors     Int?
  
  // Features
  hasBalcony      Boolean        @default(false)
  hasGarden       Boolean        @default(false)
  hasParking      Boolean        @default(false)
  hasElevator     Boolean        @default(false)
  
  // Energy
  energyClass     String?
  energyValue     Float?
  
  // Relations
  owner           User           @relation(fields: [ownerId], references: [id])
  ownerId         String
  images          PropertyImage[]
  leads           Lead[]
  rooms           Room[]
  
  // Metadata
  publishedAt     DateTime?
  soldAt          DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Lead {
  id              String         @id @default(uuid())
  name            String
  email           String
  phone           String?
  message         String?
  
  // Qualification
  budget          Int?
  timeline        String?
  score           Int?           @default(0)
  status          LeadStatus     @default(NEW)
  
  // Relations
  property        Property       @relation(fields: [propertyId], references: [id])
  propertyId      String
  assignedTo      User?          @relation(fields: [assignedToId], references: [id])
  assignedToId    String?
  activities      LeadActivity[]
  viewings        Viewing[]
  
  // GDPR
  gdprConsent     Boolean        @default(false)
  consentDate     DateTime?
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

enum PropertyType {
  APARTMENT
  HOUSE
  PENTHOUSE
  COMMERCIAL
  LAND
}

enum PropertyStatus {
  DRAFT
  PUBLISHED
  SOLD
  RENTED
  RESERVED
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  VIEWING_SCHEDULED
  NEGOTIATING
  CLOSED_WON
  CLOSED_LOST
}
```

---

## 🚀 Deployment

### Docker Build

```bash
# Build Docker Image
docker build \
  --platform linux/amd64 \
  -f Dockerfile.design-system-ui \
  -t lyd-backoffice:latest .

# Tag für ECR
docker tag lyd-backoffice:latest \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-backoffice:latest

# Push zu ECR
docker push \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-backoffice:latest
```

### ECS Deployment

```bash
# Task Definition registrieren
aws ecs register-task-definition \
  --cli-input-json file://deployment/ecs/ecs-backoffice-task.json \
  --region eu-central-1

# Service updaten
aws ecs update-service \
  --cluster lyd-cluster \
  --service lyd-backoffice \
  --task-definition lyd-backoffice-production \
  --force-new-deployment \
  --region eu-central-1
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Backoffice

on:
  push:
    branches: [main]
    paths:
      - 'apps/backoffice/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      
      - name: Build and Push Docker
        run: |
          docker build -t lyd-backoffice:${{ github.sha }} .
          docker tag lyd-backoffice:${{ github.sha }} \
            ${{ secrets.ECR_URI }}/lyd-backoffice:latest
          docker push ${{ secrets.ECR_URI }}/lyd-backoffice:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster lyd-cluster \
            --service lyd-backoffice \
            --force-new-deployment
```

---

## 🎯 Implementierte Features

### ✅ Dashboard
- **Statistik-Karten**: Immobilien, Leads, Views, Revenue mit Trends
- **Lead Funnel**: Visualisierung der Lead-Pipeline
- **Recent Activity**: Timeline der letzten Aktivitäten
- **Upcoming Viewings**: Besichtigungstermine-Übersicht
- **Quick Actions**: Schnellzugriff auf wichtige Funktionen

### ✅ Immobilienverwaltung
- **Grid Layout**: Responsive Property Cards
- **Filter-System**: Status, Typ, Preisrange
- **Suche**: Nach Titel, Stadt, Adresse
- **Sortierung**: Nach Datum, Preis, Leads
- **Property Details**: Vollständige Immobilienansicht
- **Status-Management**: Draft, Published, Sold
- **Feature-Icons**: Visualisierung von Ausstattung

### ✅ Design System
- **CSS Variables**: Konsistente Farben und Spacing
- **Custom Components**: Cards, Buttons, Tables
- **Responsive Layout**: Mobile-optimiert
- **Dark Mode Ready**: Vorbereitet für Theme-Switching
- **Typography**: Inter Font-Familie
- **Animations**: Smooth Transitions

---

## 📝 API Endpoints

### Authentication
```typescript
POST   /api/auth/signin         # Login
POST   /api/auth/signout        # Logout
GET    /api/auth/session        # Get Session
POST   /api/auth/2fa/setup      # 2FA Setup
POST   /api/auth/2fa/verify     # 2FA Verify
```

### Properties
```typescript
GET    /api/properties          # List Properties
POST   /api/properties          # Create Property
GET    /api/properties/[id]     # Get Property
PUT    /api/properties/[id]     # Update Property
DELETE /api/properties/[id]     # Delete Property
POST   /api/properties/[id]/publish    # Publish
POST   /api/properties/[id]/media      # Upload Images
```

### Leads
```typescript
GET    /api/leads               # List Leads
POST   /api/leads               # Create Lead
GET    /api/leads/[id]          # Get Lead
PUT    /api/leads/[id]          # Update Lead
POST   /api/leads/[id]/qualify  # Qualify Lead
POST   /api/leads/[id]/assign   # Assign Agent
```

### Integrations
```typescript
GET    /api/integrations/is24/auth      # IS24 OAuth
POST   /api/integrations/is24/publish   # Publish to IS24
GET    /api/integrations/is24/sync      # Sync Status
```

---

## 🔄 Weiterentwicklung

### Geplante Features

#### Phase 1: Core Features
- [ ] **Lead-Management**: Vollständige Lead-Qualifizierung
- [ ] **Preisrechner**: Algorithmus-basierte Preisberechnung
- [ ] **Microsite-Generator**: Automatische Landingpages
- [ ] **Media Upload**: S3-Integration mit Bildoptimierung

#### Phase 2: Integrationen
- [ ] **IS24-Integration**: Automatisches Publishing
- [ ] **Email-Marketing**: Newsletter & Automation
- [ ] **WhatsApp Business**: Lead-Kommunikation
- [ ] **Kalender-Sync**: Google/Outlook Integration

#### Phase 3: Advanced Features
- [ ] **AI-Texte**: GPT-4 für Exposé-Generierung
- [ ] **Virtual Tours**: 360° Rundgänge
- [ ] **Analytics Dashboard**: Conversion-Tracking
- [ ] **Multi-Tenancy**: Mehrere Makler-Accounts

### Code-Konventionen

#### Naming Conventions
```typescript
// Components: PascalCase
PropertyCard.tsx
LeadQualificationForm.tsx

// Functions: camelCase
async function getPropertyById() {}
const calculatePrice = () => {}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_ENDPOINTS = {};

// Types/Interfaces: PascalCase
interface PropertyData {}
type LeadStatus = 'new' | 'qualified';
```

#### File Structure
```typescript
// Component File Structure
components/
  properties/
    PropertyCard.tsx         // Component
    PropertyCard.module.css  // Styles
    PropertyCard.test.tsx    // Tests
    index.ts                // Export
```

#### Git Workflow
```bash
# Branch Naming
feature/lead-qualification
bugfix/property-upload-error
hotfix/critical-auth-issue

# Commit Messages
feat: Add lead qualification workflow
fix: Resolve image upload timeout
docs: Update API documentation
style: Format dashboard components
refactor: Optimize property queries
test: Add lead conversion tests
```

---

## 🐛 Troubleshooting

### Common Issues

#### Docker Build Fails
```bash
# Cache löschen
docker system prune -a

# Mit no-cache bauen
docker build --no-cache -t lyd-backoffice:latest .
```

#### ECS Service Not Starting
```bash
# Logs prüfen
aws logs tail /ecs/lyd-backoffice --follow

# Task-Status prüfen
aws ecs describe-tasks \
  --cluster lyd-cluster \
  --tasks $(aws ecs list-tasks --cluster lyd-cluster --service lyd-backoffice --query 'taskArns[0]' --output text)
```

#### Database Connection Issues
```bash
# Prisma Client regenerieren
npx prisma generate

# Migrations neu ausführen
npx prisma migrate reset
npx prisma migrate dev
```

---

## 📞 Support & Kontakt

**Entwicklungsteam**: Live Your Dreams Tech Team  
**Repository**: https://github.com/christianbernecker/live-your-dreams  
**Documentation**: Diese Datei  
**Design System**: http://designsystem.liveyourdreams.online

---

## 📜 Changelog

### Version 1.0.0 (24.09.2024)
- ✅ Initial Release
- ✅ Dashboard mit Statistiken
- ✅ Immobilienverwaltung
- ✅ Design System Integration
- ✅ Docker Deployment
- ✅ AWS ECS Hosting

### Planned v1.1.0
- 🔄 Lead-Management System
- 🔄 Preisrechner-Algorithmus
- 🔄 Media Upload (S3)
- 🔄 Microsite-Generator

---

*Letzte Aktualisierung: 24. September 2024*
