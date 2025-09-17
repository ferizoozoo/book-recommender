import LoginForm from "@/components/forms/auth/loginForm";
import React from "react";

export interface SignUpData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  return (
    <div className="flex flex-col justify-between">
      <LoginForm className="w-1/3 m-auto" />
      {/* Uncomment the following line if you want to add a footer or additional content */}
      {/* <p>This is an open source project</p> */}
    </div>
  );
};

export default Login;
