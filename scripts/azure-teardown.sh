#!/usr/bin/env bash
set -euo pipefail

RESOURCE_GROUP="azure-cosmosdb-example"

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI (az) is required but not installed." >&2
  exit 1
fi

echo "Deleting resource group: $RESOURCE_GROUP"
az group delete --name "$RESOURCE_GROUP" --yes --no-wait

echo "Teardown initiated. Resources will be removed asynchronously."
