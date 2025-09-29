# Live Your Dreams - Complete Real Estate Platform

> **Premium Real Estate Platform with Automotive-Grade Design System**

[![Production Status](https://img.shields.io/badge/Status-Production%20Ready-success)](http://designsystem.liveyourdreams.online)
[![Design System](https://img.shields.io/badge/Design%20System-Premium%20Quality-blue)](http://designsystem.liveyourdreams.online)
[![AWS Deployment](https://img.shields.io/badge/AWS-ECS%20Fargate-orange)](https://aws.amazon.com)

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

**🌐 Live Design System:** [designsystem.liveyourdreams.online](http://designsystem.liveyourdreams.online)

---

## 📁 **Project Structure**

```
live-your-dreams/
├── 📱 apps/
│   └── backoffice/              # Next.js Backoffice Application
├── 🎨 design-system/            # LYD Design System
│   ├── src/components/          # Web Components
│   ├── styles/                  # CSS & Typography
│   └── .storybook/             # Storybook Configuration
├── ☁️ deployment/               # AWS Deployment Configuration
│   ├── docker/                  # Docker Images
│   ├── ecs/                     # ECS Task Definitions
│   └── terraform/               # Infrastructure as Code
├── 📚 docs/                     # Complete Documentation
│   ├── design-system/           # Design System Guides
│   ├── aws/                     # AWS Setup & Deployment
│   ├── integration/             # Framework Integration
│   └── architecture/            # System Architecture
├── 🏗️ infra/                    # Infrastructure Configuration
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
- ✅ Button (3 variants, Real Estate actions)
- ✅ Input (Search, Currency, Area variants)
- ✅ Card (Property showcase, Glassmorphism)
- ✅ Professional Typography System
- ✅ Advanced Animations & Micro-interactions

---

## 📚 **Documentation**

### **🎨 Design System**
- **[Design Strategy](docs/design-system/DESIGN_STRATEGY.md)** - Complete system architecture
- **[Component Library](docs/design-system/LYD_DESIGN_SYSTEM_COMPLETE.md)** - All components overview
- **[Next.js Integration](docs/integration/NEXTJS_INTEGRATION.md)** - Backoffice integration guide

### **☁️ AWS Deployment**
- **[Production Deployment](docs/aws/PRODUCTION_DEPLOYMENT.md)** - Complete AWS setup
- **[DNS Configuration](docs/aws/DNS_SETUP_INSTRUCTIONS.md)** - Custom domain setup
- **[Go-Live Checklist](docs/aws/GO-LIVE-CHECKLIST.md)** - Deployment verification

### **🏗️ Infrastructure**
- **[AWS Infrastructure](infra/aws/)** - Terraform configurations
- **[Docker Setup](deployment/docker/)** - Container configurations
- **[ECS Configuration](deployment/ecs/)** - Task definitions

### **🎯 Development Learnings & Best Practices**
- **[Database Sync Epic](docs/CRITICAL_LEARNINGS_DATABASE_SYNC_EPIC.md)** - Complete analysis & solution patterns
- **[Sync Checklist](docs/DATABASE_SYNC_CHECKLIST.md)** - Quick reference for CRUD operations
- **[Best Practices](docs/DATABASE_SYNC_BEST_PRACTICES.md)** - Enterprise-grade implementation patterns
- **[Session Summary](docs/SESSION_SUMMARY_DB_SYNC_EPIC.md)** - Real-world problem solving documentation

---

## 🛠️ **Development**

### **Prerequisites**
- Node.js 18+
- Docker Desktop
- AWS CLI (configured)
- pnpm or npm

### **Local Development**
```bash
# Start all services
docker-compose up -d

# Start backoffice
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

- **📦 Components:** 3 Production-Ready (Button, Input, Card)
- **🎯 Features:** 12 Core Business Features
- **☁️ Infrastructure:** AWS ECS Fargate + RDS + S3
- **🔒 Security:** 2FA + GDPR + Audit Logging
- **📱 Responsive:** Mobile-First Design
- **♿ Accessibility:** WCAG 2.2 AA Compliant

---

## 🚀 **Quick Actions**

```bash
# Deploy design system
cd deployment/docker && docker build -f Dockerfile.designsystem

# Update backoffice
cd apps/backoffice && npm run build && npm run deploy

# View logs
aws logs tail /ecs/lyd-backoffice --follow
aws logs tail /ecs/lyd-design-system --follow
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

*Built with ❤️ for premium real estate experiences*