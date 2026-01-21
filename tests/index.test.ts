import * as index from "../src/index";

describe("index exports", () => {
  it("exposes the public API", () => {
    expect(typeof index.createCustomer).toBe("function");
    expect(typeof index.getCustomerById).toBe("function");
    expect(typeof index.updateCustomer).toBe("function");
    expect(typeof index.deleteCustomer).toBe("function");
    expect(typeof index.listCustomers).toBe("function");
    expect(typeof index.storeSampleCustomer).toBe("function");
    expect(typeof index.createContainer).toBe("function");
    expect(typeof index.loadCosmosConfig).toBe("function");
    expect(typeof index.CustomerRepository).toBe("function");
  });
});
