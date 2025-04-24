import { JobFormValues } from "../components/JobForm/JobForm";
import ReactPDF from "@react-pdf/renderer";
import { JobInvoice } from "../components/JobInvoice/JobInvoice";
import { uploadFile } from "./files";

export const generateJobInvoice = async (
  _formValues: JobFormValues,
  s3Key: string
) => {
  const pdfStream = await ReactPDF.pdf(<JobInvoice />).toBlob();
  await uploadFile(new File([pdfStream], "invoice.pdf"), s3Key);
};
