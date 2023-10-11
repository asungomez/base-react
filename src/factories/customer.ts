import { Factory } from "fishery";
import { Customer } from "../services/customers";
import { faker } from "@faker-js/faker";

export const customerFactory = Factory.define<Customer>(({ sequence }) => ({
  id: "" + sequence,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  type: "individual",
}));
