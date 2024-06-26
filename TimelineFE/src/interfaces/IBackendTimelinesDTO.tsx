import IBackendConnectionDTO from "./IBackendConnectionDTO"
import IEvent from "./IEvent"

export interface IBackendTimelinesDTO {
    id: Number
    name: string
    description?: string
    dateCreated?: Date
    dateStarted?: Date
    dateFinished?: Date
    events?: IEvent[] | undefined
    userTTimelines: IBackendConnectionDTO[]
    creator: IBackendConnectionDTO
}