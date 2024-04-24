import { FC, useState } from "react";

import { CustomerSecondaryAddressesTable } from "../CustomerSecondaryAddressesTable/CustomerSecondaryAddressesTable";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useCustomerSecondaryAddresses } from "../../hooks/customers/secondary-address/useCustomerSecondaryAddresses";
import { Error } from "../Error/Error";
import { CustomerSecondaryAddressModal } from "../CustomerSecondaryAddressModal/CustomerSecondaryAddressModal";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";

type CustomerSecondaryAddressesProps = {
  customerId: string;
};

export const CustomerSecondaryAddresses: FC<
  CustomerSecondaryAddressesProps
> = ({ customerId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const {
    customerSecondaryAddresses,
    loading,
    error,
    moreToLoad,
    loadMore,
    loadingMore,
  } = useCustomerSecondaryAddresses(customerId);

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
          Secondary addresses
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error || !customerSecondaryAddresses) {
    return <Error code={error ?? "INTERNAL_ERROR"} />;
  }
  const editingAddress = editingAddressId
    ? customerSecondaryAddresses.find(
        (address) => address.id === editingAddressId
      )
    : undefined;
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Secondary addresses
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => openModal()}
      >
        Add new
      </Button>
      <CustomerSecondaryAddressesTable
        addresses={customerSecondaryAddresses}
        customerId={customerId}
        onEditClick={openModal}
      />
      {moreToLoad && (
        <LoadingButton variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </LoadingButton>
      )}
      <CustomerSecondaryAddressModal
        customerId={customerId}
        onClose={closeModal}
        open={modalOpen}
        initialValues={editingAddress}
        addressId={editingAddressId ?? undefined}
      />
    </>
  );
};
