import React from "react";
import "@testing-library/jest-dom";

// Mocking Clerk globally to avoid ESM module loading issues
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  SignedIn: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  SignedOut: ({ children }: { children: React.ReactNode }) =>
    React.createElement("React.Fragment", null, children),
  SignOutButton: ({ children }: { children: React.ReactNode }) =>
    React.createElement("button", null, children),
  useClerk: jest.fn(() => ({
    user: { id: "123", firstName: "Test", lastName: "User" },
    isSignedIn: true,
    isSignedOut: false,
  })),
}));

// Mocking Node.js crypto module for browser-incompatible Clerk dependencies
jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => Buffer.from("mocked_random_bytes")),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => "mocked_hash"),
  })),
}));

// Add a global crypto mock for `crypto.subtle`
if (!global.crypto) {
  global.crypto = {
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
    } as unknown as SubtleCrypto,
    getRandomValues: jest.fn((buffer: Uint8Array) => buffer.fill(42)),
  } as unknown as Crypto;
}
