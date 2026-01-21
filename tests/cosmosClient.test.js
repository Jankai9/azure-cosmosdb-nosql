"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmosClient_1 = require("../src/cosmosClient");
const cosmos_1 = require("@azure/cosmos");
let containerMock;
let databaseMock;
let clientMock;
jest.mock("@azure/cosmos", () => ({
    CosmosClient: jest.fn().mockImplementation(() => clientMock)
}));
describe("createContainer", () => {
    beforeEach(() => {
        containerMock = { id: "customers" };
        databaseMock = {
            container: jest.fn().mockReturnValue(containerMock)
        };
        clientMock = {
            database: jest.fn().mockReturnValue(databaseMock)
        };
    });
    it("creates a container using the CosmosClient", () => {
        const config = {
            endpoint: "https://example.documents.azure.com:443/",
            key: "primary-key",
            databaseId: "customer-db",
            containerId: "customers"
        };
        const container = (0, cosmosClient_1.createContainer)(config);
        expect(cosmos_1.CosmosClient).toHaveBeenCalledWith({
            endpoint: config.endpoint,
            key: config.key
        });
        expect(clientMock.database).toHaveBeenCalledWith(config.databaseId);
        expect(databaseMock.container).toHaveBeenCalledWith(config.containerId);
        expect(container).toBe(containerMock);
    });
});
