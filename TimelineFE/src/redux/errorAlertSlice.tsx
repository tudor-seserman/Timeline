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
        ) =>
            state = [...alerts]
        ,
        resetState: (state) =>
            state = null
        ,
    }
})

export const { createErrorMsg, resetState } = slice.actions

export default slice.reducer

export const currentAlerts = (state: RootState) => state.errorAlert