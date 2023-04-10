import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ResetPasswordPage } from "./ResetPassword";
import { Auth } from "aws-amplify";

describe("ResetPassword", () => {
  it("shows an error when email parameter is not set", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/reset-password?code=123"]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Invalid link");
  });

  it("shows an error when code parameter is not set", () => {
    it("shows an error when email parameter is not set", () => {
      cy.mount(
        <MemoryRouter
          initialEntries={["/reset-password?email=perri@mason.com"]}
        >
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </MemoryRouter>
      );
      cy.contains("Invalid link");
    });
  });

  it("renders the form when both email and code parameters are set", () => {
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Reset your password");
  });

  it("redirects to log in when the operation is successful", () => {
    cy.stub(Auth, "forgotPasswordSubmit").resolves();
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/log-in" element={<div>Log in test</div>} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.findByText("Log in test");
  });

  it("shows an error when the users does not exist", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects({
      code: "UserNotFoundException",
    });
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.findByText("This email is not registered");
  });

  it("shows an error when the password is not valid", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects({
      code: "InvalidPasswordException",
    });
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.findByText("Your password is not valid, please set a different one");
  });

  it("shows an internal error when the response has no error code", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects({});
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.findByText("Internal error");
  });

  it("shows an internal error when the response has an invalid error code", () => {
    cy.stub(Auth, "forgotPasswordSubmit").rejects({
      code: "Something the app doesn't recognize",
    });
    cy.mount(
      <MemoryRouter
        initialEntries={["/reset-password?email=perri@mason.com&code=123"]}
      >
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByLabelText("Password").type("12345678");
    cy.findByText("Change password").click();
    cy.findByText("Internal error");
  });
});
