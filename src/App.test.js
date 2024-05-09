import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import useGoogleAuth from "./Utils/CalendarAccess";

jest.mock("./Components/Dashboard", () => () => <div>Mock Dashboard</div>);
jest.mock("./Utils/CalendarAccess", () => ({
  __esModule: true,
  default: jest.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("displays the loading message", () => {
    useGoogleAuth.mockImplementation(() => ({ isLoading: true }));
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("doesn't display loading message when not loading", () => {
    useGoogleAuth.mockImplementation(() => ({ isLoading: false }));
    render(<App />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("displays the login button when not logged in", () => {
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: false,
    }));
    render(<App />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("displays the logout button when logged in", () => {
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: true,
      userProfile: { getName: () => "Test User" },
    }));
    render(<App />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("displays the dashboard when logged in", () => {
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: true,
      userProfile: { getName: () => "Test User" },
    }));
    render(<App />);
    expect(screen.getByText("Mock Dashboard")).toBeInTheDocument();
  });

  it("displays the user name when logged in", () => {
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: true,
      userProfile: { getName: () => "Test User" },
    }));
    render(<App />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  
it("calls handleLogin when the login button is clicked", () => {
    const mockLogin = jest.fn();
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: false,
      handleLogin: mockLogin, // Mock handleLogin
    }));
  
    render(<App />);
    fireEvent.click(screen.getByText("Login")); // Simulate a click on the Login button
  
    expect(mockLogin).toHaveBeenCalled(); // Check if handleLogin was called
  });

  it("calls handleLogout when the logout button is clicked", () => {
    const mockLogout = jest.fn();
    useGoogleAuth.mockImplementation(() => ({
      isLoading: false,
      isLoggedIn: true,
      userProfile: { getName: () => "Test User" },
      handleLogout: mockLogout, // Mock handleLogout
    }));
  
    render(<App />);
    fireEvent.click(screen.getByText("Logout")); // Simulate a click on the Logout button
  
    expect(mockLogout).toHaveBeenCalled(); // Check if handleLogout was called
  });

});
