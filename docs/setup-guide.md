# Project Setup Guide

This document provides instructions for setting up the Last-Mile Delivery Control Tower project.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI for mobile development

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see .env.example)
4. Run database migrations
5. Start the development server:
   ```bash
   npm start
   ```

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