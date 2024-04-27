import { Card } from "primereact/card"
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO"
import { Avatar } from "primereact/avatar"

interface ConnectionInTimelineDetailsProps {
    creator: IBackendConnectionDTO
    connections: IBackendConnectionDTO[]
}

export default function ConnectionInTimelineDetails({ connections, creator }: ConnectionInTimelineDetailsProps) {
    return (
        <>
            <Card>
                <span className="font-bold">Timeline Creator</span>
                <div className="flex align-items-center gap-2">
                    <Avatar label={creator.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid #FF7F50' }} />
                    <span>{creator.name}</span>
                </div>
                {connections.length > 0 && <span className="font-italic">Timeline Connections</span>}
                {connections.map(connection => {
                    return (
                        <div className="flex align-items-center gap-2">
                            <Avatar label={connection.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid' }} />
                            <span>{connection.name}</span>
                        </div>)
                })}
            </Card>
        </>
    )
}