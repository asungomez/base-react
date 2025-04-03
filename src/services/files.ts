import { Storage } from "aws-amplify";

export const uploadFile = async (file: File, key: string): Promise<string> => {
  const result = await Storage.put(key, file, {
    level: "public",
  });
  return await Storage.get(result.key);
};

export const jobImageUrl = async (jobId: string): Promise<string> => {
  return await Storage.get(`jobs/${jobId}/image.jpg`);
};
