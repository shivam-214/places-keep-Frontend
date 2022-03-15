import { createSlice } from "@reduxjs/toolkit";

const intitalAuthState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  tokenExpirationTimeInMs: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: intitalAuthState,
  reducers: {
    login(state, action) {
      const storedExpirationTime = action.payload.expiration;

      const tokenExprirationTime = storedExpirationTime
        ? new Date(storedExpirationTime)
        : new Date(new Date().getTime() + 1000 * 60 * 60);

      state.tokenExpirationTimeInMs = tokenExprirationTime.toString();
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: action.payload.userId,
          token: action.payload.token,
          expiration: tokenExprirationTime.toString(),
        })
      );
      state.isLoggedIn = !!action.payload.token;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userId = null;
      state.token = null;
      state.tokenExpirationTimeInMs = null;
      localStorage.removeItem("userData");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
