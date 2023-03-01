import { API, Auth } from "aws-amplify";

const PATHS = ["/listUsers"] as const;

export const get = async (
  path: typeof PATHS[number],
  queryParams: { [param: string]: string } = {}
) => {
  return API.get("AdminQueries", path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    queryStringParameters: queryParams,
  });
};
