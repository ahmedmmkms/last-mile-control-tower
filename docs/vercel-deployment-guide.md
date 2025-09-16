# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Last-Mile Delivery Control Tower to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. The project repository hosted on GitHub, GitLab, or Bitbucket
3. Environment variables configured in Vercel dashboard

## Deployment Steps

### 1. Connect Repository to Vercel

1. Log in to your Vercel account
2. Click on "New Project"
3. Import your Git repository
4. Configure the project settings:
   - Framework Preset: Other
   - Root Directory: Leave empty (or set to root of project)
   - Build Command: `npm run build` (if applicable)
   - Output Directory: `dist` (if applicable)

### 2. Configure Environment Variables

In the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `DB_HOST`: Your database host
   - `DB_PORT`: Your database port
   - `DB_NAME`: Your database name
   - `DB_USER`: Your database user
   - `DB_PASSWORD`: Your database password
   - `API_BASE_URL`: Your API base URL

### 3. Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will automatically build and deploy your application
3. Once deployment is complete, you'll receive a URL for your application

### 4. Custom Domain (Optional)

1. In your project settings, go to "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Vercel
4. Wait for DNS propagation to complete

## CI/CD Pipeline

Vercel automatically deploys your application whenever you push changes to your main branch. For pull requests, Vercel creates preview deployments that can be accessed via unique URLs.

This project also includes GitHub Actions workflows for CI/CD:
- Automated testing on multiple Node.js versions
- Deployment to Vercel using GitHub Actions

For detailed instructions on setting up GitHub Actions, see our [GitHub Actions Setup Guide](github-actions-setup.md).

**Note for Hobby Accounts:** The GitHub Actions workflows work perfectly with Vercel hobby accounts. You'll just need to find your Organization ID (usually your username) and Project ID (your project name) from the Vercel dashboard.

## Troubleshooting

- If deployment fails, check the build logs in the Vercel dashboard
- Ensure all environment variables are correctly configured
- Verify that your build command and output directory are correctly specified