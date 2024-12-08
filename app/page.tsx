"use client";

import { useState, useEffect } from "react";
import CoverButton from "./components/CoverButton";
import UserSettingsPopup from "./components/UserSettingsPopup";
import { UsernameProvider } from "./components/UsernameContext";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          method: "GET",
          credentials: "include", // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          setError(""); // Clear any previous errors
        } else {
          setError("Invalid password");
        }
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen w-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  // If not authenticated, show password input
  if (!isAuthenticated) {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter") {
        handleLogin();
      }
    };

    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 p-6 shadow rounded">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4">
            Enter Passcode
          </h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="password"
            className="border p-2 w-full mb-4 text-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Password"
          />
          <button
            className="bg-yellow-400 text-black px-4 py-2 w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <UsernameProvider>
        <UserSettingsPopup />
        <CoverButton />
      </UsernameProvider>
    </>
  );
};

export default Home;
