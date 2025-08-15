import SignupForm from "@/components/forms/signupForm";
import React from "react";

export interface SignUpData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const handleRegister = async (signUpData: SignUpData) => {
    const { email, password } = signUpData;
    const url = import.meta.env.VITE_API_URL;
    const res = fetch(`${url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    console.log(data);
  };

  return (
    <div className="flex flex-col justify-between">
      <SignupForm className="w-1/3 m-auto" handlesubmit={handleRegister} />
      {/* Uncomment the following line if you want to add a footer or additional content */}
      {/* <p>This is an open source project</p> */}
    </div>
  );
};

export default Signup;
