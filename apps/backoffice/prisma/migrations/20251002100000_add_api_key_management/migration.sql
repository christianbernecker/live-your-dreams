-- CreateEnum
CREATE TYPE "ApiProvider" AS ENUM ('ANTHROPIC', 'OPENAI');

-- CreateEnum
CREATE TYPE "ApiCallStatus" AS ENUM ('SUCCESS', 'ERROR', 'RATE_LIMITED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "provider" "ApiProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "monthly_limit" DECIMAL(10,2),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage_logs" (
    "id" TEXT NOT NULL,
    "api_key_id" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL DEFAULT 0,
    "output_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "input_cost" DECIMAL(10,6) NOT NULL,
    "output_cost" DECIMAL(10,6) NOT NULL,
    "total_cost" DECIMAL(10,6) NOT NULL,
    "status" "ApiCallStatus" NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "error_message" TEXT,
    "user_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "api_keys_provider_is_active_idx" ON "api_keys"("provider", "is_active");

-- CreateIndex
CREATE INDEX "api_usage_logs_api_key_id_created_at_idx" ON "api_usage_logs"("api_key_id", "created_at");

-- CreateIndex
CREATE INDEX "api_usage_logs_feature_created_at_idx" ON "api_usage_logs"("feature", "created_at");

-- CreateIndex
CREATE INDEX "api_usage_logs_model_created_at_idx" ON "api_usage_logs"("model", "created_at");

-- CreateIndex
CREATE INDEX "api_usage_logs_user_id_idx" ON "api_usage_logs"("user_id");

-- AddForeignKey
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
