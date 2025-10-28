#!/bin/bash

# Astralx Development Environment Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up Astralx development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Setup husky git hooks
echo "🪝 Setting up git hooks..."
npm run prepare

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=astralx
DB_PASSWORD=astralx123
DB_NAME=astralx_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO (S3-compatible)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_USE_SSL=false
MINIO_BUCKET=astralx-media

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF
  echo "✅ .env file created"
else
  echo "ℹ️  .env file already exists, skipping"
fi

# Start Docker infrastructure
echo "🐳 Starting Docker infrastructure..."
docker-compose up -d

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Wait for Docker services to be ready (check with: docker-compose ps)"
echo "  2. Start the API: npm run start:api"
echo "  3. Start the mobile app: npm run start:mobile"
echo "  4. Access API docs at: http://localhost:3000/api/docs"
echo ""
echo "📚 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Rebuild services: docker-compose up -d --build"
echo ""
