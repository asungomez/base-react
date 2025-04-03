import { Storage } from "aws-amplify";

export const uploadFile = async (file: File): Promise<string> => {
  const result = await Storage.put("uploads/example.jpg", file, {
    level: "public",
  });
  return await Storage.get(result.key);
};

export const jobImageUrl = async (_jobId: string): Promise<string> => {
  return await Storage.get("uploads/example.jpg", {
    level: "public",
  });
};
