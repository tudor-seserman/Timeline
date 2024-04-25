import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import DeleteConnection from "./DeleteConnection";

interface ConnectionCardProps {
    key: number,
    connection: IBackendConnectionDTO
}
export default function ConnectionCard({ key, connection }: ConnectionCardProps) {

    return (
        <div className="col-12 md:col-6 lg:col-3 gap-5 p-2 bg-OJ ">
            <Card key={key} title={connection.name}>
                <Avatar style={{ backgroundColor: "#FFA500", color: '#ffffff' }} icon={() => <FontAwesomeIcon className="p-1" icon={faPeopleArrows} />} size="xlarge" shape="circle" />
                <br />
                <br />
                <DeleteConnection connection={connection} />
            </Card>
        </div>
    )
}