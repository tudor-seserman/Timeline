import { ProgressSpinner } from "primereact/progressspinner";
import { useGetAllPendingUserConnectionsQuery } from "../API/RTKAPI";
import ConnectionCard from "../components/connections/ConnectionCard";
import NoConnections from "../components/connections/NoConnections";


export default function PendingConnectionsPage() {
    const { data, isLoading } = useGetAllPendingUserConnectionsQuery();
    return (
        <>

            <div className="grid grid-nogutter bg-OJ">
                {data?.map((c, index) =>
                    <ConnectionCard connection={c} key={index} pending={true} />
                )
                }
            </div >
            {isLoading && <ProgressSpinner />}
            {(data != undefined && data.length < 1) && <NoConnections pending />}

        </>
    )
} 