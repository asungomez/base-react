import { FC, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationLayout } from "../components/AuthenticationLayout/AuthenticationLayout";
import { UsersLayout } from "../components/UsersLayout/UsersLayout";
import { CreateUserPage } from "../pages/CreateUser/CreateUser";
import { ForgotPasswordPage } from "../pages/ForgotPassword/ForgotPassword";
import { LogInPage } from "../pages/LogIn/LogIn";
import { ProfilePage } from "../pages/Profile/Profile";
import { ResetPasswordPage } from "../pages/ResetPassword/ResetPassword";
import { SetPasswordPage } from "../pages/SetPassword/SetPassword";
import { UsersPage } from "../pages/Users/Users";
import { CognitoUser } from "amazon-cognito-identity-js";

export const AppRoutes: FC = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const logIn = (user: CognitoUser) => {
    setUser(user);
  };
  return (
    <Routes>
      <Route element={<AuthenticationLayout />}>
        <Route index element={<LogInPage onLogIn={logIn} />} />
        <Route path="log-in" element={<LogInPage onLogIn={logIn} />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route
          path="set-password"
          element={
            user ? (
              <SetPasswordPage user={user} />
            ) : (
              <LogInPage onLogIn={logIn} />
            )
          }
        />
      </Route>

      <Route path="users" element={<UsersLayout />}>
        <Route index element={<UsersPage />} />
        <Route path="create" element={<CreateUserPage />} />
        <Route path="me" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};
