import { FC, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
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
import AddIcon from "@mui/icons-material/Add";
import { useCustomer } from "../../hooks/customers/useCustomer";
import { CustomerExternalLinks } from "../../components/CustomerExternalLinks/CustomerExternalLinks";
import { CustomerAddresses } from "../../components/CustomerAddresses/CustomerAddresses";

const tabNames = [
  "information",
  "taxData",
  "addresses",
  "externalLinks",
] as const;
type TabName = typeof tabNames[number];
const isTabName = (value: unknown): value is TabName =>
  tabNames.includes(value as TabName);
const tabLabels: Record<TabName, string> = {
  information: "Information",
  taxData: "Tax data",
  addresses: "Addresses",
  externalLinks: "External links",
};

type CustomerDetailsParams = {
  customerId: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [currentTab, setCurrentTab] = useState<TabName>(
    isTabName(tab) ? tab : "information"
  );
  const { customerId } = useParams<CustomerDetailsParams>();
  const navigate = useNavigate();
  const { loading, customer, error } = useCustomer(customerId);

  const addTaxDataHandler = () =>
    navigate(`/customers/${customerId}/tax-data/add`);

  const changeTabHandler = (_: React.SyntheticEvent, newValue: TabName) => {
    setCurrentTab(newValue);
    setSearchParams({ tab: newValue });
  };

  if (!customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
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
    return <ErrorMessage code={error} />;
  }
  if (!customer) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
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
        <CustomerSectionTab value="addresses">
          <CustomerAddresses customerId={customer.id} />
        </CustomerSectionTab>
        <CustomerSectionTab value="externalLinks">
          <CustomerExternalLinks
            links={customer.externalLinks}
            customerId={customer.id}
          />
        </CustomerSectionTab>
      </Stack>
    </TabContext>
  );
};
