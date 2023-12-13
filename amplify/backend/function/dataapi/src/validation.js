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

const validateCustomerAddress = (address) => {
  if (
    !address.street ||
    typeof address.street !== "string" ||
    address.street.length === 0
  ) {
    throw new Error("Street is required");
  }
  if (
    !address.city ||
    typeof address.city !== "string" ||
    address.city.length === 0
  ) {
    throw new Error("City is required");
  }
  if (
    !address.number ||
    typeof address.number !== "string" ||
    address.number.length === 0
  ) {
    throw new Error("State is required");
  }
  if (
    !address.postcode ||
    typeof address.postcode !== "string" ||
    address.postcode.length === 0
  ) {
    throw new Error("Zip is required");
  }
};

module.exports = { validateCustomer, validateTaxData, validateCustomerAddress };
