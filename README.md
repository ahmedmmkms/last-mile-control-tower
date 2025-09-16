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

## Deployment

For detailed instructions on deploying to Vercel, see our [Vercel Deployment Guide](docs/vercel-deployment-guide.md) or the [Step-by-Step Vercel Guide](docs/vercel-step-by-step-guide.md).

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit `http://localhost:3000` to view the API response