"use client";

import { useState, useEffect } from "react";
import { useUsername } from "./UsernameContext";
import Settings from "./Settings.svg";

const UserSettingsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { username, setUsername } = useUsername(); // Access context
  const [userNameField, setUserNameField] = useState(username);

  useEffect(() => {
    setUserNameField(username);
  }, [username]);

  const handleSave = () => {
    if (!userNameField.trim()) {
      setUserNameField(username);
      return;
    }
    localStorage.setItem("userName", userNameField);
    setUsername(userNameField);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50 float-end">
      <button
        className="text-yellow-400 p-4 rounded shadow transition"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="size-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 text-yellow-400 p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">User Settings</h2>
            <label className="block text-sm mb-2">Username</label>
            <input
              type="text"
              className="border border-gray-600 bg-gray-700 text-yellow-400 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none p-2 w-full mb-4 rounded"
              value={userNameField}
              onChange={(e) => setUserNameField(e.target.value)}
              placeholder="Enter your name"
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-400 transition"
                onClick={() => {
                  setIsOpen(false);
                  setUserNameField(username);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettingsPopup;
