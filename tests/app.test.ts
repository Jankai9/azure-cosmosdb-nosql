import { storeSampleCustomer } from "../src/app";
import { loadCosmosConfig } from "../src/config";
import { createContainer } from "../src/cosmosClient";
import { CustomerRepository } from "../src/customerRepository";

jest.mock("../src/config");
jest.mock("../src/cosmosClient");
jest.mock("../src/customerRepository");

describe("storeSampleCustomer", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("stores the default customer using provided dependencies", async () => {
    const config = {
      endpoint: "https://example.documents.azure.com:443/",
      key: "primary-key",
      databaseId: "customer-db",
      containerId: "customers"
    };

    const createdCustomer = {
      id: "c-001",
      name: "Ada Lovelace",
      email: "ada@example.com",
      loyaltyTier: "gold"
    };

    const loadCosmosConfigMock = loadCosmosConfig as jest.MockedFunction<typeof loadCosmosConfig>;
    const createContainerMock = createContainer as jest.MockedFunction<typeof createContainer>;
    const CustomerRepositoryMock = CustomerRepository as unknown as jest.Mock;
    const containerStub = {} as ReturnType<typeof createContainer>;

    loadCosmosConfigMock.mockReturnValue(config);
    createContainerMock.mockReturnValue(containerStub);
    CustomerRepositoryMock.mockImplementation(() => ({
      create: jest.fn().mockResolvedValue(createdCustomer)
    }));

    const result = await storeSampleCustomer({} as NodeJS.ProcessEnv);

    expect(loadCosmosConfigMock).toHaveBeenCalledWith({});
    expect(createContainerMock).toHaveBeenCalledWith(config);
    expect(CustomerRepository).toHaveBeenCalledWith(containerStub);
    expect(result).toEqual(createdCustomer);
  });

  it("uses process.env when no env is provided", async () => {
    process.env = {
      ...originalEnv,
      COSMOS_ENDPOINT: "https://example.documents.azure.com:443/",
      COSMOS_KEY: "primary-key",
      COSMOS_DATABASE_ID: "customer-db",
      COSMOS_CONTAINER_ID: "customers"
    };

    const config = {
      endpoint: process.env.COSMOS_ENDPOINT as string,
      key: process.env.COSMOS_KEY as string,
      databaseId: process.env.COSMOS_DATABASE_ID as string,
      containerId: process.env.COSMOS_CONTAINER_ID as string
    };

    const loadCosmosConfigMock = loadCosmosConfig as jest.MockedFunction<typeof loadCosmosConfig>;
    const createContainerMock = createContainer as jest.MockedFunction<typeof createContainer>;
    const CustomerRepositoryMock = CustomerRepository as unknown as jest.Mock;
    const containerStub = {} as ReturnType<typeof createContainer>;
    const createdCustomer = {
      id: "c-001",
      name: "Ada Lovelace",
      email: "ada@example.com",
      loyaltyTier: "gold"
    };

    loadCosmosConfigMock.mockReturnValue(config);
    createContainerMock.mockReturnValue(containerStub);
    CustomerRepositoryMock.mockImplementation(() => ({
      create: jest.fn().mockResolvedValue(createdCustomer)
    }));

    const result = await storeSampleCustomer();

    expect(loadCosmosConfigMock).toHaveBeenCalledWith(process.env);
    expect(createContainerMock).toHaveBeenCalledWith(config);
    expect(CustomerRepository).toHaveBeenCalledWith(containerStub);
    expect(result).toEqual(createdCustomer);
  });
});
