import { Avatar } from "primereact/avatar"
import { AvatarGroup } from "primereact/avatargroup"
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO"

interface ConnectionAvatarGroupProps {
    creator: IBackendConnectionDTO
    connections: IBackendConnectionDTO[]
}

export default function ConnectionAvatarGroup({ connections, creator }: ConnectionAvatarGroupProps) {
    const notCreatorConnections = connections.filter(connection => connection.name != creator.name)

    return (<AvatarGroup>
        {notCreatorConnections.map((notCreatorConnection, index) => { return <Avatar key={index} label={notCreatorConnection.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid' }} /> })}
        <Avatar label={creator.name.charAt(0).toLocaleUpperCase()} size="large" shape="circle" style={{ backgroundColor: '#008080', border: 'solid #FF7F50' }} />
    </AvatarGroup>)
}