import React from "react";
import useGoogleAuth from "./Auth.js";

function App() {
  const { isLoggedIn, userProfile, isLoading, handleLogin, handleLogout } =
    useGoogleAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ChronoScape productivity tracker</h1>
        <p>A productivity tracker to help you manage your time and tasks.</p>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
        <p>
          {isLoggedIn ? (
            <div>
              <h2>Welcome {userProfile.getName()}</h2>
            </div>
          ) : (
            <h2>Please login to continue</h2>
          )}
        </p>
      </header>
    </div>
  );
}

export default App;
