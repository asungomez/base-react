import { JobFormValues } from "../components/JobForm/JobForm";
import ReactPDF from "@react-pdf/renderer";
import { JobInvoice } from "../components/JobInvoice/JobInvoice";
import { uploadFile } from "./files";
import { Job } from "./jobs";
import { CustomerAddress } from "./customers";

export const generateJobInvoice = async (
  _formValues: JobFormValues,
  s3Key: string,
  job: Job,
  addresses: CustomerAddress[]
) => {
  const pdfStream = await ReactPDF.pdf(
    <JobInvoice job={job} addresses={addresses} />
  ).toBlob();
  await uploadFile(new File([pdfStream], "invoice.pdf"), s3Key);
};
