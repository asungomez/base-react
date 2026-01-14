import { FC, useState } from "react";

import { Button, CircularProgress, Typography } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import AddIcon from "@mui/icons-material/Add";
import { useCustomerAddresses } from "../../hooks/customers/address/useCustomerAddresses";
import { CustomerAddressesTable } from "../CustomerAddressesTable/CustomerAddressesTable";
import { CustomerAddressModal } from "../CustomerAddressModal/CustomerAddressModal";

type CustomerAddressesProps = {
  customerId: string;
};

export const CustomerAddresses: FC<CustomerAddressesProps> = ({
  customerId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const { addresses, loading, error, moreToLoad, loadMore, loadingMore } =
    useCustomerAddresses(customerId);

  const openModal = (id?: string) => {
    if (id) {
      setEditingAddressId(id);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAddressId(null);
  };

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Addresses
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error || !addresses) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }
  const editingAddress = editingAddressId
    ? addresses.find((address) => address.id === editingAddressId)
    : undefined;

  const addressType =
    !addresses.length || editingAddressId === "main" ? "main" : "secondary";

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Addresses
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => openModal()}
      >
        Add new
      </Button>
      <CustomerAddressesTable
        addresses={addresses}
        customerId={customerId}
        onEditClick={openModal}
      />
      {moreToLoad && (
        <Button variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </Button>
      )}
      <CustomerAddressModal
        customerId={customerId}
        onClose={closeModal}
        open={modalOpen}
        initialValues={editingAddress}
        addressId={editingAddressId ?? undefined}
        addressType={addressType}
      />
    </>
  );
};
