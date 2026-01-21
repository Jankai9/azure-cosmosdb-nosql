import { createContainer } from "../src/cosmosClient";
import { CosmosClient } from "@azure/cosmos";
import type { CosmosConfig } from "../src/config";

let containerMock: object;
let databaseMock: { container: jest.Mock };
let clientMock: { database: jest.Mock };

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
    const config: CosmosConfig = {
      endpoint: "https://example.documents.azure.com:443/",
      key: "primary-key",
      databaseId: "customer-db",
      containerId: "customers"
    };

    const container = createContainer(config);

    expect(CosmosClient).toHaveBeenCalledWith({
      endpoint: config.endpoint,
      key: config.key
    });
    expect(clientMock.database).toHaveBeenCalledWith(config.databaseId);
    expect(databaseMock.container).toHaveBeenCalledWith(config.containerId);
    expect(container).toBe(containerMock);
  });
});
