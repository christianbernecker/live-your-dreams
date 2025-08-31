# Terraform Backend Configuration
terraform {
  backend "s3" {
    bucket         = "lyd-terraform-state-1756671051"
    key            = "live-your-dreams/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "lyd-terraform-locks"
  }
}

# Instructions:
# 1. Complete AWS account setup first
# 2. Create S3 bucket: aws s3 mb s3://lyd-terraform-state-$(date +%s) --region eu-central-1
# 3. Replace bucket name above and uncomment backend configuration
# 4. Run: terraform init -migrate-state
