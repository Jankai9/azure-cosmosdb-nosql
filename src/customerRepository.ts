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
}
