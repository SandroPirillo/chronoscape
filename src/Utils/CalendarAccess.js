// auth.js
import { useState, useEffect } from "react";

const useGoogleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_API_KEY;
    const DISCOVERY_DOCS = [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client:auth2", () => {
          window.gapi.client
            .init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES,
              plugin_name: "chronoscape",
            })
            .then(() => {
              checkLoginStatus();
            });
        });
      };
      document.body.appendChild(script);
    };

    const checkLoginStatus = () => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        const isSignedIn = authInstance.isSignedIn.get();
        setIsLoggedIn(isSignedIn);
        if (isSignedIn) {
          const currentUser = authInstance.currentUser.get();
          setUserProfile(currentUser.getBasicProfile());
        }
      }
      setIsLoading(false);
    };

    loadGoogleAPI();
  }, []);

  const handleLogin = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signIn().then(() => {
        const currentUser = authInstance.currentUser.get();
        setIsLoggedIn(currentUser.isSignedIn());
        setUserProfile(currentUser.getBasicProfile());
      });
    }
    else {
      console.error("Google API not loaded");
    }
  };

  const handleLogout = () => {
    window.gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(() => {
        setIsLoggedIn(false);
        setUserProfile(null);
      });
  };

  return { isLoggedIn, userProfile, isLoading, handleLogin, handleLogout };
};

export default useGoogleAuth;
