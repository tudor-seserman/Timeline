import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { IRegistrationDTO } from '../interfaces/IRegistrationDTO'
import { ILoginDTO } from '../interfaces/ILoginDTO'
import { IUserResponse } from '../interfaces/IUserResponse'
import { IBackendTimelinesDTO } from '../interfaces/IBackendTimelinesDTO'
import ICreateTimelineDto from '../interfaces/ICreateTimelineDTO'
import { IBackendResponse } from '../interfaces/IBackendResponse'
import { IBackendEventDTO } from '../interfaces/IBackendEventDTO'
import IEditEventDTO from '../interfaces/IEditEventDTO'
import ICreateEventDTO from '../interfaces/ICreateEventDTO'

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
    tagTypes: ["Timelines", "Events"],
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
            providesTags: ["Timelines"],
        }),
        getAllTimelineEvents: builder.query<IBackendEventDTO[], Number>({
            query: (timelineId) => `/Timeline/Events/${timelineId}`,
            providesTags: ["Events"],
        }),
        getTimeline: builder.query<IBackendTimelinesDTO, string>({
            query: (timeLineId) => `/Timeline/${timeLineId}`,
        }),
        createTimeline: builder.mutation<IBackendResponse, ICreateTimelineDto>({
            query: (dto) => ({
                url: '/Timeline',
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: ["Timelines"]
        }),
        createEvent: builder.mutation<IBackendResponse, ICreateEventDTO>({
            query: (dto) => ({
                url: '/Event',
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: ["Events"]
        }),
        deleteEvent: builder.mutation<IBackendResponse, Number>({
            query: (id) => ({
                url: `/Event/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Events"]
        }),
        editEvent: builder.mutation<IBackendResponse, { id: Number, editEventDTO: IEditEventDTO }>({
            query: ({ id, editEventDTO }) => ({
                url: `/Event/${id}`,
                method: 'PUT',
                body: editEventDTO,
            }),
            invalidatesTags: ["Events"]
        }),
        protected: builder.mutation<{ message: string }, void>({
            query: () => 'protected',
        }),
    }),
})

export const { useRegisterMutation,
    useLoginMutation,
    useProtectedMutation,
    useGetAllUserTimelinesQuery,
    useCreateEventMutation,
    useGetTimelineQuery,
    useGetAllTimelineEventsQuery,
    useCreateTimelineMutation,
    useDeleteEventMutation,
    useEditEventMutation
} = api