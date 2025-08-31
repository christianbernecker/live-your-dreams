# AWS Deployment für Live Your Dreams

## Kostenübersicht (niedrigerer Traffic)

### Monatliche Kosten bei <10,000 Requests:
```
AWS App Runner (0.25 vCPU, 0.5GB):   $7/Monat
RDS PostgreSQL db.t3.micro:           $0/Monat (12 Monate Free Tier)
ElastiCache Redis t2.micro:          $11/Monat  
S3 Storage (50GB):                    $1/Monat
CloudFront CDN (100GB):               $8/Monat
SES E-Mails (1000/Monat):             $1/Monat
Route 53 Hosted Zone:                $0,50/Monat

TOTAL: ~$28,50/Monat (erstes Jahr)
TOTAL: ~$40,50/Monat (nach Free Tier)
```

**Skalierung bei höherem Traffic:**
- 100,000 Requests/Monat: ~$35-50/Monat
- 1,000,000 Requests/Monat: ~$80-120/Monat

## Voraussetzungen

```bash
# AWS CLI installieren
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# AWS Credentials konfigurieren
aws configure
# AWS Access Key ID: [Dein Key]
# AWS Secret Access Key: [Dein Secret]
# Default region name: eu-central-1
# Default output format: json

# Terraform installieren
brew install terraform

# pnpm installieren (falls nicht vorhanden)
npm install -g pnpm
```

## Schnell-Deployment (5 Minuten)

```bash
# 1. Repository vorbereiten
cd /Users/christianbernecker/live-your-dreams
pnpm install

# 2. AWS Deployment starten
./infra/aws/deploy.sh

# 3. DNS konfigurieren (manuell)
# Point backoffice.liveyourdreams.online -> App Runner URL
```

## Schritt-für-Schritt Deployment

### 1. Infrastruktur mit Terraform

```bash
cd infra/aws/terraform

# Terraform initialisieren
terraform init

# Deployment planen
terraform plan

# Infrastruktur erstellen
terraform apply
```

**Erstellte Ressourcen:**
- **VPC** mit Private Subnets (10.0.0.0/16)
- **RDS PostgreSQL** (db.t3.micro, 20GB)
- **ElastiCache Redis** (cache.t2.micro)
- **S3 Bucket** + CloudFront CDN
- **Security Groups** für Database-Zugriff
- **Secrets Manager** für sichere Credential-Speicherung

### 2. Database Migration

```bash
cd apps/backoffice

# Prisma migrations ausführen
npx prisma migrate deploy

# Test-Daten einrichten
pnpm db:seed
```

### 3. App Runner Service

Das Deployment erfolgt automatisch über:
- **Source:** GitHub Repository
- **Build:** Automatischer Container-Build via Dockerfile
- **Health Checks:** /api/health Endpoint
- **Secrets:** AWS Secrets Manager Integration

### 4. Domain & SSL

```bash
# Route 53 DNS Records
backoffice.liveyourdreams.online -> App Runner Custom Domain
api.liveyourdreams.online -> App Runner Custom Domain

# SSL Certificates werden automatisch bereitgestellt
```

## Environment Variables

Alle Secrets werden sicher in **AWS Secrets Manager** gespeichert:

```json
{
  "DATABASE_URL": "postgresql://postgres:xxx@xxx.rds.amazonaws.com/lyd_prod",
  "REDIS_URL": "redis://xxx.cache.amazonaws.com:6379",
  "NEXTAUTH_SECRET": "32-character-random-string",
  "NEXTAUTH_URL": "https://backoffice.liveyourdreams.online",
  "AWS_ACCESS_KEY_ID": "xxx",
  "AWS_SECRET_ACCESS_KEY": "xxx",
  "AWS_S3_BUCKET": "lyd-media-prod",
  "AWS_REGION": "eu-central-1"
}
```

## Monitoring & Logging

### AWS CloudWatch Integration
```bash
# App Runner Logs automatisch verfügbar
# Metriken: CPU, Memory, Request Count, Response Time

# Custom Alarms einrichten:
aws cloudwatch put-metric-alarm \
  --alarm-name "LYD-HighErrorRate" \
  --alarm-description "High 4xx/5xx error rate" \
  --metric-name "4XXError" \
  --namespace "AWS/AppRunner" \
  --statistic "Sum" \
  --period 300 \
  --threshold 10 \
  --comparison-operator "GreaterThanThreshold"
```

### Health Checks
- **App Runner:** Automatische Health Checks auf `/api/health`
- **RDS:** Connection Pool Monitoring  
- **Redis:** Cache Hit Rate Tracking

## Backup-Strategie

### Automatische Backups
```bash
# RDS: 7-Tage automatische Backups
# Point-in-Time Recovery bis zu 7 Tage

# S3: Versioning aktiviert
# Cross-Region Replication optional
```

### Manuelles Backup
```bash
# Database Dump
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# S3 Sync für Media Files
aws s3 sync s3://lyd-media-prod/ ./media-backup/
```

## Sicherheit

### Network Security
- **VPC:** Isoliertes Netzwerk
- **Security Groups:** Minimale Port-Öffnungen
- **Private Subnets:** Database nicht öffentlich erreichbar

### Application Security
- **Secrets Manager:** Keine Credentials in Code
- **IAM Roles:** Minimale Berechtigungen
- **SSL/TLS:** End-to-End Verschlüsselung
- **WAF:** Web Application Firewall (optional)

### DSGVO Compliance
- **EU-Region:** eu-central-1 (Frankfurt)
- **Data Encryption:** At-rest und in-transit
- **Access Logs:** CloudTrail Audit-Logging
- **Right to Erasure:** Implementiert im Backoffice

## Wartung

### Updates
```bash
# App Runner: Automatische Updates bei Git Push
# RDS: Maintenance Window sonntags 04:00-05:00
# ElastiCache: Automatische Patch-Anwendung
```

### Skalierung
```bash
# App Runner: Automatische Skalierung 0-25 Instanzen
# RDS: Manuelles Scale-Up bei Bedarf
# Redis: Cluster-Mode für >5GB Daten
```

### Kostenkontrolle
```bash
# AWS Budgets einrichten
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "LYD-Monthly-Budget",
    "BudgetLimit": {
      "Amount": "50",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }'
```

## Troubleshooting

### Häufige Probleme

1. **App Runner Build Fehler**
```bash
# Lokales Build testen
docker build -t lyd-backoffice -f apps/backoffice/Dockerfile .
docker run -p 3000:3000 lyd-backoffice
```

2. **Database Connection Issues**
```bash
# Security Group prüfen
aws ec2 describe-security-groups --group-ids sg-xxx

# Connection testen
psql $DATABASE_URL -c "SELECT version();"
```

3. **Redis Connection Issues**
```bash
# ElastiCache Cluster Status
aws elasticache describe-cache-clusters --cache-cluster-id lyd-redis
```

## Support Contacts

- **AWS Support:** https://support.aws.amazon.com/
- **Live Your Dreams Team:** tech@liveyourdreams.online
- **Notfall-Kontakt:** +49 XXX XXXXXXX

---

**Geschätzte Setup-Zeit:** 30-45 Minuten
**Go-Live Zeit:** 1-2 Stunden (inkl. DNS Propagation)
