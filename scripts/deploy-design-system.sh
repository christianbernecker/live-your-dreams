#!/bin/bash
# Deploy Design System to Vercel Production
# Usage: ./scripts/deploy-design-system.sh

set -e

echo "🎨 Deploying Design System to Production..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to design-system directory
cd "$(dirname "$0")/../design-system" || exit 1

# Run build test first
echo "📦 Testing build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "🌍 Deploying to Vercel Production..."
  vercel --prod

  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Production URL: https://designsystem.liveyourdreams.online"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Verify deployment works"
    echo "   2. git add -A && git commit -m '...'"
    echo "   3. git push origin main"
  else
    echo "❌ Deployment failed!"
    exit 1
  fi
else
  echo "❌ Build failed! Fix errors before deploying."
  exit 1
fi
