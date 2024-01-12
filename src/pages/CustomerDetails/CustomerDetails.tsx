import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  Button,
  CircularProgress,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { CustomerTaxData } from "../../components/CustomerTaxData/CustomerTaxData";
import { CustomerInformation } from "../../components/CustomerInformation/CustomerInformation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CustomerMainAddress } from "../../components/CustomerMainAddress/CustomerMainAddress";
import AddIcon from "@mui/icons-material/Add";
import { useCustomer } from "../../hooks/useCustomer";

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
  const [currentTab, setCurrentTab] = useState<TabName>("information");
  const { id } = useParams<CustomerDetailsParams>();
  const navigate = useNavigate();
  const { loading, customer, error } = useCustomer(id);

  const addTaxDataHandler = () => navigate(`/customers/${id}/tax-data/add`);

  const deleteTaxDataHandler = () => {
    // setCustomer((customer) => {
    //   if (customer) {
    //     return { ...customer, taxData: undefined };
    //   }
    //   return null;
    // });
  };

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
          <CustomerMainAddress customerId={customer.id} />
        </CustomerSectionTab>
      </Stack>
    </TabContext>
  );
};
