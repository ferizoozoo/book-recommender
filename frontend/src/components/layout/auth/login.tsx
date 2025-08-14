import LoginForm from "@/components/forms/loginForm";
import React from "react";

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
