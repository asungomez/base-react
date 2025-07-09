import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";
import { CustomerSecondaryAddress, isCustomerAddress } from "./customers";
import { isResponseError } from "./error";
import { getFileUrl } from "./files";

export type JobAssignation = {
  sub: string;
  name?: string;
  email: string;
  color?: string;
};

export type Job = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedTo?: JobAssignation;
  imageUrl?: string;
  price: number;
  invoiceKey?: string;
};

export type JobResponse = Omit<Job, "imageUrl"> & {
  imageKey?: string;
};

const isJobAssignation = (value: unknown): value is JobAssignation => {
  if (!value || typeof value !== "object") return false;
  const jobAssignation = value as JobAssignation;
  if (
    !jobAssignation.sub ||
    typeof jobAssignation.sub !== "string" ||
    (jobAssignation.name && typeof jobAssignation.name !== "string") ||
    !jobAssignation.email ||
    typeof jobAssignation.email !== "string"
  )
    return false;
  return true;
};

const isJobResponse = (value: unknown): value is JobResponse => {
  if (!value || typeof value !== "object") return false;
  const jobResponse = value as JobResponse;
  if (!jobResponse.id || typeof jobResponse.id !== "string") return false;
  if (!jobResponse.name || typeof jobResponse.name !== "string") return false;
  if (!jobResponse.date || typeof jobResponse.date !== "string") return false;
  if (!jobResponse.startTime || typeof jobResponse.startTime !== "string")
    return false;
  if (!jobResponse.endTime || typeof jobResponse.endTime !== "string")
    return false;
  if (jobResponse.assignedTo && !isJobAssignation(jobResponse.assignedTo))
    return false;
  if (
    jobResponse.imageKey &&
    (typeof jobResponse.imageKey !== "string" ||
      jobResponse.imageKey.length === 0)
  )
    return false;
  if (jobResponse.price === undefined || typeof jobResponse.price !== "number")
    return false;
  return true;
};

export type JobFilters = {
  addressId?: string;
  customerId?: string;
  from?: string;
  to?: string;
};

export type EditJobParameters = Omit<JobFormValues, "imageUrl"> & {
  imageKey?: string;
  invoiceKey?: string;
};

type JobsPaginationArguments = {
  nextToken?: string;
  paginate?: boolean;
};

export const transformFormValues = (formValues: JobFormValues) => {
  return {
    ...formValues,
    date: formValues.date.format("YYYY-MM-DD"),
    startTime: formValues.startTime.format("HH:mm"),
    endTime: formValues.endTime.format("HH:mm"),
  };
};

export const createJob = async (formValues: JobFormValues): Promise<Job> => {
  try {
    const response = await post("/jobs", transformFormValues(formValues));
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await del(`/jobs/${jobId}`);
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const editJob = async (
  jobId: string,
  formValues: EditJobParameters
): Promise<Job> => {
  try {
    const response = await put(
      `/jobs/${jobId}`,
      transformFormValues(formValues)
    );
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    if (response.job.imageKey) {
      const imageUrl = await getFileUrl(response.job.imageKey);
      response.job.imageUrl = imageUrl;
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await get(`/jobs/${jobId}`);
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    if (response.job.imageKey) {
      const imageUrl = await getFileUrl(response.job.imageKey);
      response.job.imageUrl = imageUrl;
    }
    return response.job;
  } catch (error) {
    if (isResponseError(error)) {
      if (error.response.status === 403) {
        throw new Error("UNAUTHORIZED");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJobAddresses = async (
  jobId: string,
  nextToken?: string
): Promise<{ addresses: CustomerSecondaryAddress[]; nextToken?: string }> => {
  try {
    const response = await get(`/jobs/${jobId}/addresses`, { nextToken });
    if (
      !response.addresses ||
      !Array.isArray(response.addresses) ||
      response.addresses.some(
        (element: unknown) => !isCustomerAddress(element)
      ) ||
      (response.nextToken !== undefined &&
        typeof response.nextToken !== "string")
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJobs = async (
  filters: JobFilters,
  order: "asc" | "desc" = "asc",
  { nextToken, paginate }: JobsPaginationArguments = { paginate: true }
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  try {
    const response = await get("/jobs", {
      ...filters,
      nextToken,
      order,
      paginate: paginate === false ? "false" : "true",
    });
    if (
      !response.jobs ||
      !Array.isArray(response.jobs) ||
      response.jobs.some((element: unknown) => !isJobResponse(element)) ||
      (response.nextToken !== undefined &&
        typeof response.nextToken !== "string")
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
