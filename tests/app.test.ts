import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  listCustomers,
  storeSampleCustomer,
  updateCustomer
} from "../src/app";
import { loadCosmosConfig } from "../src/config";
import { createContainer } from "../src/cosmosClient";
import { CustomerRepository } from "../src/customerRepository";

jest.mock("../src/config");
jest.mock("../src/cosmosClient");
jest.mock("../src/customerRepository");

beforeEach(() => {
  jest.clearAllMocks();
});

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

describe("CRUD app helpers", () => {
  const config = {
    endpoint: "https://example.documents.azure.com:443/",
    key: "primary-key",
    databaseId: "customer-db",
    containerId: "customers"
  };

  const loadCosmosConfigMock = loadCosmosConfig as jest.MockedFunction<typeof loadCosmosConfig>;
  const createContainerMock = createContainer as jest.MockedFunction<typeof createContainer>;
  const CustomerRepositoryMock = CustomerRepository as unknown as jest.Mock;
  const containerStub = {} as ReturnType<typeof createContainer>;

  beforeEach(() => {
    loadCosmosConfigMock.mockReturnValue(config);
    createContainerMock.mockReturnValue(containerStub);
  });

  it("creates a customer", async () => {
    const customer = {
      id: "c-501",
      name: "Mary Jackson",
      email: "mary@example.com"
    };

    CustomerRepositoryMock.mockImplementation(() => ({
      create: jest.fn().mockResolvedValue(customer)
    }));

    const result = await createCustomer(customer, {} as NodeJS.ProcessEnv);

    expect(loadCosmosConfigMock).toHaveBeenCalledWith({});
    expect(createContainerMock).toHaveBeenCalledWith(config);
    expect(CustomerRepository).toHaveBeenCalledWith(containerStub);
    expect(result).toEqual(customer);
  });

  it("gets a customer by id", async () => {
    const customer = {
      id: "c-502",
      name: "Katherine Johnson",
      email: "kj@example.com"
    };

    CustomerRepositoryMock.mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue(customer)
    }));

    const result = await getCustomerById(customer.id, {} as NodeJS.ProcessEnv);

    expect(result).toEqual(customer);
  });

  it("updates a customer", async () => {
    const customer = {
      id: "c-503",
      name: "Dorothy Vaughan",
      email: "dv@example.com"
    };

    CustomerRepositoryMock.mockImplementation(() => ({
      update: jest.fn().mockResolvedValue(customer)
    }));

    const result = await updateCustomer(customer, {} as NodeJS.ProcessEnv);

    expect(result).toEqual(customer);
  });

  it("deletes a customer", async () => {
    CustomerRepositoryMock.mockImplementation(() => ({
      delete: jest.fn().mockResolvedValue(undefined)
    }));

    await deleteCustomer("c-504", {} as NodeJS.ProcessEnv);

    expect(CustomerRepository).toHaveBeenCalledWith(containerStub);
  });

  it("lists customers", async () => {
    const customers = [
      {
        id: "c-505",
        name: "Evelyn Boyd Granville",
        email: "ebg@example.com"
      }
    ];

    CustomerRepositoryMock.mockImplementation(() => ({
      list: jest.fn().mockResolvedValue(customers)
    }));

    const result = await listCustomers({} as NodeJS.ProcessEnv);

    expect(result).toEqual(customers);
  });

  it("uses process.env for CRUD helpers when env is omitted", async () => {
    const customer = {
      id: "c-600",
      name: "Annie Easley",
      email: "ae@example.com"
    };

    CustomerRepositoryMock.mockImplementation(() => ({
      create: jest.fn().mockResolvedValue(customer),
      getById: jest.fn().mockResolvedValue(customer),
      update: jest.fn().mockResolvedValue(customer),
      delete: jest.fn().mockResolvedValue(undefined),
      list: jest.fn().mockResolvedValue([customer])
    }));

    await createCustomer(customer);
    await getCustomerById(customer.id);
    await updateCustomer(customer);
    await deleteCustomer(customer.id);
    await listCustomers();

    expect(loadCosmosConfigMock).toHaveBeenCalledWith(process.env);
    expect(createContainerMock).toHaveBeenCalledWith(config);
    expect(CustomerRepository).toHaveBeenCalledWith(containerStub);
  });
});
