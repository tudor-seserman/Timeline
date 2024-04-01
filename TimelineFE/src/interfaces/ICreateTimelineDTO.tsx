import IEvent from "./IEvent"

export default interface ICreateTimelineDto {
    name: string
    description?: string
    dateCreated?: Date
    dateStarted?: Date
    dateFinished?: Date
}