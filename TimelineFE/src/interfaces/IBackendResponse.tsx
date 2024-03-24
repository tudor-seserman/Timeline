export interface IBackendResponse {
    data?: [{
        code: string
        description: string
    }] | string
    status?: number
    originalStatus?: number
}