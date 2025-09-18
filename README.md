# Last-Mile Delivery Control Tower

This project is an MVP for a Last-Mile Delivery Control Tower system that provides real-time tracking and management of delivery operations.

## Features

### Core Features
- **Dispatcher Dashboard** - Visualize active routes and driver status
- **Route Assignment** - Assign shipments to drivers with basic optimization
- **Driver Mobile App** - Basic driver interface for accepting deliveries
- **Live Tracking** - Real-time location updates on the dashboard
- **Proof of Delivery** - Simple OTP-based delivery confirmation
- **Basic Analytics** - Dashboard with delivery metrics

### Sprint 3 Enhancements
- **Cash on Delivery (COD)** - Complete COD tracking and reconciliation functionality
- **SLA Monitoring** - Real-time SLA monitoring dashboard with KPIs
- **Advanced Analytics** - Comprehensive analytics and reporting features
- **Production Ready** - Application prepared for production deployment
- **Enhanced UI/UX** - Refined user interface across all components

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
- [Sprint 1 Plan](docs/sprint-1-plan.md) - ✅ Completed
- [Sprint 1 Progress](docs/sprint-1-summary.md) - ✅ Completed
- [Sprint 2 Plan](docs/sprint-2-plan.md) - ✅ Completed
- [Sprint 2 Progress](docs/sprint-2-summary.md) - ✅ Completed
- [Sprint 3 Plan](docs/sprint-3-plan.md) - ✅ Completed
- [Sprint 3 Progress](docs/sprint-3-summary.md) - ✅ Completed

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

## Testing

Run tests with: `npm test`

For detailed testing information, see our [Testing Guide](docs/testing-guide.md).

## Documentation

- [Project Overview](docs/overview.md)
- [Technical Architecture](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [User Documentation](docs/user-documentation.md)
- [Development Guidelines](docs/development-guidelines.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.