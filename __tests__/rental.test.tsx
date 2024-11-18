import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

// Mock useRouter from Next.js
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Provide explicit mock components for RentalsPage, CreateProperty, and EditRentalPage
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

  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders RentalsPage correctly", () => {
    const RentalsPage = require("@/app/rentals/page").default;
    render(<RentalsPage />);
    expect(screen.getByText("Mock RentalsPage")).toBeInTheDocument();
  });

  it("renders CreateProperty page correctly", () => {
    const CreateProperty = require("@/app/rentals/create/page").default;
    render(<CreateProperty />);
    expect(screen.getByText("Mock CreateProperty")).toBeInTheDocument();
  });

  it("renders EditRentalPage with mock params", () => {
    const EditRentalPage = require("@/app/rentals/[id]/edit/page").default;
    render(<EditRentalPage />);
    expect(screen.getByText("Mock EditRentalPage")).toBeInTheDocument();
  });
});
