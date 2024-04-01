import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { IRegistrationDTO } from '../interfaces/IRegistrationDTO'
import { ILoginDTO } from '../interfaces/ILoginDTO'
import { IUserResponse } from '../interfaces/IUserResponse'
import { IBackendTimelinesDTO } from '../interfaces/IBackendTimelinesDTO'
import ICreateTimelineDto from '../interfaces/ICreateTimelineDTO'
import { IBackendResponse } from '../interfaces/IBackendResponse'

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5128/api/',
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<IUserResponse, ILoginDTO>({
            query: (credentials) => ({
                url: 'Account/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<IUserResponse, IRegistrationDTO>({
            query: (credentials) => ({
                url: 'Account/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        getAllUserTimelines: builder.query<IBackendTimelinesDTO[], void>({
            query: () => '/Timeline',
        }),
        createTimeline: builder.mutation<IBackendResponse, ICreateTimelineDto>({
            query: (dto) => ({
                url: '/Timeline',
                method: 'POST',
                body: dto,
            }),
        }),
        protected: builder.mutation<{ message: string }, void>({
            query: () => 'protected',
        }),
    }),
})

export const { useRegisterMutation, useLoginMutation, useProtectedMutation, useGetAllUserTimelinesQuery, useCreateTimelineMutation } = api