#!/bin/bash

# JEB Ticketing System - Cloudflare Pages Deployment Script
# This script builds and deploys the project to Cloudflare Pages

echo "🚀 JEB Ticketing System - Cloudflare Deployment"
echo "================================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please login to Cloudflare..."
    wrangler login
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Cloudflare Pages
echo "📤 Deploying to Cloudflare Pages..."
echo "   Project: jeb-ticketing-system"
echo "   Directory: dist/"
echo ""

wrangler pages deploy dist --project-name=jeb-ticketing-system

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your site is live at: https://jeb-ticketing-system.pages.dev"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
