import { createSlice } from '@reduxjs/toolkit'
import { IBackendTimelinesDTO } from "../interfaces/IBackendTimelinesDTO";
import type { PayloadAction } from '@reduxjs/toolkit'


const slice = createSlice({
    name: 'timelines',
    initialState: [] as IBackendTimelinesDTO[],
    reducers: {
        setAllUserTimelines: (
            // @ts-ignore
            state,
            {
                payload: allUserTimelines
            }: PayloadAction<IBackendTimelinesDTO[]>,
        ) => {
            allUserTimelines;
        },
    }
})

export const { setAllUserTimelines } = slice.actions

export default slice.reducer