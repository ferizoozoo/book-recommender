import { useLocalStorage } from "@/hooks/use-local-storage";
import config from "../../config";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
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
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", null);
  const [refreshToken, setRefreshToken] = useLocalStorage("refreshToken", null);

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      setIsAuthenticated(true);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }
      const tokens = await res.json();
      setAccessToken(tokens.token.accessToken);
      setRefreshToken(tokens.token.refreshToken);
      navigate("/");
    } catch (error) {
      setIsAuthenticated(false);
      setAccessToken(null);
      setRefreshToken(null);
      navigate("/login");
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken: accessToken,
        refreshToken: refreshToken,
        login,
        logout,
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
