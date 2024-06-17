import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";
import { CustomerSecondaryAddress, isCustomerAddress } from "./customers";

export type Job = {
  id: string;
  name: string;
};

const isJob = (value: unknown): value is Job => {
  if (!value || typeof value !== "object") return false;
  const job = value as Job;
  if (
    !job.id ||
    typeof job.id !== "string" ||
    !job.name ||
    typeof job.name !== "string"
  )
    return false;
  return true;
};

export type JobFilters = {
  addressId?: string;
};

export const createJob = async (formValues: JobFormValues): Promise<Job> => {
  try {
    const response = await post("/jobs", formValues);
    if (!isJob(response.job)) {
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
  formValues: JobFormValues
): Promise<Job> => {
  try {
    const response = await put(`/jobs/${jobId}`, formValues);
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await get(`/jobs/${jobId}`);
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
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
  nextToken?: string
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  try {
    const response = await get("/jobs", { ...filters, nextToken });
    if (
      !response.jobs ||
      !Array.isArray(response.jobs) ||
      response.jobs.some((element: unknown) => !isJob(element)) ||
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
