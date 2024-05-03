import { ProgressSpinner } from "primereact/progressspinner";
import { useGetAllUserConnectionsQuery } from "../API/RTKAPI"
import ConnectionCard from "../components/connections/ConnectionCard";
import NoConnections from "../components/connections/NoConnections";


export default function ConnectionsPage() {
    const { data, isLoading } = useGetAllUserConnectionsQuery();
    return (
        <>

            <div className="grid grid-nogutter bg-OJ">
                {data?.map((c, index) =>
                    <ConnectionCard connection={c} key={index} pending={false} />
                )
                }
            </div >
            {isLoading && <ProgressSpinner />}
            {(data != undefined && data.length < 1) && <NoConnections />}

        </>
    )
} 