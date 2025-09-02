# GitHub → AWS Deployment Pipeline

## Übersicht

Automatisierte Deployment-Pipeline für das LYD Design System von GitHub zu AWS ECS.

## Workflow

### 1. **GitHub Actions Trigger**
```yaml
on:
  push:
    branches: [main, feature/pds-implementation]
    paths:
      - 'design-system/**'
      - 'deployment/docker/Dockerfile.designsystem'
      - 'deployment/ecs/ecs-designsystem-task.json'
  workflow_dispatch:
```

### 2. **Automatischer Build Prozess**
1. **Checkout Code** von GitHub Repository
2. **AWS Credentials** konfigurieren
3. **ECR Login** für Docker Image Push
4. **Docker Build** mit `--platform linux/amd64` für ECS Fargate
5. **Tag & Push** zu Amazon ECR
6. **ECS Task Definition** aktualisieren
7. **ECS Service** mit Force New Deployment aktualisieren
8. **Deployment Verification** - Service Status prüfen

## Aktuelle Infrastruktur

### **AWS Resources:**
- **ECS Cluster:** `lyd-cluster`
- **ECS Service:** `lyd-design-system`
- **ECR Repository:** `835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system`
- **Target Group:** `lyd-design-system-ip` (IP-Type für Fargate)
- **ALB:** Integration für Custom Domain

### **Container Configuration:**
- **CPU:** 256
- **Memory:** 512 MB
- **Platform:** Fargate
- **Network:** awsvpc mit Public IP
- **Health Check:** `/health` Endpoint

## Manueller Deployment (Fallback)

```bash
# 1. Build & Push
docker build --platform linux/amd64 \
  -f deployment/docker/Dockerfile.designsystem \
  -t lyd-design-system:latest .

docker tag lyd-design-system:latest \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:production

aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  835474150597.dkr.ecr.eu-central-1.amazonaws.com

docker push 835474150597.dkr.ecr.eu-central-1.amazonaws.com/lyd-design-system:production

# 2. ECS Update
aws ecs register-task-definition \
  --cli-input-json file://deployment/ecs/ecs-designsystem-task.json \
  --region eu-central-1

aws ecs update-service \
  --cluster lyd-cluster \
  --service lyd-design-system \
  --task-definition lyd-design-system:LATEST \
  --force-new-deployment \
  --region eu-central-1
```

## Versionierung

### **Git Workflow:**
- **Feature Branch:** `feature/pds-implementation`
- **Main Branch:** Automatisches Deployment zu Production
- **Commit Format:** `feat: Description` für neue Features

### **Docker Tags:**
- **SHA-basiert:** `lyd-design-system:${github.sha}`
- **Production:** `lyd-design-system:production`
- **Clean Structure:** `lyd-design-system:clean-structure`

## Monitoring

### **Health Checks:**
- **Container:** `curl -f http://localhost/health`
- **Service:** AWS ECS Service Status
- **ALB:** Target Group Health

### **Logs:**
- **CloudWatch Group:** `/ecs/lyd-design-system`
- **Region:** `eu-central-1`
- **Stream Prefix:** `ecs`

## Troubleshooting

### **Häufige Probleme:**

1. **Platform Mismatch:**
   ```bash
   # LÖSUNG: Immer --platform linux/amd64 verwenden
   docker build --platform linux/amd64 ...
   ```

2. **ECR Authentication:**
   ```bash
   # LÖSUNG: ECR Login vor Push
   aws ecr get-login-password | docker login ...
   ```

3. **ECS Task Pending:**
   ```bash
   # LÖSUNG: Public Subnets verwenden, Security Group prüfen
   aws ecs describe-tasks --cluster lyd-cluster --tasks TASK_ID
   ```

4. **Nginx Routing:**
   ```bash
   # LÖSUNG: URL Rewrite Rules in Dockerfile
   location ~ ^/components/([^/]+)/?$ {
       try_files /components/$1/index.html =404;
   }
   ```

## URLs & Routing

### **Korrekte URL-Struktur:**
- **Root:** `designsystem.liveyourdreams.online/`
- **Components:** `designsystem.liveyourdreams.online/components/buttons/`
- **Patterns:** `designsystem.liveyourdreams.online/patterns/property-cards/`
- **Styles:** `designsystem.liveyourdreams.online/styles/grid/`

### **Datei-Struktur:**
```
design-system/
├── index.html
├── assets/lyd-designsystem-logo.svg
├── components/
│   ├── introduction/index.html
│   ├── buttons/index.html
│   ├── inputs/index.html
│   └── cards/index.html
├── patterns/
│   ├── introduction/index.html
│   └── property-cards/index.html
└── styles/
    ├── introduction/index.html
    └── grid/index.html
```

## Security

### **GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### **Nginx Security Headers:**
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

## Performance

### **Caching:**
```nginx
location ~* \.(css|js|svg|png|jpg|jpeg|gif|ico)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### **Container Resources:**
- **CPU:** 256 (0.25 vCPU) - Ausreichend für Static Content
- **Memory:** 512 MB - Nginx + Static Files
- **Startup Time:** ~30-60 Sekunden

## Kosten

### **Monatliche Kosten (ca.):**
- **ECS Fargate:** ~$15/Monat (24/7 Betrieb)
- **ALB:** ~$25/Monat (Load Balancer)
- **ECR:** ~$1/Monat (Image Storage)
- **CloudWatch Logs:** ~$2/Monat
- **Gesamt:** ~$43/Monat

**Das Design System ist jetzt vollständig automatisiert und versioniert! 🚀**
