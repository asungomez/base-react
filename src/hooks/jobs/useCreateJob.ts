import useSWRMutation from "swr/mutation";
import { Job, JobFilters, createJob, editJob } from "../../services/jobs";
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
      if (image) {
        const imageKey = `jobs/${job.id}/image.jpg`;
        await uploadFile(image, imageKey);
        job = await editJob(job.id, { ...formValues, imageKey });
      }
      const invoiceKey = `jobs/${job.id}/invoice.pdf`;
      await generateJobInvoice(formValues, invoiceKey);
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
