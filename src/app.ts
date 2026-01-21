import { loadCosmosConfig } from "./config";
import { createContainer } from "./cosmosClient";
import { CustomerRepository, type Customer } from "./customerRepository";

const buildRepository = (env: NodeJS.ProcessEnv): CustomerRepository => {
  const config = loadCosmosConfig(env);
  const container = createContainer(config);
  return new CustomerRepository(container);
};

export const createCustomer = async (
  customer: Customer,
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer> => {
  const repository = buildRepository(env);
  return repository.create(customer);
};

export const getCustomerById = async (
  id: string,
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer | null> => {
  const repository = buildRepository(env);
  return repository.getById(id);
};

export const updateCustomer = async (
  customer: Customer,
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer> => {
  const repository = buildRepository(env);
  return repository.update(customer);
};

export const deleteCustomer = async (
  id: string,
  env: NodeJS.ProcessEnv = process.env
): Promise<void> => {
  const repository = buildRepository(env);
  await repository.delete(id);
};

export const listCustomers = async (
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer[]> => {
  const repository = buildRepository(env);
  return repository.list();
};

export const storeSampleCustomer = async (
  env: NodeJS.ProcessEnv = process.env
): Promise<Customer> => {
  const customer: Customer = {
    id: "c-001",
    name: "Ada Lovelace",
    email: "ada@example.com",
    loyaltyTier: "gold"
  };

  return createCustomer(customer, env);
};
