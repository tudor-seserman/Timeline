import { useGetAllPendingUserConnectionsQuery } from "../API/RTKAPI";
import ConnectionCard from "../components/connections/ConnectionCard";


export default function PendingConnectionsPage() {
    const { data } = useGetAllPendingUserConnectionsQuery();
    return (
        <>

            <div className="grid grid-nogutter bg-OJ">
                {data?.map((c, index) =>
                    <ConnectionCard connection={c} key={index} pending={true} />
                )
                }

            </div >
        </>
    )
} 