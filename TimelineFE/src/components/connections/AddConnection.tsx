import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction, useRef } from "react";
import AddConnectionForm from "./AddConnectionForm";
import { Toast } from "primereact/toast";

interface AddConnectionProps {
    connectionWindow: boolean
    setConnectionWindow: Dispatch<SetStateAction<boolean>>
}
export default function AddConnection({ connectionWindow, setConnectionWindow }: AddConnectionProps) {
    const toast = useRef<Toast>(null);

    const successMessage = (connectionName: string) => {
        toast.current?.show({
            severity: "success",
            summary: `You are now connected with ${connectionName}`,
        });
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="card flex justify-content-center">
                {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}
                <Dialog header="Add Connection" visible={connectionWindow} style={{ width: '50vw' }} onHide={() => { setConnectionWindow(false) }}>
                    <AddConnectionForm setConnectionWindow={setConnectionWindow} successMessage={successMessage} />
                </Dialog>
            </div>
        </>
    )
}