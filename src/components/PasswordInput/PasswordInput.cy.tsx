import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("hides the password by default", () => {
    cy.mount(<PasswordInput />);
    cy.get('input[type="password"]');
  });

  it("shows the password when clicking the toggle button once", () => {
    cy.mount(<PasswordInput />);
    cy.findByLabelText("show password").click();
    cy.get('input[type="text"]');
  });

  it("shows the password when clicking the button twice", () => {
    cy.mount(<PasswordInput />);
    cy.findByLabelText("show password").click();
    cy.findByLabelText("hide password").click();
    cy.get('input[type="password"]');
  });

  it("calls onChange when typing in the input", () => {
    cy.mount(<PasswordInput onChange={cy.spy().as("changeHandler")} />);
    cy.findByLabelText("Password").type("hola");
    cy.get("@changeHandler").should("be.called");
  });
});
