#!/bin/bash
# Cloudflare Pages Deploy Script
echo "Build complete. Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next --project-name=drd-digital --branch=master
