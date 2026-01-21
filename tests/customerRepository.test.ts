import { CustomerRepository, type Customer } from "../src/customerRepository";

describe("CustomerRepository", () => {
  const createCustomer = (): Customer => ({
    id: "c-100",
    name: "Grace Hopper",
    email: "grace@example.com",
    loyaltyTier: "platinum"
  });

  it("creates a customer item", async () => {
    const customer = createCustomer();

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

  it("gets a customer by id", async () => {
    const customer = createCustomer();
    const readMock = jest.fn().mockResolvedValue({ resource: customer });
    const itemMock = jest.fn().mockReturnValue({ read: readMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);
    const stored = await repository.getById(customer.id);

    expect(itemMock).toHaveBeenCalledWith(customer.id, customer.id);
    expect(readMock).toHaveBeenCalled();
    expect(stored).toEqual(customer);
  });

  it("returns null when customer is missing", async () => {
    const readMock = jest.fn().mockResolvedValue({ resource: undefined });
    const itemMock = jest.fn().mockReturnValue({ read: readMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);
    const stored = await repository.getById("missing");

    expect(stored).toBeNull();
  });

  it("returns null when Cosmos returns 404", async () => {
    const readMock = jest.fn().mockRejectedValue({ statusCode: 404 });
    const itemMock = jest.fn().mockReturnValue({ read: readMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);
    const stored = await repository.getById("missing");

    expect(stored).toBeNull();
  });

  it("rethrows non-404 errors", async () => {
    const readMock = jest.fn().mockRejectedValue({ statusCode: 500 });
    const itemMock = jest.fn().mockReturnValue({ read: readMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);

    await expect(repository.getById("boom")).rejects.toEqual({ statusCode: 500 });
  });

  it("updates a customer", async () => {
    const customer = createCustomer();
    const replaceMock = jest.fn().mockResolvedValue({ resource: customer });
    const itemMock = jest.fn().mockReturnValue({ replace: replaceMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);
    const updated = await repository.update(customer);

    expect(itemMock).toHaveBeenCalledWith(customer.id, customer.id);
    expect(replaceMock).toHaveBeenCalledWith(customer);
    expect(updated).toEqual(customer);
  });

  it("deletes a customer", async () => {
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    const itemMock = jest.fn().mockReturnValue({ delete: deleteMock });
    const container = {
      item: itemMock
    };

    const repository = new CustomerRepository(container as never);
    await repository.delete("c-200");

    expect(itemMock).toHaveBeenCalledWith("c-200", "c-200");
    expect(deleteMock).toHaveBeenCalled();
  });

  it("lists customers", async () => {
    const customer = createCustomer();
    const fetchAllMock = jest.fn().mockResolvedValue({ resources: [customer] });
    const queryMock = jest.fn().mockReturnValue({ fetchAll: fetchAllMock });
    const container = {
      items: {
        query: queryMock
      }
    };

    const repository = new CustomerRepository(container as never);
    const results = await repository.list();

    expect(queryMock).toHaveBeenCalledWith("SELECT * FROM c");
    expect(fetchAllMock).toHaveBeenCalled();
    expect(results).toEqual([customer]);
  });
});
