# Azure Resource Manager (Cosmos DB NoSQL)

## Overview
Provision and manage the Azure resources required for this Cosmos DB NoSQL sample, using `az` CLI or ARM/Bicep templates.

## Required Resources
- Resource group
- Cosmos DB account (NoSQL API)
- Cosmos DB database
- Cosmos DB container (partition key: `/id` or another appropriate key)

## Recommended Parameters
- Resource group: `rg-cosmos-nosql-dev`
- Location: `westeurope`
- Account name: `cosmos-nosql-<unique-suffix>`
- Database: `customer-db`
- Container: `customers`
- Partition key: `/id`
- Throughput: `400`

## CLI Workflow (az)

### 1. Login and select subscription
```bash
az login
az account show
```

### 2. Create resource group
```bash
az group create \
  --name rg-cosmos-nosql-dev \
  --location westeurope
```

### 3. Create Cosmos DB account (NoSQL)
```bash
az cosmosdb create \
  --name cosmos-nosql-<unique-suffix> \
  --resource-group rg-cosmos-nosql-dev \
  --kind GlobalDocumentDB \
  --locations regionName=westeurope failoverPriority=0
```

### 4. Create database
```bash
az cosmosdb sql database create \
  --account-name cosmos-nosql-<unique-suffix> \
  --resource-group rg-cosmos-nosql-dev \
  --name customer-db
```

### 5. Create container
```bash
az cosmosdb sql container create \
  --account-name cosmos-nosql-<unique-suffix> \
  --resource-group rg-cosmos-nosql-dev \
  --database-name customer-db \
  --name customers \
  --partition-key-path /id \
  --throughput 400
```

### 6. Fetch connection settings
```bash
az cosmosdb keys list \
  --name cosmos-nosql-<unique-suffix> \
  --resource-group rg-cosmos-nosql-dev

az cosmosdb show \
  --name cosmos-nosql-<unique-suffix> \
  --resource-group rg-cosmos-nosql-dev \
  --query documentEndpoint -o tsv
```

## Environment Variables for the App
```text
COSMOS_ENDPOINT=<documentEndpoint>
COSMOS_KEY=<primaryKey>
COSMOS_DATABASE_ID=customer-db
COSMOS_CONTAINER_ID=customers
```

## Cleanup
```bash
az group delete --name rg-cosmos-nosql-dev --yes --no-wait
```

## Notes
- Use a globally unique account name.
- Consider a dedicated partition key depending on access patterns.
- Throughput can be autoscale if desired.

## Local Automation Scripts
The repository includes convenience scripts:
- Setup: [scripts/azure-setup.sh](scripts/azure-setup.sh)
- Teardown: [scripts/azure-teardown.sh](scripts/azure-teardown.sh)
