"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
const config_1 = require("../src/config");
const cosmosClient_1 = require("../src/cosmosClient");
const customerRepository_1 = require("../src/customerRepository");
jest.mock("../src/config");
jest.mock("../src/cosmosClient");
jest.mock("../src/customerRepository");
describe("storeSampleCustomer", () => {
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
        const loadCosmosConfigMock = config_1.loadCosmosConfig;
        const createContainerMock = cosmosClient_1.createContainer;
        const CustomerRepositoryMock = customerRepository_1.CustomerRepository;
        loadCosmosConfigMock.mockReturnValue(config);
        createContainerMock.mockReturnValue({});
        CustomerRepositoryMock.mockImplementation(() => ({
            create: jest.fn().mockResolvedValue(createdCustomer)
        }));
        const result = await (0, app_1.storeSampleCustomer)({});
        expect(loadCosmosConfigMock).toHaveBeenCalledWith({});
        expect(createContainerMock).toHaveBeenCalledWith(config);
        expect(customerRepository_1.CustomerRepository).toHaveBeenCalledWith({});
        expect(result).toEqual(createdCustomer);
    });
});
