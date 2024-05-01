import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import DeleteConnection from "./DeleteConnection";
import AcceptConnection from "./AcceptConnection";
import DenyConnection from "./DenyConnection";

interface ConnectionCardProps {
    key: number,
    connection: IBackendConnectionDTO
    pending: Boolean
}
export default function ConnectionCard({ key, connection, pending }: ConnectionCardProps) {

    return (
        <div className="col-12 md:col-6 lg:col-3 gap-5 p-2 bg-OJ ">
            <Card key={key} title={connection.name}>
                <Avatar style={{ backgroundColor: "#FFA500", color: '#ffffff' }} icon={() => <FontAwesomeIcon className="p-1" icon={faPeopleArrows} />} size="xlarge" shape="circle" />
                <br />
                <br />

                {pending &&
                    <div className="flex justify-between">
                        <AcceptConnection connection={connection} />
                        <DenyConnection connection={connection} />
                    </div>
                }

                {!pending && <DeleteConnection connection={connection} />}
            </Card>
        </div>
    )
}