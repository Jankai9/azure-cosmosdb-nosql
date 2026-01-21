import { CosmosClient, type Container } from "@azure/cosmos";
import type { CosmosConfig } from "./config";

export const createContainer = (config: CosmosConfig): Container => {
  const client = new CosmosClient({
    endpoint: config.endpoint,
    key: config.key
  });

  return client.database(config.databaseId).container(config.containerId);
};
