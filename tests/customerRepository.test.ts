import { CustomerRepository, type Customer } from "../src/customerRepository";

describe("CustomerRepository", () => {
  it("creates a customer item", async () => {
    const customer: Customer = {
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

    const repository = new CustomerRepository(container as never);
    const stored = await repository.create(customer);

    expect(createMock).toHaveBeenCalledWith(customer);
    expect(stored).toEqual(customer);
  });
});
