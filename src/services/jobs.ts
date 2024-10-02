import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";
import { CustomerSecondaryAddress, isCustomerAddress } from "./customers";
import { isResponseError } from "./error";

export type JobAssignation = {
  sub: string;
  name?: string;
  email: string;
};

export type Job = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedTo?: JobAssignation;
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

const isJob = (value: unknown): value is Job => {
  if (!value || typeof value !== "object") return false;
  const job = value as Job;
  if (
    !job.id ||
    typeof job.id !== "string" ||
    !job.name ||
    typeof job.name !== "string" ||
    !job.date ||
    typeof job.date !== "string" ||
    !job.startTime ||
    typeof job.startTime !== "string" ||
    !job.endTime ||
    typeof job.endTime !== "string" ||
    (job.assignedTo && !isJobAssignation(job.assignedTo))
  )
    return false;
  return true;
};

export type JobFilters = {
  addressId?: string;
  customerId?: string;
  from?: string;
  to?: string;
};

type JobsPaginationArguments = {
  nextToken?: string;
  paginate?: boolean;
};

const transformFormValues = (formValues: JobFormValues) => {
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
    const response = await put(
      `/jobs/${jobId}`,
      transformFormValues(formValues)
    );
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
