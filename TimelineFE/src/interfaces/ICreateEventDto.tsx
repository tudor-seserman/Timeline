export default interface ICreateEventDto {
    name: string
    description?: string
    dateCreated?: Date
    dateStarted?: Date
    dateFinished?: Date
    TTimelineId?: Number
}