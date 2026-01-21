import type { Container } from "@azure/cosmos";

export interface Customer {
  id: string;
  name: string;
  email: string;
  loyaltyTier?: string;
}

export class CustomerRepository {
  public constructor(private readonly container: Container) {}

  public async create(customer: Customer): Promise<Customer> {
    const result = await this.container.items.create(customer);
    return result.resource as Customer;
  }

  public async getById(id: string): Promise<Customer | null> {
    try {
      const result = await this.container.item(id, id).read<Customer>();
      return (result.resource as Customer | undefined) ?? null;
    } catch (error) {
      const statusCode = (error as { code?: number; statusCode?: number }).statusCode;
      const code = (error as { code?: number }).code;
      if (statusCode === 404 || code === 404) {
        return null;
      }
      throw error;
    }
  }

  public async update(customer: Customer): Promise<Customer> {
    const result = await this.container.item(customer.id, customer.id).replace(customer);
    return result.resource as Customer;
  }

  public async delete(id: string): Promise<void> {
    await this.container.item(id, id).delete();
  }

  public async list(): Promise<Customer[]> {
    const { resources } = await this.container.items
      .query<Customer>("SELECT * FROM c")
      .fetchAll();
    return resources;
  }
}
