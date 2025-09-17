# Last-Mile Delivery Control Tower

This project is an MVP for a Last-Mile Delivery Control Tower system that provides real-time tracking and management of delivery operations.

## Features

- Dispatcher Dashboard for visualizing active routes and driver status
- Route Assignment with basic optimization
- Driver Mobile App for accepting deliveries
- Live Tracking of deliveries
- Proof of Delivery functionality
- Basic Analytics dashboard

## Project Structure

- `src/backend` - Backend API services
- `src/frontend` - Dispatcher Dashboard (React)
- `src/mobile` - Driver Mobile App (React Native/Expo)
- `src/database` - Database schema and migrations
- `src/shared` - Shared code between services
- `docs` - Project documentation
- `tests` - Test files

## Development

This project follows a 3-sprint development approach with CI/CD pipeline for Vercel deployment.

### Sprint Progress

- [Sprint 0 Summary](docs/sprint-0-summary.md) - ✅ Completed
- [Sprint 1 Plan](docs/sprint-1-plan.md) - 🚧 Planned
- [Sprint 1 Progress](docs/sprint-1-summary.md) - ⏳ Not Started

## Database Setup

For detailed instructions on setting up a free PostgreSQL database, see our [Database Setup Guide](docs/database-setup-guide.md).

## Deployment

For detailed instructions on deploying to Vercel, see our [Vercel Deployment Guide](docs/vercel-deployment-guide.md) or the [Step-by-Step Vercel Guide](docs/vercel-step-by-step-guide.md).

For information about setting up GitHub Actions for CI/CD, see our [GitHub Actions Setup Guide](docs/github-actions-setup.md).

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up database (see [Database Setup Guide](docs/database-setup-guide.md))
4. Copy `.env.example` to `.env` and update with your database credentials
5. Run database migrations: `node src/database/migrate.js`
6. (Optional) Run seed script to populate with sample data: `node src/database/seed.js`
7. Start the development server: `npm run dev`
8. In a separate terminal, start the frontend development server: `cd src/frontend && npm run dev`
9. Visit `http://localhost:5173` to view the dashboard