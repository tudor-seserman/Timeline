import { Card } from "primereact/card";

interface NoConnectionsProps {
    pending?: boolean
}

export default function NoConnections({ pending }: NoConnectionsProps) {

    return (
        <div className="bg-OJ">
            <Card title={`You have no ${pending ? "pending" : ""} connections`} subTitle="Add some users!" className="!bg-OJ">
            </Card>
        </div>
    )
}