import { Card } from "primereact/card"
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO"
import { Avatar } from "primereact/avatar"
import RemoveConnectionFromTimeline from "./RemoveConnectionFromTimeline"

interface ConnectionInTimelineDetailsProps {
    timelineId: Number
    creator: IBackendConnectionDTO
    connections: IBackendConnectionDTO[]
    removeConnection?: Boolean
}

export default function ConnectionInTimelineDetails({ connections, creator, removeConnection, timelineId }: ConnectionInTimelineDetailsProps) {
    return (
        <>
            <Card>
                <span className="font-bold">Timeline Creator</span>
                <div className="flex align-items-center gap-2">
                    <Avatar label={creator.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid #FF7F50' }} />
                    <span className="text-xl">{creator.name}</span>
                </div>
                {connections.length > 0 && <span className="font-italic">Timeline Connections</span>}
                {connections.map((connection, index) => {
                    return (
                        <div key={index} className="flex align-items-center gap-2 p-1">
                            <Avatar label={connection.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid' }} />
                            <span className="text-xl">{connection.name}</span>
                            {removeConnection && <RemoveConnectionFromTimeline connection={connection} timelineId={timelineId} />}
                        </div>)
                })}
            </Card>
        </>
    )
}