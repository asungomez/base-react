const validateCustomer = (customer) => {
  if (
    !customer.email ||
    typeof customer.email !== "string" ||
    customer.length === 0
  ) {
    throw new Error("Email is required");
  }
};

module.exports = { validateCustomer };
