export const getAuth = jest.fn(() => ({
  userId: "mockUserId",
  sessionId: "mockSessionId",
}));

export const users = {
  getUser: jest.fn(() => ({
    id: "mockUserId",
    firstName: "Mock",
    lastName: "User",
    email: "mockuser@example.com",
  })),
};

export const sessions = {
  getSession: jest.fn(() => ({
    id: "mockSessionId",
  })),
};
