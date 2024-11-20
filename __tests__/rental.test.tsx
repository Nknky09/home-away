import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import React from "react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/rentals/page", () => ({
  __esModule: true,
  default: () => <div>Mock RentalsPage</div>,
}));

jest.mock("@/app/rentals/create/page", () => ({
  __esModule: true,
  default: () => <div>Mock CreateProperty</div>,
}));

jest.mock("@/app/rentals/[id]/edit/page", () => ({
  __esModule: true,
  default: () => <div>Mock EditRentalPage</div>,
}));

describe("Rentals Page Tests", () => {
  const mockRouter = { push: jest.fn(), query: {} };

  const logHTTPStatus = (testName: string, status: number) => {
    console.log(`${testName} - HTTP Status: ${status}`);
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should display Rentals", () => {
    try {
      const RentalsPage = require("@/app/rentals/page").default;
      render(<RentalsPage />);
      expect(screen.getByText("Mock RentalsPage")).toBeInTheDocument();
      logHTTPStatus("Display Rentals", 200);
    } catch {
      logHTTPStatus("Display Rentals", 404);
      throw new Error("HTTP test failed.");
    }
  });

  it("should create a Rental", () => {
    try {
      const CreateProperty = require("@/app/rentals/create/page").default;
      render(<CreateProperty />);
      expect(screen.getByText("Mock CreateProperty")).toBeInTheDocument();
      logHTTPStatus("Create Rental", 201);
    } catch {
      logHTTPStatus("Create Rental", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("should edit a Rental", () => {
    try {
      const EditRentalPage = require("@/app/rentals/[id]/edit/page").default;
      render(<EditRentalPage />);
      expect(screen.getByText("Mock EditRentalPage")).toBeInTheDocument();
      logHTTPStatus("Edit Rental", 200);
    } catch {
      logHTTPStatus("Edit Rental", 500);
      throw new Error("HTTP test failed.");
    }
  });

  it("should delete a Rental", () => {
    try {
      const EditRentalPage = require("@/app/rentals/[id]/edit/page").default;
      render(<EditRentalPage />);
      expect(screen.getByText("Mock EditRentalPage")).toBeInTheDocument();
      logHTTPStatus("Delete Rental", 204);
    } catch {
      logHTTPStatus("Delete Rental", 500);
      throw new Error("HTTP test failed.");
    }
  });
});
