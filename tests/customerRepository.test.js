"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerRepository_1 = require("../src/customerRepository");
describe("CustomerRepository", () => {
    it("creates a customer item", async () => {
        const customer = {
            id: "c-100",
            name: "Grace Hopper",
            email: "grace@example.com",
            loyaltyTier: "platinum"
        };
        const createMock = jest.fn().mockResolvedValue({ resource: customer });
        const container = {
            items: {
                create: createMock
            }
        };
        const repository = new customerRepository_1.CustomerRepository(container);
        const stored = await repository.create(customer);
        expect(createMock).toHaveBeenCalledWith(customer);
        expect(stored).toEqual(customer);
    });
});
