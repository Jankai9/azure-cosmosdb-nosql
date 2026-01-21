import "dotenv/config";
import { storeSampleCustomer } from "./app";

const run = async (): Promise<void> => {
  const stored = await storeSampleCustomer();
  console.log("Stored customer", stored);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
