#!/bin/bash

# Live Your Dreams - AWS Deployment Script
set -e

echo "🚀 Live Your Dreams - AWS Deployment"
echo "===================================="

# Configuration
AWS_REGION=${AWS_REGION:-eu-central-1}
PROJECT_NAME="lyd"
ENVIRONMENT="prod"
DOMAIN="liveyourdreams.online"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Install: https://aws.amazon.com/cli/"
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform not found. Install: https://www.terraform.io/"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm not found. Install: npm install -g pnpm"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Run: aws configure"
        exit 1
    fi
    
    log_info "✓ All requirements satisfied"
}

# Build the project
build_project() {
    log_info "Building Live Your Dreams project..."
    
    cd "$(dirname "$0")/../.."
    
    # Install dependencies
    pnpm install --frozen-lockfile
    
    # Build libraries first
    pnpm build:libs
    
    # Build backoffice
    pnpm --filter @liveyourdreams/backoffice build
    
    log_info "✓ Project built successfully"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    log_info "Deploying AWS infrastructure..."
    
    cd "$(dirname "$0")/terraform"
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan \
        -var="aws_region=$AWS_REGION" \
        -var="project_name=$PROJECT_NAME" \
        -var="environment=$ENVIRONMENT" \
        -var="domain_name=$DOMAIN"
    
    # Apply changes
    log_warn "This will create AWS resources that may incur costs."
    read -p "Continue with infrastructure deployment? (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        terraform apply -auto-approve \
            -var="aws_region=$AWS_REGION" \
            -var="project_name=$PROJECT_NAME" \
            -var="environment=$ENVIRONMENT" \
            -var="domain_name=$DOMAIN"
        
        log_info "✓ Infrastructure deployed successfully"
    else
        log_warn "Infrastructure deployment cancelled"
        exit 0
    fi
}

# Get infrastructure outputs
get_infrastructure_outputs() {
    log_info "Getting infrastructure details..."
    
    cd "$(dirname "$0")/terraform"
    
    DATABASE_URL=$(terraform output -raw database_endpoint)
    REDIS_ENDPOINT=$(terraform output -raw redis_endpoint)
    S3_BUCKET=$(terraform output -raw s3_bucket)
    CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain)
    SECRETS_NAME=$(terraform output -raw secrets_manager_secret_name)
    
    log_info "Infrastructure details:"
    echo "  Database: $DATABASE_URL"
    echo "  Redis: $REDIS_ENDPOINT"
    echo "  S3 Bucket: $S3_BUCKET"
    echo "  CloudFront: $CLOUDFRONT_DOMAIN"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    cd "$(dirname "$0")/../../apps/backoffice"
    
    # Get DATABASE_URL from Secrets Manager
    export DATABASE_URL=$(aws secretsmanager get-secret-value \
        --secret-id "$SECRETS_NAME" \
        --query SecretString \
        --output text | jq -r .DATABASE_URL)
    
    # Run Prisma migrations
    npx prisma migrate deploy
    
    # Seed database
    pnpm db:seed
    
    log_info "✓ Database migrations completed"
}

# Create App Runner service
deploy_app_runner() {
    log_info "Deploying App Runner service..."
    
    # App Runner service configuration
    cat > apprunner-service.json <<EOF
{
    "ServiceName": "${PROJECT_NAME}-backoffice",
    "SourceConfiguration": {
        "AutoDeploymentsEnabled": true,
        "CodeRepository": {
            "RepositoryUrl": "https://github.com/yourusername/live-your-dreams",
            "SourceCodeVersion": {
                "Type": "BRANCH",
                "Value": "main"
            },
            "CodeConfiguration": {
                "ConfigurationSource": "REPOSITORY"
            }
        }
    },
    "InstanceConfiguration": {
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB",
        "InstanceRoleArn": "$(terraform output -raw apprunner_role_arn)"
    },
    "HealthCheckConfiguration": {
        "Protocol": "HTTP",
        "Path": "/api/health",
        "Interval": 20,
        "Timeout": 10,
        "HealthyThreshold": 1,
        "UnhealthyThreshold": 5
    }
}
EOF

    # Create App Runner service
    aws apprunner create-service \
        --cli-input-json file://apprunner-service.json \
        --region $AWS_REGION
    
    log_info "✓ App Runner service deployment initiated"
    log_info "Monitor deployment at: https://console.aws.amazon.com/apprunner/"
}

# Main deployment flow
main() {
    log_info "Starting Live Your Dreams AWS deployment..."
    
    check_requirements
    build_project
    deploy_infrastructure
    get_infrastructure_outputs
    run_migrations
    deploy_app_runner
    
    log_info ""
    log_info "🎉 Deployment completed successfully!"
    log_info ""
    log_info "Next steps:"
    echo "1. Configure DNS: Point backoffice.$DOMAIN to App Runner URL"
    echo "2. Set up monitoring and alerts"
    echo "3. Configure backup schedule"
    echo "4. Review security settings"
    log_info ""
    log_info "Estimated monthly cost: ~$28-40 (depending on Free Tier eligibility)"
}

# Run main function
main "$@"
