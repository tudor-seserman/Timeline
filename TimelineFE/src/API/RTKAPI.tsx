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
import IEditTimelineDTO from '../interfaces/IEditTimelineDTO'
import IBackendConnectionDTO from '../interfaces/IBackendConnectionDTO'

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
    tagTypes: ["Timelines", "Events", "Connections"],
    endpoints: (builder) => ({
        login: builder.mutation<IUserResponse, ILoginDTO>({
            query: (credentials) => ({
                url: 'Account/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Timelines", "Events"]
        }),
        register: builder.mutation<IUserResponse, IRegistrationDTO>({
            query: (credentials) => ({
                url: 'Account/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ["Timelines", "Events",]
        }),
        getAllUserTimelines: builder.query<IBackendTimelinesDTO[], void>({
            query: () => '/Timeline',
            providesTags: ["Timelines"],
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
        deleteTimeline: builder.mutation<IBackendResponse, Number>({
            query: (id) => ({
                url: `/Timeline/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Events", "Timelines"]
        }),
        editTimeline: builder.mutation<IBackendResponse, { id: Number, editTimelineDTO: IEditTimelineDTO }>({
            query: ({ id, editTimelineDTO }) => ({
                url: `/Timeline/${id}`,
                method: 'PUT',
                body: editTimelineDTO,
            }),
            invalidatesTags: ["Events", "Timelines"]
        }),
        getAllTimelineEvents: builder.query<IBackendEventDTO[], Number>({
            query: (timelineId) => `/Timeline/Events/${timelineId}`,
            providesTags: ["Events"],
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
        getAllUserConnections: builder.query<IBackendConnectionDTO[], void>({
            query: () => '/Account/connections',
            providesTags: ["Connections"],
        }),
        createConnection: builder.mutation<IBackendResponse, IBackendConnectionDTO>({
            query: (dto) => ({
                url: '/Account/connections',
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: ["Connections"]
        }),
        deleteConnection: builder.mutation<IBackendResponse, IBackendConnectionDTO>({
            query: (dto) => ({
                url: `/Account/connections`,
                method: 'DELETE',
                body: dto,
            }),
            invalidatesTags: ["Connections"]
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
    useGetTimelineQuery,
    useCreateTimelineMutation,
    useEditTimelineMutation,
    useDeleteTimelineMutation,
    useGetAllTimelineEventsQuery,
    useCreateEventMutation,
    useEditEventMutation,
    useDeleteEventMutation,
    useCreateConnectionMutation,
    useDeleteConnectionMutation,
    useGetAllUserConnectionsQuery
} = api