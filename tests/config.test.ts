import { loadCosmosConfig } from "../src/config";

describe("loadCosmosConfig", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns config when env is complete", () => {
    const env = {
      COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
      COSMOS_KEY: "primary-key",
      COSMOS_DATABASE_ID: "customer-db",
      COSMOS_CONTAINER_ID: "customers"
    } as NodeJS.ProcessEnv;

    expect(loadCosmosConfig(env)).toEqual({
      endpoint: env.COSMOS_ENDPOINT,
      key: env.COSMOS_KEY,
      databaseId: env.COSMOS_DATABASE_ID,
      containerId: env.COSMOS_CONTAINER_ID
    });
  });

  it("uses process.env when no env is provided", () => {
    process.env = {
      ...originalEnv,
      COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
      COSMOS_KEY: "primary-key",
      COSMOS_DATABASE_ID: "customer-db",
      COSMOS_CONTAINER_ID: "customers"
    };

    expect(loadCosmosConfig()).toEqual({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY,
      databaseId: process.env.COSMOS_DATABASE_ID,
      containerId: process.env.COSMOS_CONTAINER_ID
    });
  });

  it("throws when required env is missing", () => {
    const env = {
      COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
      COSMOS_KEY: "primary-key",
      COSMOS_DATABASE_ID: "customer-db"
    } as NodeJS.ProcessEnv;

    expect(() => loadCosmosConfig(env)).toThrow(
      "Missing required environment variable: COSMOS_CONTAINER_ID"
    );
  });
});
