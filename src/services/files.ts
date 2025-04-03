import { Storage } from "aws-amplify";

export const uploadFile = async (file: File, key: string): Promise<void> => {
  await Storage.put(key, file, {
    level: "public",
  });
};

export const getFileUrl = async (key: string): Promise<string> => {
  return await Storage.get(key);
};
