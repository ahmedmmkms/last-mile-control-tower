# GitHub Actions CI/CD Setup

This guide explains how to set up Continuous Integration and Continuous Deployment for the Last-Mile Delivery Control Tower using GitHub Actions.

## Prerequisites

1. A GitHub account
2. A Vercel account (for deployment)
3. The project repository hosted on GitHub

## CI/CD Workflow Files

The project includes three workflow files in `.github/workflows`:

1. `ci.yml` - Runs tests on every push and pull request
2. `cd.yml` - Deploys to Vercel when changes are pushed to main branch
3. `ci-cd.yml` - Combined workflow that runs tests and deploys in sequence

You can choose to use either the separate workflows or the combined one. The combined workflow is recommended.

## Setting Up Secrets

To deploy to Vercel, you need to set up the following secrets in your GitHub repository:

1. Go to your repository settings
2. Click on "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel token (generate at https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

To find your Vercel Organization ID and Project ID:

**For Hobby Accounts:**
1. Log in to your Vercel dashboard
2. Your Organization ID is typically your username (shown in the top right corner)
3. Your Project ID is usually the name of your project in lowercase with spaces replaced by hyphens
4. You can also find both IDs in the URL when viewing your project: `https://vercel.com/[ORG-ID]/[PROJECT-ID]`

**For All Account Types:**
1. Go to your project settings in Vercel
2. The Organization ID is in the "General" tab
3. The Project ID is in the "General" tab of your project settings

## What the Workflows Do

### CI Workflow (`ci.yml`)
- Runs on every push and pull request to the main branch
- Tests the application with multiple Node.js versions (16.x and 18.x)
- Installs dependencies and runs `npm test`

### CD Workflow (`cd.yml`)
- Runs only when changes are pushed to the main branch
- Deploys the application to Vercel using the Vercel Action

### Combined Workflow (`ci-cd.yml`)
- Runs tests first on every push and pull request
- Only deploys to Vercel when changes are pushed to the main branch
- Ensures that only tested code is deployed

## Monitoring Workflows

You can monitor your workflows in the "Actions" tab of your GitHub repository. Each workflow run will show:
- Whether the tests passed or failed
- Deployment status
- Logs for troubleshooting