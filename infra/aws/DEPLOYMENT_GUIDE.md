# Live Your Dreams - AWS Deployment Guide

## 🏗️ Architecture Overview

```
Internet → ALB → ECS Fargate Container (Public Subnets)
           ↓
        RDS PostgreSQL (Private Subnets)
        ElastiCache Redis (Private Subnets)
        S3 + CloudFront (Media Storage)
```

---

## 🚀 Current Production Setup

### **Infrastructure Components**
- **Compute:** ECS Fargate (512 CPU / 1024 Memory)
- **Container Registry:** Amazon ECR
- **Load Balancer:** Application Load Balancer (ALB)
- **Database:** RDS PostgreSQL 15.14 (db.t3.micro)
- **Cache:** ElastiCache Redis (cache.t2.micro)
- **Storage:** S3 + CloudFront
- **Secrets:** AWS Secrets Manager
- **Monitoring:** CloudWatch Logs

### **Networking**
- **VPC:** 10.0.0.0/16
- **Public Subnets:** 10.0.100.0/24, 10.0.101.0/24 (eu-central-1a, eu-central-1b)
- **Private Subnets:** 10.0.1.0/24, 10.0.2.0/24 (eu-central-1a, eu-central-1b)
- **Internet Gateway:** Attached to VPC
- **Security Groups:** ALB → ECS (Port 3000), ECS → RDS (Port 5432)

---

## 📦 Container Configuration

### **Current Production Image**
- **Repository:** `835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-backoffice`
- **Tag:** `production`
- **Platform:** `linux/amd64` (KRITISCH!)

### **ECS Task Definition**
```json
{
  "family": "lyd-backoffice-production",
  "cpu": "512",
  "memory": "1024",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "executionRoleArn": "arn:aws:iam::835474150597:role/lyd-ecs-execution-role",
  "taskRoleArn": "arn:aws:iam::835474150597:role/lyd-ecs-task-role"
}
```

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3000
# Via Secrets Manager:
DATABASE_URL=postgresql://postgres:***@lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com:5432/lyd_prod
NEXTAUTH_SECRET=***
NEXTAUTH_URL=http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com
```

---

## 🔄 Deployment Process

### **1. Code Changes**
```bash
# Lokale Entwicklung
cd /Users/christianbernecker/live-your-dreams
npm run dev # Testen lokal

# Build testen
cd apps/backoffice
pnpm build
```

### **2. Docker Image Build**
```bash
# WICHTIG: Immer --platform linux/amd64 für ECS!
docker build --platform linux/amd64 \
  -f apps/backoffice/Dockerfile.apprunner-optimized \
  -t lyd-backoffice:$(date +%Y%m%d-%H%M%S) .

# ECR Login
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com

# Tag & Push
TAG=$(date +%Y%m%d-%H%M%S)
docker tag lyd-backoffice:$TAG \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-backoffice:$TAG

docker push 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-backoffice:$TAG
```

### **3. ECS Service Update**
```bash
# Neue Task Definition registrieren (Image-Tag anpassen)
# Dann Service updaten:
aws ecs update-service \
  --cluster lyd-cluster \
  --service lyd-backoffice \
  --task-definition lyd-backoffice-production:NEW_REVISION \
  --region eu-central-1
```

### **4. Deployment Verification**
```bash
# Service Status prüfen
aws ecs describe-services --cluster lyd-cluster --services lyd-backoffice \
  --query 'services[0].{RunningCount:runningCount,TaskDefinition:taskDefinition}'

# Health Check testen
curl http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com/api/health

# Container Logs prüfen
aws logs get-log-events --log-group-name /ecs/lyd-backoffice \
  --log-stream-name [STREAM_NAME] --limit 50
```

---

## 🗄️ Database Operations

### **Connection Details**
```bash
Host: lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com
Port: 5432
Database: lyd_prod
Username: postgres
Password: [FROM SECRETS MANAGER]
```

### **Migrations**
```bash
# Lokal zu RDS verbinden (IP temporär in Security Group)
cd apps/backoffice
DATABASE_URL="postgresql://postgres:***@lyd-postgres.c3m8am00w3dm.eu-central-1.rds.amazonaws.com:5432/lyd_prod" \
  npx prisma migrate deploy

# Seed Data
DATABASE_URL="..." npx prisma db seed
```

---

## 🔐 Security Configuration

### **IAM Roles**
- **ECS Execution Role:** `lyd-ecs-execution-role`
  - Permissions: ECR Pull, CloudWatch Logs, Secrets Manager Read
- **ECS Task Role:** `lyd-ecs-task-role`
  - Permissions: S3 Access für Media Upload

### **Security Groups**
```bash
# ALB Security Group (sg-04219a3d0a8d000b6)
Inbound: Port 80 from 0.0.0.0/0

# ECS Security Group (sg-07f73fa900f657403)  
Inbound: Port 3000 from ALB Security Group

# RDS Security Group (sg-0f9359bd925d42460)
Inbound: Port 5432 from ECS Security Group
```

### **Secrets Manager**
```bash
Secret: lyd-app-secrets (arn:aws:secretsmanager:eu-central-1:835474150597:secret:lyd-app-secrets-F6YMxs)
Keys: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, AWS_REGION, AWS_S3_BUCKET, NODE_ENV
```

---

## 💰 Cost Optimization

### **Current Monthly Costs (~$28-35)**
- ECS Fargate: ~$15/Monat (512 CPU / 1024 Memory)
- RDS t3.micro: $0/Monat (Free Tier 12 Monate)
- ElastiCache t2.micro: ~$12/Monat
- ALB: ~$8/Monat (Fixed + Data Processing)
- S3 + CloudFront: ~$1-3/Monat
- Secrets Manager: ~$0.50/Monat

### **Cost Savings Implemented**
- ✅ **Public Subnets** statt NAT Gateway (-$45/Monat)
- ✅ **RDS Free Tier** für 12 Monate
- ✅ **ECS Fargate** nur bei Bedarf (Auto-Scaling)

---

## 🚨 Monitoring & Alerts

### **Health Checks**
- **ALB Target Health:** Port 3000, `/api/health`
- **Application Health:** JSON Response mit Status
- **Container Health:** Docker HEALTHCHECK in Dockerfile

### **Logs**
```bash
# Application Logs
aws logs get-log-events --log-group-name /ecs/lyd-backoffice

# ALB Access Logs (wenn aktiviert)
# CloudWatch Metrics für ECS, RDS, ALB
```

---

## ⚠️ Known Issues & Workarounds

### **CSS Module Imports**
**Issue:** Monorepo CSS-Imports funktionieren nicht in Docker
```bash
# Temporär deaktiviert in apps/backoffice/app/layout.tsx
# import '@liveyourdreams/design-tokens/dist/css/tokens.css';
```

### **Database Connection Limits**
**Issue:** RDS t3.micro hat begrenzte Connections
**Workaround:** Connection Pooling in Next.js implementieren

### **Cold Start Performance**
**Issue:** ECS Container Cold Start ~30s
**Workaround:** Health Check Timeout auf 60s gesetzt

---

## 🔮 Future Improvements

### **Short Term**
1. **HTTPS/SSL:** ACM Certificate + ALB HTTPS Listener
2. **Custom Domain:** backoffice.liveyourdreams.online
3. **Auto Scaling:** Based on CPU/Memory metrics
4. **Database Monitoring:** CloudWatch Insights

### **Long Term**
1. **CI/CD Pipeline:** GitHub Actions für automatische Deployments
2. **Multi-Environment:** Staging + Production
3. **Disaster Recovery:** Cross-AZ RDS Multi-AZ
4. **Performance:** CDN für Static Assets

---

## 📞 Support

### **Production URLs**
- **Application:** `http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com`
- **Health Check:** `http://lyd-alb-1418151822.eu-central-1.elb.amazonaws.com/api/health`

### **AWS Resources**
- **Region:** eu-central-1 (Frankfurt)
- **ECS Cluster:** lyd-cluster
- **ECR Repository:** lyd-backoffice

**Bei Problemen:** Prüfe ECS Service Status, Container Logs und ALB Target Health!
