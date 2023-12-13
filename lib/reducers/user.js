import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: { uid: null, locale: "fr" }, // Valeur initiale du reducer
};

export const userSlice = createSlice({
	name: "user", // Nom du reducer à exporter
	initialState,
	reducers: {
		connectUser: (state, action) => {
			state.value.uid = action.payload;
		},
		disconnectUser: (state) => {
			state.value.uid = null;
		},
		changeLocale: (state, action) => {
			state.value.locale = action.payload;
		},
	},
});

export const { connectUser, disconnectUser, changeLocale } = userSlice.actions;
export default userSlice.reducer;
