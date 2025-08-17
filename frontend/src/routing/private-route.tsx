import { useLocalStorage } from "@/hooks/use-local-storage";
import type React from "react";
import { Navigate } from "react-router";
import type { JSX } from "react/jsx-runtime";

const PrivateRoute = ({
  children,
}: {
  children: JSX.Element;
}): React.ReactElement => {
  //TODO: this isn't very safe, but for now, we consider any truthy value as valid.
  const [value, _] = useLocalStorage("user", null);
  return value ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
