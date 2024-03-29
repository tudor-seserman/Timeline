import IEvent from "./IEvent"

export default interface ITimeline {
    id?: Number
    name: string
    description?: string
    dateCreated?: Date
    dateStarted?: Date
    dateFinished?: Date
    events?: IEvent[] | undefined
}