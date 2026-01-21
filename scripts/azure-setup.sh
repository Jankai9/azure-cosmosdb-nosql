#!/usr/bin/env bash
set -euo pipefail

RESOURCE_GROUP="azure-cosmosdb-example"
LOCATION="westeurope"
DATABASE_NAME="customer-db"
CONTAINER_NAME="customers"
PARTITION_KEY_PATH="/id"
THROUGHPUT="400"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI (az) is required but not installed." >&2
  exit 1
fi

echo "Creating resource group: $RESOURCE_GROUP"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" >/dev/null

SUFFIX="$(date +%s)"
ACCOUNT_NAME="cosmos-nosql-$SUFFIX"

echo "Creating Cosmos DB account: $ACCOUNT_NAME"
az cosmosdb create \
  --name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --kind GlobalDocumentDB \
  --locations regionName="$LOCATION" failoverPriority=0 \
  --default-consistency-level Session >/dev/null

echo "Creating database: $DATABASE_NAME"
az cosmosdb sql database create \
  --account-name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --name "$DATABASE_NAME" >/dev/null

echo "Creating container: $CONTAINER_NAME"
az cosmosdb sql container create \
  --account-name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --database-name "$DATABASE_NAME" \
  --name "$CONTAINER_NAME" \
  --partition-key-path "$PARTITION_KEY_PATH" \
  --throughput "$THROUGHPUT" >/dev/null

COSMOS_ENDPOINT="$(az cosmosdb show \
  --name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query documentEndpoint -o tsv)"

COSMOS_KEY="$(az cosmosdb keys list \
  --name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query primaryMasterKey -o tsv)"

echo "Writing .env to $ENV_FILE"
cat > "$ENV_FILE" <<EOF
# Cosmos DB NoSQL connection settings
COSMOS_ENDPOINT=$COSMOS_ENDPOINT
COSMOS_KEY=$COSMOS_KEY
COSMOS_DATABASE_ID=$DATABASE_NAME
COSMOS_CONTAINER_ID=$CONTAINER_NAME
EOF

echo "Setup complete. Resource group: $RESOURCE_GROUP"
echo "Cosmos DB account: $ACCOUNT_NAME"
