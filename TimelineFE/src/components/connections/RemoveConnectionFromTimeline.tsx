import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import { useRemoveConnectionFromTimelineMutation } from "../../API/RTKAPI";

interface RemoveConnectionFromTimelineProps {
    connection: IBackendConnectionDTO
    timelineId: Number
}

export default function RemoveConnectionFromTimeline({ connection, timelineId }: RemoveConnectionFromTimelineProps) {
    const toast = useRef(null);
    const [removeConnection, { isLoading }] = useRemoveConnectionFromTimelineMutation();


    const accept = () => {
        removeConnection({ id: timelineId, backendConnectionDTO: connection })
    };

    const reject = () => {
        if (toast.current) {
            const toastInstance = toast.current as Toast;
            toastInstance.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    };

    const confirm = (event: { currentTarget: any }) => {
        confirmPopup({
            target: event.currentTarget,
            message: `Are you sure you want to remove ${connection.name} from this timeline?`,
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup className="bg-Highlight text-gray-700 border-0 rounded-md shadow-lg z-40 mt-3 p-1" pt={{ footer: { style: { display: "flex", justifyContent: "space-between", } } }} />

            <Button
                loading={isLoading}
                onClick={confirm}
                raised
                rounded
                size="small"
                severity="danger"
                icon={<FontAwesomeIcon className="p-1" icon={faX} />}
                className="!bg-OJ p-1" >
            </Button>

        </>)
}