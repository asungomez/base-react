import { Auth } from "aws-amplify";
import { LogInPage } from "./LogIn";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const logInWithError = (code: string) => {
  cy.stub(Auth, "signIn").rejects({ code });
  cy.mount(
    <MemoryRouter initialEntries={["/log-in"]}>
      <Routes>
        <Route path="/log-in" element={<LogInPage />} />
      </Routes>
    </MemoryRouter>
  );
  cy.findByLabelText("Email").type("some-email@email.com");
  cy.findByLabelText("Password").type("some-password");
  cy.findByRole("button", { name: "Log in" }).click();
};

describe("Log in", () => {
  it("shows an error message when the user does not exist", () => {
    logInWithError("UserNotFoundException");
    cy.contains("This email is not registered");
  });

  it("when the password is incorrect", () => {
    logInWithError("NotAuthorizedException");
    cy.contains("Your password is incorrect");
  });

  it("when the server is down", () => {
    logInWithError("InternalServerError");
    cy.contains("Internal error");
  });
});
