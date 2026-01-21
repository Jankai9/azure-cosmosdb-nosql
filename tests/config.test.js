"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/config");
describe("loadCosmosConfig", () => {
    it("returns config when env is complete", () => {
        const env = {
            COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
            COSMOS_KEY: "primary-key",
            COSMOS_DATABASE_ID: "customer-db",
            COSMOS_CONTAINER_ID: "customers"
        };
        expect((0, config_1.loadCosmosConfig)(env)).toEqual({
            endpoint: env.COSMOS_ENDPOINT,
            key: env.COSMOS_KEY,
            databaseId: env.COSMOS_DATABASE_ID,
            containerId: env.COSMOS_CONTAINER_ID
        });
    });
    it("throws when required env is missing", () => {
        const env = {
            COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
            COSMOS_KEY: "primary-key",
            COSMOS_DATABASE_ID: "customer-db"
        };
        expect(() => (0, config_1.loadCosmosConfig)(env)).toThrow("Missing required environment variable: COSMOS_CONTAINER_ID");
    });
});
