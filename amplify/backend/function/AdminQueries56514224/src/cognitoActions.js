/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminRemoveUserFromGroupCommand,
  ListUsersCommand,
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const userPoolId = process.env.USERPOOL;
const client = new CognitoIdentityProviderClient({});

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    const command = new AdminAddUserToGroupCommand(params);
    await client.send(command);
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUserFromGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username} from ${groupname}`);

  try {
    const command = new AdminRemoveUserFromGroupCommand(params);
    await client.send(command);
    console.log(`Removed ${username} from ${groupname}`);
    return {
      message: `Removed ${username} from ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsers(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log("Attempting to list users");

  try {
    const command = new ListUsersCommand(params);
    const result = await client.send(command);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createUser(user) {
  const params = {
    UserAttributes: [
      { Name: "email", Value: user.email },
      { Name: "email_verified", Value: "True" },
    ],
    UserPoolId: userPoolId,
    Username: user.email,
    TemporaryPassword: user.password,
  };

  if (user.color) {
    params.UserAttributes.push({
      Name: "custom:color",
      Value: user.color,
    });
  }
  console.log(`Attempting to create user with email ${user.email}`);

  try {
    const command = new AdminCreateUserCommand(params);
    const result = await client.send(command);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  createUser,
  addUserToGroup,
  removeUserFromGroup,
  listUsers,
};
