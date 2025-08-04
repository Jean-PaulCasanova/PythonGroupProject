#!/bin/bash
# Emergency deployment script for PythonGroupProject
echo "🚀 Deploying Emergency Migration Fix..."

# Add migration files to git
git add migrations/
git add product_routes_fixed.py
git add deploy_fix.sh

# Commit changes
git commit -m "Emergency fix: Add missing database migrations and robust API error handling"

# Push to render branch
git push origin east_onrender

echo "✅ Deployment initiated!"
echo "📋 Next steps:"
echo "   1. Wait for Render to redeploy"
echo "   2. Run migration in Render shell: flask db upgrade"
echo "   3. Test endpoints: /api/products/ and /health"
echo "   4. Replace your product_routes.py with product_routes_fixed.py"
