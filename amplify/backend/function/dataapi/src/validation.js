const validateCustomer = (customer) => {
  if (
    !customer.email ||
    typeof customer.email !== "string" ||
    customer.length === 0
  ) {
    throw new Error("Email is required");
  }
};

const validateTaxData = (taxData) => {
  if (
    !taxData.taxId ||
    typeof taxData.taxId !== "string" ||
    taxData.taxId.length === 0
  ) {
    throw new Error("Tax ID is required");
  }
  if (
    !taxData.companyName ||
    typeof taxData.companyName !== "string" ||
    taxData.companyName.length === 0
  ) {
    throw new Error("Company name is required");
  }
  if (
    !taxData.companyAddress ||
    typeof taxData.companyAddress !== "string" ||
    taxData.companyAddress.length === 0
  ) {
    throw new Error("Company address is required");
  }
};

module.exports = { validateCustomer, validateTaxData };
