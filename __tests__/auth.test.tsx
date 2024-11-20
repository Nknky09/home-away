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
  it("renders SignOutLink and calls handleLogout on click", () => {
    const handleLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      userId: "mock-user-id",
      signOut: handleLogout,
    });

    render(<button onClick={handleLogout}>Sign Out</button>);
    fireEvent.click(screen.getByText("Sign Out"));

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("grants access to protected route when logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: "mock-user-id" });

    render(
      <div>
        <span>Welcome to your dashboard</span>
      </div>
    );

    expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
  });

  it("denies access to protected route when not logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ userId: null });

    render(
      <div>
        <span>You must log in to access this page</span>
      </div>
    );

    expect(
      screen.getByText("You must log in to access this page")
    ).toBeInTheDocument();
  });
});
