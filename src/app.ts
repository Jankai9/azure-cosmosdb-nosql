import { loadCosmosConfig } from "./config";
import { createContainer } from "./cosmosClient";
import { CustomerRepository, type Customer } from "./customerRepository";

export const storeSampleCustomer = async (
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer> => {
  const config = loadCosmosConfig(env);
  const container = createContainer(config);
  const repository = new CustomerRepository(container);

  const customer: Customer = {
    id: "c-001",
    name: "Ada Lovelace",
    email: "ada@example.com",
    loyaltyTier: "gold"
  };

  return repository.create(customer);
};
