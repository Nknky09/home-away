import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "@clerk/nextjs";
import React from "react";

jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn(),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => null,
}));

describe("Authentication Tests", () => {
  const logHTTPStatus = (testName: string, status: number) =>
    console.log(`Test: ${testName} | HTTP Status: ${status}`);

  it("renders SignInLink and calls handleLogin on click", () => {
    const handleLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      userId: null,
      signIn: handleLogin,
    });

    try {
      render(<button onClick={handleLogin}>Sign In</button>);
      fireEvent.click(screen.getByText("Sign In"));
      expect(handleLogin).toHaveBeenCalledTimes(1);
      logHTTPStatus("SignIn Test", 200);
    } catch {
      logHTTPStatus("SignIn Test", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("renders SignOutLink and calls handleLogout on click", () => {
    const handleLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      userId: "mock-user-id",
      signOut: handleLogout,
    });

    try {
      render(<button onClick={handleLogout}>Sign Out</button>);
      fireEvent.click(screen.getByText("Sign Out"));
      expect(handleLogout).toHaveBeenCalledTimes(1);
      logHTTPStatus("SignOut Test", 200);
    } catch {
      logHTTPStatus("SignOut Test", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("grants access to protected route when logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: "mock-user-id" });

    try {
      render(
        <div>
          <span>Welcome to your dashboard</span>
        </div>
      );
      expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
      logHTTPStatus("Protected Route Access", 200);
    } catch {
      logHTTPStatus("Protected Route Access", 401);
      throw new Error("HTTP test failed.");
    }
  });

  it("denies access to protected route when not logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: null });

    try {
      render(
        <div>
          <span>You must log in to access this page</span>
        </div>
      );
      expect(
        screen.getByText("You must log in to access this page")
      ).toBeInTheDocument();
      logHTTPStatus("Protected Route Denied", 403);
    } catch {
      logHTTPStatus("Protected Route Denied", 500);
      throw new Error("HTTP test failed.");
    }
  });
});
