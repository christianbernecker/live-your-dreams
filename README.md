# Live Your Dreams - Complete Real Estate Platform

> **Premium Real Estate Platform with Automotive-Grade Design System**

[![Production Status](https://img.shields.io/badge/Status-Production%20Ready-success)](http://designsystem.liveyourdreams.online)
[![Design System](https://img.shields.io/badge/Design%20System-Premium%20Quality-blue)](http://designsystem.liveyourdreams.online)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Ready-success)](https://vercel.com)

---

## 🚀 **Quick Start**

```bash
# Clone repository
git clone https://github.com/christianbernecker/live-your-dreams.git
cd live-your-dreams

# Start local development
cd apps/backoffice
npm install
npm run dev
```

**🌐 Live URLs:**
- **Design System:** [designsystem.liveyourdreams.online](http://designsystem.liveyourdreams.online)
- **Backoffice:** [backoffice.liveyourdreams.online](https://backoffice.liveyourdreams.online)

---

## 🚢 **Deployment**

### Production Deployment (Backoffice)

```bash
# Deploy to Vercel Production
./scripts/deploy-backoffice.sh
```

**Warum manuell?** 
Monorepo-Struktur erfordert präzise Deployment-Kontrolle. Das Script stellt sicher, dass nur getestete Changes deployed werden.

**Siehe:** [Deployment Workflow Documentation](./docs/deployment/BACKOFFICE_DEPLOYMENT_WORKFLOW.md)

---

## 📁 **Project Structure**

```
live-your-dreams/
├── 📱 apps/
│   └── backoffice/              # Next.js Backoffice Application (Vercel)
├── 🎨 design-system/            # LYD Design System (Vercel Static)
│   ├── v2/                      # Current Version (Production)
│   ├── components/              # 20+ Production Components
│   └── shared/                  # CSS & Typography System
├── 📚 docs/                     # Complete Documentation
│   ├── design-system/           # Design System Guides
│   ├── deployment/              # Vercel Deployment Guides
│   ├── development/             # Local Development Setup
│   └── architecture/            # System Architecture
└── 📦 packages/                 # Shared Packages & Utilities
```

---

## 🎯 **Core Applications**

### **🏢 Backoffice Application**
> **Next.js-based property management system**

```bash
cd apps/backoffice
npm run dev
# → http://localhost:3000
```

**Features:**
- ✅ Property Management (CRUD + Energy Certificates)
- ✅ Lead Management (Qualification + Timeline)
- ✅ Media Upload (360° + Image Processing)
- ✅ Microsite Generator (Public Property Pages)
- ✅ IS24 Integration (OAuth + Publishing)
- ✅ 2FA Security (QR Code + TOTP)
- ✅ GDPR Compliance (Export + Delete)

### **🎨 Design System**
> **Premium component library for real estate applications**

```bash
cd design-system
npm run dev
# → http://localhost:6006
```

**Live System:** [designsystem.liveyourdreams.online](http://designsystem.liveyourdreams.online)

**Components:**
- ✅ Interactive Configurator
- ✅ Button (Primary, Secondary, Ghost, Icon variants)
- ✅ Input (Search, Currency, Area variants)
- ✅ Card (Property showcase, Glassmorphism)
- ✅ Spinner (Hero UI-inspired, Gradient animations)
- ✅ Toast (Success, Error, Warning notifications)
- ✅ Modal (Create, Edit, Delete workflows)
- ✅ Table (Data display, Sorting, Filtering)
- ✅ Checkbox (Design System compliant)
- ✅ Badge (Status indicators, Multi-variant)
- ✅ Professional Typography System
- ✅ Advanced Animations & Micro-interactions

---

## 📚 **Documentation**

### **🎨 Design System**
- **[Design Strategy](docs/design-system/DESIGN_STRATEGY.md)** - Complete system architecture
- **[Component Library](docs/design-system/LYD_DESIGN_SYSTEM_COMPLETE.md)** - All components overview
- **[Next.js Integration](docs/integration/NEXTJS_INTEGRATION.md)** - Backoffice integration guide

### **🚀 Deployment**
- **[Vercel Complete Guide](docs/deployment/VERCEL_COMPLETE_GUIDE.md)** - Comprehensive deployment guide
- **[Vercel Backoffice Setup](docs/deployment/VERCEL_BACKOFFICE_DEPLOYMENT.md)** - Backoffice-specific setup
- **[Neon Database Setup](docs/deployment/NEON_DATABASE_SETUP.md)** - PostgreSQL configuration
- **[Quick Start Guide](docs/development/QUICK_START_GUIDE.md)** - 10-minute local setup

### **🏗️ Architecture** 
- **[Vercel Architecture](docs/architecture/VERCEL_ARCHITECTURE.md)** - Complete system architecture
- **[System Overview](docs/architecture/ARCHITECTURE.md)** - Technical overview
- **[Database Decisions](docs/architecture/DATABASE_DECISION.md)** - PostgreSQL + Neon setup

### **📚 Development**
- **[Local Development](docs/development/MCP_WORKFLOW.md)** - Development workflow
- **[Design System Docs](docs/design-system/README.md)** - Consolidated DS documentation

### **🆕 Latest Updates**
- **[Spinner Component](https://designsystem.liveyourdreams.online/components/spinner)** - Hero UI-inspired loading animations with LYD gradient
- **[Complete Navigation](https://designsystem.liveyourdreams.online/components/overview)** - Spinner integrated across all 53+ Design System pages
- **[Checkbox Improvements](https://designsystem.liveyourdreams.online/components/checkbox)** - Scale(0.75) for perfect proportions
- **[Toast Notifications](https://designsystem.liveyourdreams.online/components/toast)** - Production-ready success/error messaging

### **🎯 Development Learnings & Best Practices**
- **[Database Sync Epic](docs/CRITICAL_LEARNINGS_DATABASE_SYNC_EPIC.md)** - Complete analysis & solution patterns
- **[Sync Checklist](docs/DATABASE_SYNC_CHECKLIST.md)** - Quick reference for CRUD operations
- **[Best Practices](docs/DATABASE_SYNC_BEST_PRACTICES.md)** - Enterprise-grade implementation patterns
- **[Session Summary](docs/SESSION_SUMMARY_DB_SYNC_EPIC.md)** - Real-world problem solving documentation

---

## 🛠️ **Development**

### **Prerequisites**
- Node.js 18+
- pnpm or npm
- Git

### **Local Development**
```bash
# Clone and setup
git clone https://github.com/christianbernecker/live-your-dreams.git
cd live-your-dreams/apps/backoffice
npm install

# Start backoffice locally
cd apps/backoffice
npm run dev

# Start design system
cd design-system
npm run dev
```

### **Testing**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Design system tests
cd design-system && npm run test
```

---

## 🌐 **Production URLs**

| **Service** | **URL** | **Status** |
|---|---|---|
| **Design System** | [designsystem.liveyourdreams.online](http://designsystem.liveyourdreams.online) | ✅ Production |
| **Backoffice** | [backoffice.liveyourdreams.online](http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com) | ✅ Production |
| **Public API** | [api.liveyourdreams.online](http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com/api) | ✅ Production |

---

## 🏆 **Key Features**

### **💼 Business Logic**
- Complete property management with GEG § 87 compliance
- Advanced lead management with scoring
- Automated microsite generation
- Multi-portal publishing (IS24, etc.)
- Pricing calculator with 15+ modules

### **🔒 Security & Compliance**
- 2FA authentication system
- GDPR-compliant data handling
- Audit logging and monitoring
- Rate limiting and security headers

### **🎨 Design System**
- Premium component library
- Real estate optimized components
- Next.js focused integration
- Interactive configurator
- Professional typography system

---

## 📊 **System Statistics**

- **📦 Components:** 20+ Production-Ready (Button, Input, Card, Spinner, Toast, Modal, Table, Badge, Checkbox, etc.)
- **🎯 Features:** 12 Core Business Features
- **☁️ Infrastructure:** Vercel + Neon PostgreSQL
- **🔒 Security:** 2FA + GDPR + Audit Logging
- **📱 Responsive:** Mobile-First Design
- **♿ Accessibility:** WCAG 2.2 AA Compliant

---

## 🚀 **Quick Actions**

```bash
# Deploy backoffice
cd apps/backoffice
vercel --prod

# Deploy design system
cd design-system/v2  
vercel --prod

# View deployment logs
vercel logs <deployment-url>
```

---

## 📞 **Support**

- **📧 Email:** [support@liveyourdreams.online](mailto:support@liveyourdreams.online)
- **📖 Documentation:** [docs/](docs/)
- **🐛 Issues:** [GitHub Issues](https://github.com/christianbernecker/live-your-dreams/issues)

---

## 📜 **License**

© 2024 Live Your Dreams. All rights reserved.

---

*Built with ❤️ for premium real estate experiences*# Test Auto-Deploy
