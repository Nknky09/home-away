// __mocks__/app/utils/actions.ts

export const createPropertyAction = jest.fn(() => Promise.resolve());
export const updatePropertyAction = jest.fn(() => Promise.resolve());
export const deleteRentalAction = jest.fn(() => Promise.resolve());
export const createBookingAction = jest.fn(() => Promise.resolve());
export const deleteBookingAction = jest.fn(() => Promise.resolve());
export const fetchRentals = jest.fn(() =>
  Promise.resolve([{ id: "1", name: "Mock Rental" }])
);
export const fetchBookings = jest.fn(() =>
  Promise.resolve([{ id: "1", property: { name: "Mock Property" } }])
);
