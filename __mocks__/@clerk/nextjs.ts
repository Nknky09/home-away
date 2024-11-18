import React from "react";

export const ClerkProvider = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export const SignedIn = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export const SignedOut = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);

export const SignOutButton = ({ children }: { children: React.ReactNode }) =>
  React.createElement("button", null, children);

export const useClerk = jest.fn(() => ({
  user: { id: "123", firstName: "Test", lastName: "User" },
  isSignedIn: true,
  isSignedOut: false,
}));
