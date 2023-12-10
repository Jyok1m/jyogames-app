import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: { uid: null }, // Valeur initiale du reducer
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
	},
});

export const { connectUser, disconnectUser } = userSlice.actions;
export default userSlice.reducer;
