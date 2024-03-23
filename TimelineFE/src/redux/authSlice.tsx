import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { IAuthState } from '../interfaces/IAuthState';
import { IUser } from '../interfaces/IUser';


const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as IAuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: IUser; token: string }>,
    ) => {
      state.user = user
      state.token = token
    },
  },
})

export const { setCredentials } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
