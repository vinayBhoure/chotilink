import { configureStore  } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";

export const store = configureStore({
    reducer: {
     [userReducer.name] : userReducer.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    )
})

export type RootState = ReturnType<typeof store.getState>