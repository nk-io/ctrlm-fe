"use client";

import { useState, useEffect } from "react";
import { useUsername } from "./UsernameContext";
import Lock from "./Lock.svg";

const CoverButton = () => {
  const [isCoverOpened, setIsCoverOpened] = useState(false);
  const { username } = useUsername(); // Access context

  useEffect(() => {
    const storedCoverState = localStorage.getItem("isCoverOpened");

    // Set cover state only if a username is stored
    if (!username) {
      setIsCoverOpened(false);
    } else if (storedCoverState) {
      setIsCoverOpened(JSON.parse(storedCoverState));
    }
  }, [username]);

  const toggleCover = () => {
    if (!username) {
      return; // Prevent opening if no username
    }

    const newStatus = !isCoverOpened;
    setIsCoverOpened(newStatus);

    // Save the updated state to local storage
    localStorage.setItem("isCoverOpened", JSON.stringify(newStatus));
  };

  const handleButtonClick = async () => {
    if (!username) {
      alert("Set your username before activating.");
      return;
    }

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send notification.");
      }

      const data = await response.json();
      console.info(data.message);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error sending notification. Please try again.");
    }
  };

  return (
    <div className="buttonWrapper animate-fade">
      <div className="warning"></div>

      <div className="base">
        <button id="activate" onClick={handleButtonClick}>
          <span></span>
        </button>
      </div>

      <div
        className={`box ${!username ? "locked" : ""} ${
          isCoverOpened ? "opened" : ""
        }`}
        id="cover"
        onClick={toggleCover}
      >
        <div />
        <div />
        <div>
          {!username && (
            <div className="textLock text-yellow-400 flex flex-col items-center">
              <Lock className="size-10" />
              <span className="mt-2">SET USERNAME</span>
            </div>
          )}
        </div>
        <div />
        <div />
        <div />
        <span />
        <span />
      </div>

      <div className="hinges"></div>

      <div className="text">USE RESPONSIBLY</div>
    </div>
  );
};

export default CoverButton;
