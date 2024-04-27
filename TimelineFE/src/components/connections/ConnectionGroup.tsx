import { OverlayPanel } from "primereact/overlaypanel"
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO"
import ConnectionAvatarGroup from "./ConnectionsAvatarsGroup"
import { useRef } from "react"
import AddConnectionToTimeline from "./AddConnectionToTimelineForm"
import ConnectionInTimelineDetails from "./ConnectionInTimelineDetails"

interface ConnectionGroupProps {
    timelineName: string
    timelineId: Number
    creator: IBackendConnectionDTO
    connections: IBackendConnectionDTO[]
}

export default function ConnectionGroup({ timelineName, timelineId, connections, creator }: ConnectionGroupProps) {
    const notCreatorConnections = connections.filter(connection => connection.name != creator.name)

    const opRef = useRef<OverlayPanel | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>,) => {
        if (opRef.current) {
            opRef.current.toggle(e);

        }
    };

    return (
        <>
            <div onClick={handleClick}>
                <ConnectionAvatarGroup connections={notCreatorConnections} creator={creator} />
            </div>
            <OverlayPanel className="bg-OJ" ref={opRef}>
                <ConnectionInTimelineDetails connections={notCreatorConnections} creator={creator} />
                <AddConnectionToTimeline timelineName={timelineName} timelineId={timelineId} />
            </OverlayPanel>
        </>
    )
}