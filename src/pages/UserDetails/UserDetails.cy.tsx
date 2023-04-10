import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserDetails } from "./UserDetails";

describe("UserDetails", () => {
  it("renders an internal error when the URL parameter id is not defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/users/:incorrect" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("Internal error");
  });

  it("renders the id when the URL parameter is defined", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/users/1"]}>
        <Routes>
          <Route path="/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
    cy.contains("1");
  });
});
