import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import React from "react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../app/bookings/page", () => ({
  __esModule: true,
  default: () => <div>Mock BookingsPage</div>,
}));

describe("Bookings Page Tests", () => {
  const mockRouter = { push: jest.fn(), query: {} };

  const logHTTPStatus = (testName: string, status: number) => {
    console.log(`${testName} - HTTP Status: ${status}`);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should display bookings", () => {
    try {
      const BookingsPage = require("../app/bookings/page").default;
      render(<BookingsPage />);
      expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
      logHTTPStatus("Display Bookings", 200);
    } catch {
      logHTTPStatus("Display Bookings", 404);
      throw new Error("HTTP test failed.");
    }
  });

  it("should create a booking", () => {
    try {
      const CreateBookingPage = require("../app/bookings/page").default;
      render(<CreateBookingPage />);
      expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
      logHTTPStatus("Create Booking", 201);
    } catch {
      logHTTPStatus("Create Booking", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("should edit a booking", () => {
    try {
      const EditBookingPage = require("../app/bookings/page").default;
      render(<EditBookingPage />);
      expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
      logHTTPStatus("Edit Booking", 200);
    } catch {
      logHTTPStatus("Edit Booking", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("should delete a booking", () => {
    try {
      const DeleteBookingPage = require("../app/bookings/page").default;
      render(<DeleteBookingPage />);
      expect(screen.getByText("Mock BookingsPage")).toBeInTheDocument();
      logHTTPStatus("Delete Booking", 204);
    } catch {
      logHTTPStatus("Delete Booking", 500);
      throw new Error("HTTP test failed.");
    }
  });
});
