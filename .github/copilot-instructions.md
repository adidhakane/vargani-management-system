# Copilot Instructions for Vargani Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript project for a Vargani (Collection) Management System that helps manage receipt data and provides analytical insights.

## Technology Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **PDF Export**: jsPDF with jsPDF-autotable
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons, Tailwind CSS

## Key Features
1. **Receipt Entry Module**: Form to input receipt details (Building No, Flat No, Amount, Name, Date/Time)
2. **Data Analysis Dashboard**: Multiple analysis views with filtering capabilities
3. **PDF Export**: Generate downloadable reports for all analysis views
4. **Resident Management**: Pre-loaded flat and resident data management

## Database Schema
- **residents**: Building number, flat number, and resident names
- **receipts**: Receipt details including amount, date/time, and foreign keys to residents

## Coding Guidelines
- Use TypeScript for all components and API routes
- Follow Next.js App Router conventions
- Implement proper error handling and validation
- Use Tailwind CSS for styling with responsive design
- Ensure all forms use React Hook Form with Zod validation
- Use Prisma for all database operations
- Generate high-quality PDF reports for all analysis features

## Development Environment
- Local development with local PostgreSQL
- Production deployment on Vercel with PostgreSQL
- Environment variables for database connections
