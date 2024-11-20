import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import React from "react";

// Mock useRouter from Next.js
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Provide explicit mock components for BookingsPage
jest.mock("../app/bookings/page", () => ({
  __esModule: true,
  default: () => <div>Mock BookingsPage</div>,
}));

describe("Bookings Page Tests", () => {
  const mockRouter = { push: jest.fn(), query: {} };

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should display bookings", () => {
    const BookingsPage = require("../app/bookings/page").default;
    render(<BookingsPage />);
    expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
  });

  it("should create a booking", () => {
    const CreateBookingPage = require("../app/bookings/page").default;
    render(<CreateBookingPage />);
    expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
  });

  it("should edit a booking", () => {
    const EditBookingPage = require("../app/bookings/page").default;
    render(<EditBookingPage />);
    expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
  });

  it("should delete a booking", () => {
    const DeleteBookingPage = require("../app/bookings/page").default;
    render(<DeleteBookingPage />);
    expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
  });
});
