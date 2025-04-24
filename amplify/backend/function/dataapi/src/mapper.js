const dayjs = require("dayjs");

const mapAddressIDsFromQuery = (query) => {
  const excludedIds =
    query
      ?.split(",")
      .filter((id) => id.length > 0)
      .map((compositeId) => {
        const [customerId, addressId] = compositeId.split("_");
        return { customerId, addressId };
      }) ?? [];
  return excludedIds;
};

const mapCustomerFromDB = (customer) => ({
  id: customer.PK.S.replace("customer_", ""),
  name: customer.name.S,
  email: customer.email.S,
  type: customer.type.S,
  taxData: customer.taxData ? mapTaxDataFromDB(customer.taxData.M) : undefined,
  externalLinks: customer.externalLinks
    ? customer.externalLinks.L.map((link) => link.S)
    : [],
});

const mapJobFilters = (filters) => ({
  ...filters,
  from: +new Date(filters.from),
  to: +new Date(filters.to),
});

const mapJobFromDB = (job) => {
  const start = dayjs(+job.start.N);
  const end = dayjs(+job.end.N);
  return {
    id: job.PK.S.replace("job_", ""),
    name: job.name.S,
    date: start.format("YYYY-MM-DD"),
    startTime: start.format("HH:mm"),
    endTime: end.format("HH:mm"),
    assignedTo: job.assigned_to.S,
    imageKey: job.image_key?.S,
    price: +job.price.N,
  };
};

const mapJobFromRequestBody = (job, assignedTo) => ({
  ...job,
  start: +new Date(`${job.date} ${job.startTime}`),
  end: +new Date(`${job.date} ${job.endTime}`),
  assignedTo,
});

const mapAddressFromDB = (address) => {
  if (address.SK.S === "address_main") {
    return mapMainAddressFromDB(address);
  }
  return mapSecondaryAddressFromDB(address);
};

const mapMainAddressFromDB = (mainAddress) => ({
  id: "main",
  street: mainAddress.street.S,
  number: mainAddress.number.S,
  city: mainAddress.city.S,
  postcode: mainAddress.postcode.S,
  customerId: mainAddress.PK.S.replace("customer_", ""),
});

const mapSecondaryAddressFromDB = (secondaryAddress) => ({
  id: secondaryAddress.SK.S.replace("address_secondary_", ""),
  street: secondaryAddress.street.S,
  number: secondaryAddress.number.S,
  city: secondaryAddress.city.S,
  postcode: secondaryAddress.postcode.S,
  customerId: secondaryAddress.PK.S.replace("customer_", ""),
});

const mapTaxDataFromDB = (taxData) => ({
  taxId: taxData.taxId.S,
  companyName: taxData.companyName.S,
  companyAddress: taxData.companyAddress.S,
});

module.exports = {
  mapAddressIDsFromQuery,
  mapCustomerFromDB,
  mapAddressFromDB,
  mapMainAddressFromDB,
  mapSecondaryAddressFromDB,
  mapTaxDataFromDB,
  mapJobFromDB,
  mapJobFromRequestBody,
  mapJobFilters,
};
