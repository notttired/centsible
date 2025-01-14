import React, { useState, useContext, createContext, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styling/app.css";
import App from "./App";
import { usernameContext } from "./context.js"; // remember to import into other files
import { retrieveData, depositData } from "./functions/storage.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);

function Main() {
  const params = new URLSearchParams(window.location.search);
  let initialToken = params.get("token");
  if (!initialToken) {
    initialToken = localStorage.getItem("token");
  } else {
    localStorage.setItem("token", initialToken);
  }

  const [token, setToken] = useState(initialToken);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token) {
      fetch("/auth/jwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      })
        .then((response) => response.json())
        .then((data) => setUserData(data))
        .catch((error) => {
          console.error("Error verifying token:", error);
          setUserData(null);
        });
    }
  }, [token]);

  function handleLogin() {
    window.location.href = "http://localhost:5000/auth/google";
  }

  function handleLogout() {
    setToken("");
    localStorage.setItem("token", "");
    window.location.href = "http://localhost:5000/logout";
  }

  const username = userData ? userData.username : null;
  // INITIALIZE USER
  return (
    <div>
      {username ? (
        <>
          <usernameContext.Provider value={username}>
            <App />
            <button
              onClick={async () => {
                await retrieveData(username, token);
              }}
            ></button>
            <button
              onClick={async () => {
                await depositData(username, token);
              }}
            ></button>
          </usernameContext.Provider>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
