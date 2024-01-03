import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { locale: "fr" }, // Valeur initiale du reducer
};

export const userSlice = createSlice({
  name: "user", // Nom du reducer à exporter
  initialState,
  reducers: {
    changeLocale: (state, action) => {
      state.value.locale = action.payload;
    },
  },
});

export const { changeLocale } = userSlice.actions;
export default userSlice.reducer;
