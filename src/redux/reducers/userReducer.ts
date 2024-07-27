import { User } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    user?: User,
    loading: boolean
}

const initialState = {
    user: null,
    loading : true
}

export const userReducer = createSlice({
    name: 'user',
    initialState:initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.loading = false
        },
        userNotExists: (state) => {
            state.user = null;
            state.loading = false
        }
        
    }
})

export const { userExists, userNotExists } = userReducer.actions