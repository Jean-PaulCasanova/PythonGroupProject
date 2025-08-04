#!/bin/bash

# Emergency deployment fix for Render
echo "Deploying emergency fix to Render..."

# Add all changes
git add .

# Commit with timestamp
git commit -m "Emergency fix: Database migrations and API error handling - $(date)"

# Push to east_onrender branch
git push origin east_onrender

# Trigger redeploy by updating the redeploy trigger
echo "$(date)" > .redeploy_trigger
git add .redeploy_trigger
git commit -m "Trigger redeploy - $(date)"
git push origin east_onrender

echo "Emergency fix deployed to east_onrender branch!"
echo "Render will automatically redeploy from this branch."
echo ""
echo "✅ Database migrations will run automatically during deployment (preDeployCommand)"
echo "✅ Database seeding will run automatically during deployment"
echo ""
echo "Next steps:"
echo "1. Wait for Render to redeploy (usually 2-3 minutes)"
echo "2. Test endpoints:"
echo "   - https://genrebanned.onrender.com/api/products/health"
echo "   - https://genrebanned.onrender.com/api/products/"
echo "3. Monitor deployment logs on Render dashboard for any issues"
