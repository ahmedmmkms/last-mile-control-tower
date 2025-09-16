# Free PostgreSQL Database Setup Guide

This guide will help you set up a free PostgreSQL database for the Last-Mile Delivery Control Tower project. We'll use Supabase, which offers a generous free tier perfect for development.

## Option 1: Supabase (Recommended Free Option)

### Step 1: Create a Supabase Account
1. Go to https://supabase.com/
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email

### Step 2: Create a New Project
1. After logging in, click "New Project"
2. Choose an organization (or create a new one)
3. Enter project details:
   - Name: `last-mile-control-tower`
   - Database password: Create a strong password and save it
   - Region: Choose the region closest to you
4. Click "Create new project"

### Step 3: Get Connection Details
1. After the project is created, go to the "Settings" tab
2. Click "Database" in the left sidebar
3. Note down these details:
   - Host (e.g., `db.xxxxxx.supabase.co`)
   - Port: `5432`
   - Database name: `postgres`
   - User: `postgres`
   - Password: The password you created

### Step 4: Configure Environment Variables
Create a `.env` file in your project root with these values:

```env
DB_HOST=your-supabase-host.db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-database-password
```

Replace the values with your actual Supabase connection details.

## Option 2: Local PostgreSQL with Docker

### Step 1: Install Docker
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop
2. Install and start Docker

### Step 2: Run PostgreSQL Container
Run this command in your terminal:

```bash
docker run --name lastmile-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lastmile_db -p 5432:5432 -d postgres
```

This creates a PostgreSQL container with:
- Database name: `lastmile_db`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### Step 3: Configure Environment Variables
Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lastmile_db
DB_USER=postgres
DB_PASSWORD=postgres
```

## Option 3: Local PostgreSQL Installation

### Step 1: Install PostgreSQL
1. Download PostgreSQL from https://www.postgresql.org/download/
2. Run the installer and follow the setup wizard
3. During installation, set the password to `postgres`

### Step 2: Create Database
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" and select "Create" > "Database"
3. Name it `lastmile_db`

### Step 3: Configure Environment Variables
Create a `.env` file in your project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lastmile_db
DB_USER=postgres
DB_PASSWORD=postgres
```

## Testing Your Database Connection

### Step 1: Install Dependencies
Run in your project directory:

```bash
npm install
```

### Step 2: Run Connection Test
```bash
node src/database/test-connection.js
```

If successful, you should see "Database connection successful!"

## Running Migrations

Once your database is set up and connected, run the migrations:

```bash
node src/database/migrate.js
```

This will create the necessary tables for drivers, shipments, and routes.

## Troubleshooting

### Connection Issues
1. Verify all environment variables in `.env` are correct
2. Check that your database service is running
3. Ensure your firewall allows connections on port 5432

### Authentication Issues
1. Double-check your database username and password
2. For Supabase, make sure you're using the correct connection string

### Migration Issues
1. Ensure tables don't already exist before running migrations
2. Check that the migration files are in the correct directory

## Next Steps

After setting up your database:
1. Run the migrations to create tables
2. Start implementing the backend models and controllers
3. Begin developing the API endpoints