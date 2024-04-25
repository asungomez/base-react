import { get } from "./api";

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

export const getJobs = async (
  filters: JobFilters,
  nextToken?: string
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  try {
    return {
      jobs: [
        { id: "1", name: "Job 1" },
        { id: "2", name: "Job 2" },
      ],
      nextToken: "nextToken",
    };
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
