"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

// Define the context type
interface UsernameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with an initial value
const UsernameContext = createContext<UsernameContextType | undefined>(
  undefined
);

// Define the provider's props
interface UsernameProviderProps {
  children: ReactNode;
}

// Context provider
export const UsernameProvider: React.FC<UsernameProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>(() => {
    // Initialize the username from localStorage if available
    return localStorage.getItem("userName") || "";
  });

  useEffect(() => {
    // Synchronize username to localStorage whenever it changes
    localStorage.setItem("userName", username);
  }, [username]);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};

// Custom hook to use the context
export const useUsername = (): UsernameContextType => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
