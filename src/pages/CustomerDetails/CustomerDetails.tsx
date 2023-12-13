import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Customer } from "../../services/customers";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import {
  Button,
  CircularProgress,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCustomers } from "../../context/CustomersContext";
import { CustomerTaxData } from "../../components/CustomerTaxData/CustomerTaxData";
import { CustomerInformation } from "../../components/CustomerInformation/CustomerInformation";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const tabNames = ["information", "taxData", "mainAddress"] as const;
type TabName = typeof tabNames[number];
const tabLabels: Record<TabName, string> = {
  information: "Information",
  taxData: "Tax data",
  mainAddress: "Main address",
};

type CustomerDetailsParams = {
  id: string;
};

type CustomerSectionTabProps = {
  value: TabName;
  children: React.ReactNode;
};

const CustomerSectionTab: FC<CustomerSectionTabProps> = ({
  value,
  children,
}) => {
  return <TabPanel value={value}>{children}</TabPanel>;
};

export const CustomerDetailsPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [currentTab, setCurrentTab] = useState<TabName>("information");
  const { id } = useParams<CustomerDetailsParams>();
  const navigate = useNavigate();
  const { getCustomer } = useCustomers();

  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then((customer) => {
          setCustomer(customer);
          setLoading(false);
        })
        .catch((error) => {
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, []);

  const addTaxDataHandler = () => navigate(`/customers/${id}/tax-data/add`);

  const deleteTaxDataHandler = () => {
    setCustomer((customer) => {
      if (customer) {
        return { ...customer, taxData: undefined };
      }
      return null;
    });
  };

  const addMainAddressHandler = () =>
    navigate(`/customers/${id}/main-address/add`);

  const changeTabHandler = (_: React.SyntheticEvent, newValue: TabName) => {
    setCurrentTab(newValue);
  };

  if (!id) {
    return <Error code="INTERNAL_ERROR" />;
  }
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Customer details page
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error) {
    return <Error code={error} />;
  }
  if (!customer) {
    return <Error code="INTERNAL_ERROR" />;
  }
  return (
    <>
      <TabContext value={currentTab}>
        <Stack direction="row" spacing={2}>
          <TabList orientation="vertical" onChange={changeTabHandler}>
            {tabNames.map((tabName) => (
              <Tab label={tabLabels[tabName]} value={tabName} key={tabName} />
            ))}
          </TabList>
          <CustomerSectionTab value="information">
            <CustomerInformation customer={customer} />
          </CustomerSectionTab>
          <CustomerSectionTab value="taxData">
            {customer.taxData ? (
              <CustomerTaxData
                taxData={customer.taxData}
                customerId={customer.id}
                onDelete={deleteTaxDataHandler}
              />
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTaxDataHandler}
              >
                Add tax data
              </Button>
            )}
          </CustomerSectionTab>
          <CustomerSectionTab value="mainAddress">
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addMainAddressHandler}
            >
              Add main address
            </Button>
          </CustomerSectionTab>
        </Stack>
      </TabContext>
    </>
  );
};
