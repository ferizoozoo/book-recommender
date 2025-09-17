import SignupForm from "@/components/forms/auth/signupForm";
import { useLocalStorage } from "@/hooks/use-local-storage";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface SignUpData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [_, setLocalStorage] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const handleRegister = async (signUpData: SignUpData) => {
    const { email, password } = signUpData;
    const url = import.meta.env.VITE_API_URL;

    console.log("Registering user:", email);
    const res = await fetch(`${url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    console.log("Response:", res);
    const data = await res.json();

    if (res.ok) {
      setLocalStorage(data);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <SignupForm className="w-1/3 m-auto" handleregister={handleRegister} />
      {/* Uncomment the following line if you want to add a footer or additional content */}
      {/* <p>This is an open source project</p> */}
    </div>
  );
};

export default Signup;
