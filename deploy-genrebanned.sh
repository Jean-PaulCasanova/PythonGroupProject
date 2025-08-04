#!/bin/bash

# GenreBanned Deployment Script
# This script provides instructions and automation for deploying GenreBanned service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== GenreBanned Deployment Script ===${NC}"
echo -e "${YELLOW}This script will help you deploy the GenreBanned service${NC}"
echo ""

# Check if render CLI is available
if ! command -v render &> /dev/null; then
    echo -e "${RED}Error: Render CLI not found. Please install it first.${NC}"
    echo "Visit: https://render.com/docs/cli"
    exit 1
fi

# Check if user is logged in
echo -e "${BLUE}Checking Render CLI authentication...${NC}"
if ! render whoami &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Render CLI${NC}"
    echo "Please run: render login"
    exit 1
fi

echo -e "${GREEN}✓ Render CLI is available and authenticated${NC}"
echo ""

# Display current services
echo -e "${BLUE}Current services in your workspace:${NC}"
render services -o text
echo ""

# Instructions for manual deployment
echo -e "${YELLOW}=== DEPLOYMENT INSTRUCTIONS ===${NC}"
echo -e "${BLUE}Since Render CLI doesn't support service creation, follow these steps:${NC}"
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' button"
echo "3. Select 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Use these settings:"
echo "   - Name: genrebanned"
echo "   - Branch: east_onrender"
echo "   - Runtime: Docker"
echo "   - Dockerfile Path: ./Dockerfile"
echo "   - Health Check Path: /api/products/health"
echo "   - Plan: Free"
echo "   - Region: Oregon"
echo ""
echo "6. Add these environment variables:"
echo "   - FLASK_APP=app"
echo "   - FLASK_ENV=production"
echo "   - SECRET_KEY=(generate new)"
echo "   - SCHEMA=genrebanned_schema"
echo "   - WTF_CSRF_ENABLED=true"
echo "   - WTF_CSRF_TIME_LIMIT=3600"
echo ""
echo "7. Create a PostgreSQL database:"
echo "   - Name: genrebanned-db"
echo "   - Database Name: genrebanned"
echo "   - User: genrebanned_user"
echo ""
echo "8. Link the database to your web service"
echo ""

# Offer to open dashboard
read -p "Would you like to open the Render dashboard now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Opening Render dashboard...${NC}"
    open "https://dashboard.render.com"
fi

echo ""
echo -e "${GREEN}=== DEPLOYMENT CONFIGURATION FILES READY ===${NC}"
echo "The following files have been prepared for your deployment:"
echo "- render-genrebanned.yaml (Render blueprint configuration)"
echo "- deploy-genrebanned.sh (This deployment script)"
echo ""
echo -e "${BLUE}After creating the service manually, you can monitor it with:${NC}"
echo "render services"
echo "render logs <service-id>"
echo ""
echo -e "${GREEN}Deployment preparation complete!${NC}"