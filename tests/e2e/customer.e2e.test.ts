import "dotenv/config";
import { CosmosClient, type Container } from "@azure/cosmos";
import { loadCosmosConfig } from "../../src/config";
import { CustomerRepository, type Customer } from "../../src/customerRepository";

describe("Cosmos DB e2e", () => {
  let container: Container;

  const purgeContainer = async (): Promise<void> => {
    const { resources } = await container.items
      .query<{ id: string }>("SELECT c.id FROM c")
      .fetchAll();

    await Promise.all(
      resources.map((item) => container.item(item.id, item.id).delete())
    );
  };

  beforeAll(async () => {
    const config = loadCosmosConfig();
    const client = new CosmosClient({
      endpoint: config.endpoint,
      key: config.key
    });

    container = client.database(config.databaseId).container(config.containerId);
    await purgeContainer();
  });

  afterAll(async () => {
    await purgeContainer();
  });

  it("performs CRUD operations in the real database", async () => {
    const repository = new CustomerRepository(container);
    const customer: Customer = {
      id: `e2e-${Date.now()}`,
      name: "E2E Customer",
      email: "e2e@example.com"
    };

    const stored = await repository.create(customer);
    expect(stored.id).toBe(customer.id);

    const fetched = await repository.getById(customer.id);
    expect(fetched?.email).toBe(customer.email);

    const updated = await repository.update({
      ...customer,
      loyaltyTier: "silver"
    });
    expect(updated.loyaltyTier).toBe("silver");

    const list = await repository.list();
    expect(list.some((item) => item.id === customer.id)).toBe(true);

    await repository.delete(customer.id);
    const missing = await repository.getById(customer.id);
    expect(missing).toBeNull();
  });
});
