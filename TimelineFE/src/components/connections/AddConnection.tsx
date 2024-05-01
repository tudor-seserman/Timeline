import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction } from "react";
import AddConnectionForm from "./AddConnectionForm";
import { useAlert } from "../../hooks/useAlert";

interface AddConnectionProps {
    connectionWindow: boolean
    setConnectionWindow: Dispatch<SetStateAction<boolean>>
}
export default function AddConnection({ connectionWindow, setConnectionWindow }: AddConnectionProps) {
    const { setAlert } = useAlert();

    const success = (connectionName: string) => {
        setAlert({
            severity: "success",
            summary: `You have requested a connection with ${connectionName}`,
        });
        setTimeout(() => setConnectionWindow(false), 0);
    }


    return (
        <>

            <div className="card flex justify-content-center">
                <Dialog header="Add Connection" visible={connectionWindow} style={{ width: '50vw' }} onHide={() => { setConnectionWindow(false) }}>
                    <AddConnectionForm success={success} />
                </Dialog>
            </div>
        </>
    )
}