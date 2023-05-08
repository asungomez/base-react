import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext, AuthContextData } from "../context/AuthContext";
import { AdminRoute } from "./AdminRoute";

const mountComponent = (isAdmin: boolean) => {
  const value: AuthContextData = {
    user: null,
    authStatus: "authenticated",
    logOut: cy.stub(),
    logIn: cy.stub(),
    isInGroup: cy.stub().returns(isAdmin),
  };
  cy.mount(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Children rendered!</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("AdminRoute", () => {
  it("renders the children if the user is in the Admin group", () => {
    mountComponent(true);
    cy.contains("Children rendered!");
  });

  it("renders an error if the user is not in the Admin group", () => {
    mountComponent(false);
    cy.contains("You're not authorized to perform this action");
  });
});
