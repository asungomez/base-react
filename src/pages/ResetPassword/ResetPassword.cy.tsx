import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ResetPasswordPage } from "./ResetPassword";

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
});
