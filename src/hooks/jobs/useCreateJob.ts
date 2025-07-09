import useSWRMutation from "swr/mutation";
import {
  EditJobParameters,
  Job,
  JobFilters,
  createJob,
  editJob,
  getJobAddresses,
} from "../../services/jobs";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useJobs";
import { uploadFile } from "../../services/files";
import { generateJobInvoice } from "../../services/pdf";

export const useCreateJob = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string],
    { formValues: JobFormValues; image: File | null }
  >(
    ["add-job"],
    async ([_operation], { arg: { formValues, image } }) => {
      let job = await createJob(formValues);
      const editParameters: EditJobParameters = { ...formValues };
      if (image) {
        const imageKey = `jobs/${job.id}/image.jpg`;
        await uploadFile(image, imageKey);
        editParameters.imageKey = imageKey;
      }
      const { addresses } = await getJobAddresses(job.id);
      const invoiceKey = `jobs/${job.id}/invoice.pdf`;
      await generateJobInvoice(formValues, invoiceKey, job, addresses);
      editParameters.invoiceKey = invoiceKey;
      job = await editJob(job.id, editParameters);
      // Refresh all caches for job lists
      await mutate<
        readonly [string, JobFilters, string | undefined],
        { jobs: Job[]; nextToken?: string } | null
      >(unstable_serialize(keyFunctionGenerator({})), () => undefined, {
        revalidate: true,
        populateCache: false,
      });
      // Update cache for single job now that we know the id
      await mutate<readonly [string, string], Job>(["job", job.id], () => job, {
        revalidate: false,
        populateCache: true,
      });
      return job;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    createJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
