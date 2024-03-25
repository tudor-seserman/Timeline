import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { IAuthState } from '../interfaces/IAuthState';
import { IUserResponse } from '../interfaces/IUserResponse';


const slice = createSlice({
  name: 'auth',
  initialState: { username: null, email: null, token: null } as IAuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { username, email, token },
      }: PayloadAction<IUserResponse>,
    ) => {
      state.username = username;
      state.email = email;
      state.token = token;
    },
    logout: (state) => {
      state.username = null
      state.email = null
      state.token = null
    }
  },
})

export const { setCredentials, logout } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.username
