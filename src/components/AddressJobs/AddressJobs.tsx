import { Button, Tab, Typography } from "@mui/material";
import { FC, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { UpcomingAddressJobs } from "../UpcomingAddressJobs/UpcomingAddressJobs";
import { PastAddressJobs } from "../PastAddressJobs/PastAddressJobs";

type AddressJobsProps = {
  addressId: string;
  customerId: string;
};

export const AddressJobs: FC<AddressJobsProps> = ({
  addressId,
  customerId,
}) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const tabChangeHandler = (
    _event: React.ChangeEvent<unknown>,
    newValue: string
  ) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <Link to={`/jobs/create?addressId=${addressId}&customerId=${customerId}`}>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Add new
        </Button>
      </Link>
      <TabContext value={activeTab}>
        <TabList onChange={tabChangeHandler} sx={{ mt: "20px" }}>
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Past" value="past" />
        </TabList>
        <TabPanel value="upcoming">
          <UpcomingAddressJobs addressId={addressId} customerId={customerId} />
        </TabPanel>
        <TabPanel value="past">
          <PastAddressJobs addressId={addressId} customerId={customerId} />
        </TabPanel>
      </TabContext>
    </>
  );
};
