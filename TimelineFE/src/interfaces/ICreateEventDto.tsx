export default interface ICreateEventDTO {
    name: string
    description?: string
    dateCreated?: Date
    dateStarted?: Date
    dateFinished?: Date
    TTimelineId?: Number
}