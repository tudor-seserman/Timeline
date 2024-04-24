import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const slice = createSlice({
    name: "errorAlerts",
    initialState: null as IAlert[] | null,
    reducers: {
        createErrorMsg: (
            state,
            {
                payload: alerts
            }: PayloadAction<IAlert[]>
        ) => [...alerts]
        ,
        resetState: () => null
        ,
    }
})

export const { createErrorMsg, resetState } = slice.actions

export default slice.reducer

export const currentErrorAlerts = (state: RootState) => state.errorAlert