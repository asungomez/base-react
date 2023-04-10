import { API, Auth } from "aws-amplify";
import { UsersPage } from "./Users";
import { MemoryRouter, Route, Routes } from "react-router-dom";
describe("Users", () => {
  // it("renders an empty table when the response users are an empty array", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({ Users: [] });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("No rows");
  // });

  // it("renders the user when the response has a valid user", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({
  //     Users: [
  //       {
  //         Username: "abc",
  //         Attributes: [
  //           { Name: "email", Value: "silly@email.com" },
  //           { Name: "name", Value: "Test User" },
  //         ],
  //       },
  //     ],
  //   });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("silly@email.com");
  //   cy.findByText("Test User");
  // });

  // it("filters out invalid users", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({
  //     Users: [
  //       {
  //         email: "invalid@user.com",
  //         name: "This is an invalid user",
  //       },
  //     ],
  //   });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("invalid@user.com").should("not.exist");
  //   cy.findByText("This is an invalid user").should("not.exist");
  // });

  // it("filters out users without email", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({
  //     Users: [
  //       {
  //         Username: "abc",
  //         Attributes: [{ Name: "name", Value: "Test User" }],
  //       },
  //     ],
  //   });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("Test user").should("not.exist");
  // });

  // it("filters out users without username", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({
  //     Users: [
  //       {
  //         Attributes: [
  //           { Name: "email", Value: "silly@email.com" },
  //           { Name: "name", Value: "Test User" },
  //         ],
  //       },
  //     ],
  //   });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("silly@email.com").should("not.exist");
  //   cy.findByText("Test user").should("not.exist");
  // });

  // it("renders users without name", () => {
  //   cy.stub(Auth, "currentSession").resolves({
  //     getAccessToken: () => ({
  //       getJwtToken: () => "token",
  //     }),
  //   });
  //   cy.stub(API, "get").resolves({
  //     Users: [
  //       {
  //         Username: "abc",
  //         Attributes: [{ Name: "email", Value: "silly@email.com" }],
  //       },
  //     ],
  //   });
  //   cy.mount(
  //     <MemoryRouter initialEntries={["/users"]}>
  //       <Routes>
  //         <Route path="/users" element={<UsersPage />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );
  //   cy.findByText("silly@email.com");
  // });

  it("shows an error when the API response is not successful", () => {
    cy.stub(Auth, "currentSession").resolves({
      getAccessToken: () => ({
        getJwtToken: () => "token",
      }),
    });
    cy.stub(API, "get").rejects();
    cy.mount(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    );
    cy.findByText("Internal error");
  });
});
