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
      <h1>ChronoScape productivity tracker</h1>
      <p>A productivity tracker to help you manage your time and tasks.</p>
      {isLoggedIn ? (
        <button className="login-button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      )}

      {isLoggedIn ? (
        <div>
          <h2>Welcome {userProfile.getName()}</h2>
          <Dashboard />
        </div>
      ) : (
        <h2>Please login to continue</h2>
      )}
    </div>
  );
}

export default App;
