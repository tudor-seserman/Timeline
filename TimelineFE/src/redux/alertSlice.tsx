import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { IToastAlert } from "../interfaces/IToastAlert";

const slice = createSlice({
    name: "alert",
    initialState: null as IToastAlert | null,
    reducers: {
        createAlert: (
            // @ts-ignore
            state,
            {
                payload: alert
            }: PayloadAction<IToastAlert>
        ) => state = alert
        ,
        resetAlertState: () => null
        ,
    }
})

export const { createAlert, resetAlertState } = slice.actions

export default slice.reducer

export const currentAlert = (state: RootState) => state.alert