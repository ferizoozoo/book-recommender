import LoginForm from "@/components/forms/loginForm";
import { useLocalStorage } from "@/hooks/use-local-storage";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface SignUpData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [_, setLocalStorage] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const handleLogin = async (loginData: LoginData) => {
    const { email, password } = loginData;
    const url = import.meta.env.VITE_API_URL;
    const res = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setLocalStorage(data);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <LoginForm className="w-1/3 m-auto" handlesubmit={handleLogin} />
      {/* Uncomment the following line if you want to add a footer or additional content */}
      {/* <p>This is an open source project</p> */}
    </div>
  );
};

export default Login;
