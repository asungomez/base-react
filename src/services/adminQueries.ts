import { API, Auth } from "aws-amplify";

const _PATHS = ["/listUsers", "/createUser"] as const;

export const get = async (
  path: typeof _PATHS[number],
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

export const post = async (
  path: typeof _PATHS[number],
  body: { [param: string]: string } = {}
) => {
  return API.post("AdminQueries", path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body,
  });
};
