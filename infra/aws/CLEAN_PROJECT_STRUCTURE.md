# Live Your Dreams - Clean Project Structure

## 📁 Final Directory Structure

```
live-your-dreams/
├── apps/
│   ├── backoffice/                 # Next.js Backoffice App
│   │   ├── Dockerfile.apprunner-optimized  # Production Docker Image
│   │   ├── app/                    # Next.js App Router
│   │   ├── lib/                    # Utilities, Auth, DB
│   │   ├── prisma/                 # Database Schema & Migrations
│   │   └── package.json
│   └── designsystem-docs/          # Storybook Documentation
├── packages/
│   ├── design-tokens/              # Style Dictionary Tokens
│   ├── design-system/              # CSS Modules
│   └── design-system-react/        # React Components
├── infra/
│   ├── aws/
│   │   ├── terraform/              # Infrastructure as Code
│   │   │   ├── main.tf            # AWS Resources
│   │   │   ├── ecs-fargate.tf     # ECS Configuration
│   │   │   └── backend.tf
│   │   ├── PROBLEMS_AND_SOLUTIONS.md  # Troubleshooting Guide
│   │   └── DEPLOYMENT_GUIDE.md    # Deployment Documentation
│   ├── docker/
│   │   └── compose.dev.yml         # Local Development
│   └── nginx/
├── docs/
│   ├── Briefings/                  # Project Requirements
│   ├── CI/exports/                 # Brand Assets
│   └── Credentials/                # AWS Access Keys
├── scripts/
│   ├── check-lyd-brand.sh         # Brand Compliance
│   └── db/init.sql                # Local DB Setup
├── ecs-production-task.json        # Production ECS Task Definition
├── package.json                    # Monorepo Root
├── pnpm-workspace.yaml            # Package Manager Config
├── pnpm-lock.yaml                 # Dependency Lock
└── README.md                      # Project Overview
```

## ✅ Removed Files (Cleanup)

### **App Runner Files (No longer needed)**
- `apprunner-service-*.json` (12 files)
- `apprunner-update-*.json` (2 files)  
- `infra/aws/apprunner-service.json`
- `infra/aws/apprunner.yaml`
- `infra/aws/deploy.sh`

### **Temporary Docker Files**
- `apps/backoffice/Dockerfile` (original)
- `apps/backoffice/Dockerfile.apprunner` (backup)
- `apps/backoffice/Dockerfile.monorepo-fix` (test)

### **Test/Backup Files**
- `ecs-test-task.json`
- `ecs-fresh-task.json`
- `apps/backoffice/app/layout-temp.tsx`
- `apps/backoffice/app/layout-original.tsx`
- `apps/backoffice/app/api/health/route-minimal.ts`
- `apps/backoffice/app/api/health/route-original.ts`

### **Outdated Documentation**
- `docs/AWS-ACCOUNT-SETUP.md`
- `docs/AWS-DEPLOYMENT.md`  
- `docs/INFRASTRUCTURE-STATUS.md`

### **Empty Directories**
- `Backoffice/` (empty directory)

## 🎯 Key Production Files

### **Container & Deployment**
- `apps/backoffice/Dockerfile.apprunner-optimized` - Production Docker Image
- `ecs-production-task.json` - Current ECS Task Definition
- `infra/aws/terraform/` - Complete Infrastructure as Code

### **Application**
- `apps/backoffice/` - Next.js Application
- `packages/` - Design System Components
- `apps/backoffice/prisma/` - Database Schema

### **Documentation**
- `infra/aws/DEPLOYMENT_GUIDE.md` - How to deploy
- `infra/aws/PROBLEMS_AND_SOLUTIONS.md` - Troubleshooting

## 📊 File Count Summary

**Before Cleanup:** 50+ temporary files
**After Cleanup:** ~15 essential files in root
**Removed:** 35+ obsolete/temporary files

## 🧹 Maintenance Rules

### **Keep Repository Clean**
1. **No temp files in root** - Use `/tmp` or subdirectories
2. **One Dockerfile per environment** - Currently: `Dockerfile.apprunner-optimized`
3. **Versioned Task Definitions** - Keep only current production version
4. **Documentation in `/infra/aws/`** - Centralized AWS documentation

### **Before Adding Files**
1. ✅ Is this file needed for production?
2. ✅ Does it belong in a subfolder?
3. ✅ Will it be obsolete soon?
4. ✅ Is there already a similar file?

**Result: Clean, maintainable codebase ready for team collaboration!** 🚀
