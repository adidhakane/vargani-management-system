# Vargani Management System

A comprehensive receipt management and analysis system built with Next.js, TypeScript, PostgreSQL, and Prisma.

## Features

- **Receipt Entry**: Form-based receipt entry with auto-population from resident data
- **Payment Mode Tracking**: Support for Cash and Online payment methods
- **Data Analysis Dashboard**: Multiple analysis views with filtering (Public Access)
- **Resident Management**: CRUD operations for resident data (Protected)
- **PDF Export**: Generate downloadable reports for all analysis views
- **Role-Based Access Control**: Admin approval system for user access
- **Authentication**: Secure login/signup with NextAuth.js

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with JWT
- **PDF Export**: jsPDF with jsPDF-autotable
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Lucide React icons

## Access Control

- **Public Access**: Analysis Dashboard (anyone can view data)
- **Protected Access**: Receipt Entry & Resident Management (requires approval)
- **Admin Access**: User Management (admin only)

## Deployment to Vercel

### Prerequisites

1. PostgreSQL database (recommend Neon, Supabase, or Railway)
2. Vercel account
3. GitHub repository

### Environment Variables

Set these in your Vercel dashboard:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database_name"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-32-characters-minimum"
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

### Deployment Steps

1. **Set up Database**:
   - Create a PostgreSQL database on your preferred provider
   - Get the connection string

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Run Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Create Admin User**:
   ```bash
   node scripts/create-admin.js
   ```

### Default Admin Credentials

- **Email**: `admin@vargani.com`
- **Password**: `admin123`

**⚠️ Important**: Change the admin password after first login!

## Local Development

1. **Clone and Install**:
   ```bash
   git clone https://github.com/adidhakane/vargani-management-system.git
   cd vargani-management-system
   npm install
   ```

2. **Set up Database**:
   - Install PostgreSQL locally
   - Create database: `vargani_db`
   - Update `.env` file with your database URL

3. **Run Migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Create Admin User**:
   ```bash
   node scripts/create-admin.js
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Database Schema

- **residents**: Building number, flat number, and resident names
- **receipts**: Receipt details with payment mode and foreign keys to residents
- **users**: Authentication and role management
- **accounts/sessions**: NextAuth.js session management

## API Endpoints

- `/api/receipts` - Receipt CRUD operations
- `/api/residents` - Resident CRUD operations
- `/api/users` - User management (admin only)
- `/api/auth/*` - NextAuth.js authentication endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
