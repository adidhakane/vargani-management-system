#!/bin/bash

# Production Migration Script for Vercel
# Run this after deploying to apply database migrations

echo "🚀 Applying database migrations..."

# Apply migrations to production database
npx prisma migrate deploy

echo "✅ Database migrations applied successfully!"

echo "🔄 Generating Prisma client..."

# Generate Prisma client
npx prisma generate

echo "✅ Prisma client generated successfully!"

echo "🎉 Production database is ready!"
