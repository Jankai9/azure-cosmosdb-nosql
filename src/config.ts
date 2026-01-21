export interface CosmosConfig {
  endpoint: string;
  key: string;
  databaseId: string;
  containerId: string;
}

const requiredEnv = (name: string, env: NodeJS.ProcessEnv): string => {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const loadCosmosConfig = (env: NodeJS.ProcessEnv = process.env): CosmosConfig => ({
  endpoint: requiredEnv("COSMOS_ENDPOINT", env),
  key: requiredEnv("COSMOS_KEY", env),
  databaseId: requiredEnv("COSMOS_DATABASE_ID", env),
  containerId: requiredEnv("COSMOS_CONTAINER_ID", env)
});
