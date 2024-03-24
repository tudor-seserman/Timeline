export interface IBackendResponse {
    data?: [{
        code: string
        description: string
    }]
    status?: number
}