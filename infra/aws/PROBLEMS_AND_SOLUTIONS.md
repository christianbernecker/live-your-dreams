# AWS Deployment Problems & Solutions

## Übersicht
Dokumentation aller kritischen Probleme beim initialen AWS Setup von Live Your Dreams und deren Lösungen für zukünftige Deployments.

---

## 🔥 Kritische Probleme & Lösungen

### 1. **App Runner Service Failures**
**Problem:** 5+ App Runner Services schlugen fehl trotz funktionierender Docker Images
```
CREATE_FAILED - Health check failures
Service bleibt in OPERATION_IN_PROGRESS
```

**Root Cause:** 
- `NEXTAUTH_URL` Placeholders (`"TBD"`, `"https://placeholder.com"`) crashten Next.js beim Start
- Monorepo CSS-Module Imports funktionierten nicht in App Runner Umgebung

**Lösung:**
- **Wechsel zu ECS Fargate** - bewährt und zuverlässig
- Environment Variables korrekt setzen vor Service-Start
- CSS-Imports temporär entfernt für funktionsfähiges Image

---

### 2. **Docker Platform Mismatch**
**Problem:** Container starteten nicht in ECS
```
CannotPullContainerError: image Manifest does not contain descriptor matching platform 'linux/amd64'
```

**Root Cause:** Docker Images auf macOS/ARM64 gebaut, ECS Fargate benötigt linux/amd64

**Lösung:**
```bash
docker build --platform linux/amd64 -f Dockerfile -t app:production .
```
**WICHTIG:** Immer `--platform linux/amd64` für ECS Deployments verwenden!

---

### 3. **ECS Tasks bleiben in PENDING**
**Problem:** Tasks starteten nie, blieben dauerhaft in PENDING
```
Running Count: 0
Task Status: PENDING
Keine Container Logs verfügbar
```

**Root Cause:** Private Subnets ohne NAT Gateway = kein Internet-Zugang für ECR Pull

**Lösung:**
```bash
# ECS Service auf Public Subnets umstellen
aws ecs update-service --network-configuration \
  "awsvpcConfiguration={subnets=[public-subnet-ids],assignPublicIp=ENABLED}"
```
**Alternative:** NAT Gateway (kostet ~$45/Monat)

---

### 4. **Terraform Git Endless Loop**
**Problem:** `git commit` lief endlos bei Terraform-Files
```
Git commit hängt sich auf
.terraform/ Verzeichnis zu groß für Git
```

**Root Cause:** `.terraform/providers/` enthält große Binaries (100MB+)

**Lösung:**
```bash
git reset --hard HEAD~1
git clean -fd
echo ".terraform/" >> .gitignore
git add . && git commit -m "Fix terraform gitignore"
```

---

### 5. **Next.js Standalone Output für Docker**
**Problem:** Docker Image funktionierte nicht in Production
```
Module resolution errors in containerized environment
```

**Lösung:** `next.config.mjs` anpassen:
```javascript
const nextConfig = {
  output: 'standalone', // KRITISCH für Docker!
  experimental: {
    outputFileTracingRoot: new URL('../../', import.meta.url).pathname,
  }
};
```

---

### 6. **Secrets Manager Integration**
**Problem:** Environment Variables nicht verfügbar in ECS Container

**Lösung:** Task Definition mit Secrets:
```json
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:region:account:secret:name:DATABASE_URL::"
    }
  ]
}
```

**WICHTIG:** ECS Execution Role braucht `secretsmanager:GetSecretValue` Permission!

---

## ✅ Erfolgreiche Final-Konfiguration

### ECS Fargate Service
- **Platform:** `linux/amd64` Docker Images
- **Network:** Public Subnets mit `assignPublicIp=ENABLED`
- **Health Check:** `/api/health` mit 30s Interval
- **Resources:** 512 CPU / 1024 Memory
- **Secrets:** Über AWS Secrets Manager

### Load Balancer
- **ALB:** Internet-facing in Public Subnets
- **Target Group:** Port 3000, HTTP Health Check
- **Security:** ALB → ECS Container via Security Groups

### Kosten-Optimierung
- **Public Subnets** statt NAT Gateway (-$45/Monat)
- **ECS Fargate** statt App Runner (zuverlässiger)
- **RDS Free Tier** für 12 Monate

---

## 📚 Lessons Learned

1. **ECS Fargate > App Runner** für komplexe Next.js Monorepos
2. **Docker Platform** immer explizit setzen für Production
3. **Public Subnets** sind OK für Stateless Container
4. **Health Checks** müssen von Anfang an funktionieren
5. **Terraform .gitignore** vor erstem Commit setzen

---

## 🔄 Für nächstes Deployment beachten

1. Docker Build: `--platform linux/amd64`
2. Health Check `/api/health` implementieren
3. Environment Variables über Secrets Manager
4. Public Subnets für Internet-Connectivity
5. `output: 'standalone'` in next.config.mjs

**Deployment-Zeit:** ~20 Minuten (statt mehreren Stunden Debugging!)
