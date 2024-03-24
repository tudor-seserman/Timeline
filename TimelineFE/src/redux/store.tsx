import { configureStore } from '@reduxjs/toolkit'
import { api } from "../API/authAPI"
import authReducer from './authSlice'
import errorAlertReducer from './errorAlertSlice'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        errorAlert: errorAlertReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
