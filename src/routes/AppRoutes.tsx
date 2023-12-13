import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationLayout } from "../components/AuthenticationLayout/AuthenticationLayout";
import { DashboardLayout } from "../components/DashboardLayout/DashboardLayout";
import { CreateUserPage } from "../pages/CreateUser/CreateUser";
import { ForgotPasswordPage } from "../pages/ForgotPassword/ForgotPassword";
import { LogInPage } from "../pages/LogIn/LogIn";
import { ProfilePage } from "../pages/Profile/Profile";
import { ResetPasswordPage } from "../pages/ResetPassword/ResetPassword";
import { SetPasswordPage } from "../pages/SetPassword/SetPassword";
import { UsersPage } from "../pages/Users/Users";
import { AdminRoute } from "./AdminRoute";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import { UnauthenticatedRoute } from "./UnauthenticatedRoute";
import { UserDetails } from "../pages/UserDetails/UserDetails";
import { CustomersPage } from "../pages/Customers/Customers";
import { CreateCustomerPage } from "../pages/CreateCustomer/CreateCustomer";
import { CustomerDetailsPage } from "../pages/CustomerDetails/CustomerDetails";
import { EditCustomerPage } from "../pages/EditCustomer/EditCustomer";
import { AddCustomerTaxDataPage } from "../pages/AddCustomerTaxData/AddCustomerTaxData";
import { EditCustomerTaxDataPage } from "../pages/EditCustomerTaxData/EditCustomerTaxData";

export const AppRoutes: FC = () => (
  <Routes>
    <Route
      element={
        <UnauthenticatedRoute>
          <AuthenticationLayout />
        </UnauthenticatedRoute>
      }
    >
      <Route index element={<LogInPage />} />
      <Route path="log-in" element={<LogInPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="set-password" element={<SetPasswordPage />} />
    </Route>

    <Route
      path="users"
      element={
        <AuthenticatedRoute>
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        </AuthenticatedRoute>
      }
    >
      <Route index element={<UsersPage />} />
      <Route path="create" element={<CreateUserPage />} />
      <Route path="me" element={<ProfilePage />} />
      <Route path=":id" element={<UserDetails />} />
    </Route>

    <Route
      path="customers"
      element={
        <AuthenticatedRoute>
          <DashboardLayout />
        </AuthenticatedRoute>
      }
    >
      <Route index element={<CustomersPage />} />
      <Route path=":id">
        <Route index element={<CustomerDetailsPage />} />
        <Route path="edit" element={<EditCustomerPage />} />
        <Route path="tax-data">
          <Route path="add" element={<AddCustomerTaxDataPage />} />
          <Route path="edit" element={<EditCustomerTaxDataPage />} />
        </Route>
      </Route>
      <Route path="create" element={<CreateCustomerPage />} />
    </Route>
  </Routes>
);
