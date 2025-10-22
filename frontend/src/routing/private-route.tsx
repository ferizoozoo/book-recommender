import { useAuthContext } from "@/contexts/auth-context";
import type React from "react";
import { Navigate } from "react-router";
import type { JSX } from "react/jsx-runtime";

const PrivateRoute = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  const { accessToken } = useAuthContext();
  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
