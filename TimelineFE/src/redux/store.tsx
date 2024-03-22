import { configureStore } from '@reduxjs/toolkit'
import counterReducer from "./authorization/authorizationSlice"

export default configureStore({
    reducer: {
        counter: counterReducer
    }
})

