import { configureStore } from '@reduxjs/toolkit'
import { api } from "../API/RTKAPI"
import authReducer from './authSlice'
import errorAlertReducer from './errorAlertSlice'
import timelinesReducer from './timelinesSlice'
import alertReducer from './alertSlice'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        alert: alertReducer,
        errorAlert: errorAlertReducer,
        timelines: timelinesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
