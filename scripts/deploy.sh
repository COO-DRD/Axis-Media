#!/bin/bash
# Cloudflare Pages Deploy Script
echo "Build complete. Deploying to Cloudflare Pages..."
# Use CF_PAGES_PROJECT_NAME if set (Cloudflare provides this), otherwise use default
PROJECT_NAME="${CF_PAGES_PROJECT_NAME:-drd-digital}"
npx wrangler pages deploy .next --project-name="$PROJECT_NAME" --branch=master --commit-hash="$CF_PAGES_COMMIT_SHA"
