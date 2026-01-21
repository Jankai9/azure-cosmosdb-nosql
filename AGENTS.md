# Agents Guide

## Purpose
This repository provisions an Azure Cosmos DB NoSQL database and runs both unit and end-to-end tests against it.

## Prerequisites
- Azure CLI (`az`) installed and authenticated.
- Node.js and npm installed.

## Database Setup (Azure)
Use the provided script to create the resource group and Cosmos DB resources:

1. Login to Azure:
   - `az login`
   - `az account show`

2. Create resources and populate `.env`:
   - `bash scripts/azure-setup.sh`

This script creates the resource group `azure-cosmosdb-example`, a Cosmos DB account, database, and container, then writes the required environment variables into `.env`.

## Run End-to-End Tests
The e2e tests use the real Cosmos DB database and clean the container before/after each run.

1. Ensure `.env` contains:
   - `COSMOS_ENDPOINT`
   - `COSMOS_KEY`
   - `COSMOS_DATABASE_ID`
   - `COSMOS_CONTAINER_ID`

2. Run e2e tests:
   - `npm run test:e2e`

## Cleanup
To remove Azure resources:
- `bash scripts/azure-teardown.sh`

## Notes
- Running the setup script creates billable Azure resources.
- The resource group `azure-cosmosdb-example` contains all resources for this app.
