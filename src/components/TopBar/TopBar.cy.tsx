import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TopBar } from "./TopBar";
import { AuthContext, AuthContextData } from "../../context/AuthContext";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { CognitoUserWithAttributes } from "../../services/authentication";

const mountWithUser = (userData: { name?: string; email: string }) => {
  const user: CognitoUserWithAttributes = new CognitoUser({
    Username: "test",
    Pool: new CognitoUserPool({
      UserPoolId: "eu-west-1_test",
      ClientId: "test",
    }),
  });
  user.attributes = {
    ...userData,
  };
  const value: AuthContextData = {
    user,
    authStatus: "authenticated",
    logOut: cy.stub().as("logOut").resolves(),
    logIn: cy.stub(),
    isInGroup: cy.stub(),
  };
  cy.mount(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/topbar"]}>
        <Routes>
          <Route path="/topbar" element={<TopBar />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("TopBar", () => {
  it("uses the user name as the avatar text", () => {
    mountWithUser({ name: "Fernando", email: "random@email.com" });
    cy.contains("F");
  });

  it("uses the user email as the avatar text when the name is not available", () => {
    mountWithUser({ email: "some@email.com" });
    cy.contains("S");
  });

  it("calls the logout function when Logout is clicked", () => {
    mountWithUser({ email: "some@email.com" });
    cy.contains("S").click();
    cy.contains("Log out").click();
    cy.get("@logOut").should("be.called");
  });
});
