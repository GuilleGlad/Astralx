#!/bin/bash

# Script to generate TypeScript API client from OpenAPI specification
# This script requires the API to be running to fetch the OpenAPI spec

set -e

API_URL="${API_URL:-http://localhost:3000}"
SPEC_URL="$API_URL/api/docs-json"
OUTPUT_DIR="apps/mobile/src/api-client"

echo "🔧 Generating TypeScript API client from OpenAPI spec..."

# Check if API is running
if ! curl -f -s "$SPEC_URL" > /dev/null 2>&1; then
  echo "❌ Error: API is not running or not accessible at $API_URL"
  echo "Please start the API with: npm run start:api"
  exit 1
fi

echo "✅ API is accessible at $API_URL"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Download OpenAPI spec
echo "📥 Downloading OpenAPI specification..."
curl -s "$SPEC_URL" -o /tmp/openapi.json

# Generate TypeScript client
echo "⚙️  Generating TypeScript client..."
npx @openapitools/openapi-generator-cli generate \
  -i /tmp/openapi.json \
  -g typescript-axios \
  -o "$OUTPUT_DIR" \
  --additional-properties=supportsES6=true,npmName=astralx-api-client,npmVersion=1.0.0

echo "✅ TypeScript API client generated at $OUTPUT_DIR"
echo ""
echo "You can now import and use the API client in your mobile app:"
echo "  import { DefaultApi } from './api-client';"
echo ""
