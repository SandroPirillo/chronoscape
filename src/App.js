import React from "react";
import useGoogleAuth from "./Utils/CalendarAccess.js";
import "./App.css";
import "./Components/Dashboard.js";
import Dashboard from "./Components/Dashboard.js";
function App() {
  const { isLoggedIn, userProfile, isLoading, handleLogin, handleLogout } =
    useGoogleAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="App">
      <div className="header">
      <h1>ChronoScape productivity tracker</h1>
      {isLoggedIn ? (
        <div className="content-block"> <p className="centered">{userProfile.getName()} </p>
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
        </div>
      ) : (
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      )}
      </div>
      <p>A productivity tracker to help you manage your time and tasks.</p>

      {isLoggedIn ? (
        <div>
          <Dashboard />
        </div>
      ) : (
        <h2>Please login to continue</h2>
      )}
    </div>
  );
}

export default App;
