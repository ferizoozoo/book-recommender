import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  //   login: async () => {},
  //   logout: () => {},
} as AuthContextType);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState<any>(null);

  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      setIsAuthenticated(true);
      setUserToken(res);
      navigate("/");
    } catch (error) {
      setIsAuthenticated(false);
      setUserToken(null);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: userToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = AuthContextProvider;
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext;

export function useAuthContext(): AuthContextType {
  return useContext(AuthContext);
}
