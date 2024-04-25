import { useGetAllUserConnectionsQuery } from "../API/RTKAPI"
import ConnectionCard from "../components/connections/ConnectionCard";


export default function ConnectionsPage() {
    const { data } = useGetAllUserConnectionsQuery();
    return (
        <>

            <div className="grid grid-nogutter bg-OJ">
                {data?.map((c, index) =>
                    <ConnectionCard connection={c} key={index} />
                )
                }

            </div >
        </>
    )
} 