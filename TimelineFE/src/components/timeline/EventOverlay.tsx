import { Card } from "primereact/card"
import IEvent from "../../interfaces/IEvent"
import { Button } from "primereact/button"
import { faX, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Toast } from "primereact/toast"
import { useRef, Dispatch, SetStateAction, useState } from "react"
import { useDeleteEventMutation } from "../../API/RTKAPI"
import CreateEventForm from "./CreateEventForm"


interface EventOverlayProps {
    event: IEvent
    setEvent: Dispatch<SetStateAction<IEvent | null>>;
    timelineId: Number;
}

export default function EventOverlay({ event, setEvent, timelineId }: EventOverlayProps) {
    const toast = useRef(null);
    const [deleteEvent] = useDeleteEventMutation();
    const [editMode, setEditMode] = useState(false);

    const accept = () => {
        deleteEvent(event.id as Number)
        setEvent(null);
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
            message: 'Are you sure you want to delete this event?',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    const handleEdit = () => { setEditMode(!editMode); };


    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup className="bg-yellow-200 text-gray-700 border-0 rounded-md shadow-lg z-40 mt-3 p-1" pt={{ footer: { style: { display: "flex", justifyContent: "space-between", } } }} />
            <Card title={event.name} subTitle={event.description} hidden={!editMode}>
                <p className="m-0">
                    Finish Date: {new Date(event?.dateFinished as Date).toLocaleString()} <br />
                    Start Date: {new Date(event?.dateStarted as Date).toLocaleString()} <br />
                    Date Created: {new Date(event?.dateCreated as Date).toLocaleString()} <br />
                </p>
                <div className="flex justify-between p-2">
                    <Button
                        onClick={handleEdit}
                        raised
                        size="large"
                        severity="info"
                        label="Edit"
                        className=" bg-yellow-300 p-1" >
                        <FontAwesomeIcon className="p-1" icon={faPencil} />
                    </Button>
                    <Button
                        onClick={confirm}
                        raised
                        size="large"
                        severity="danger"
                        label="Delete"
                        className=" bg-red-600 p-1" >
                        <FontAwesomeIcon className="p-1" icon={faX} />
                    </Button>
                </div>
            </Card>
            <Card hidden={editMode} >
                <CreateEventForm timelineId={timelineId} />
                <Button
                    onClick={handleEdit}
                    raised
                    size="large"
                    severity="info"
                    label="Save Edit"
                    className=" bg-yellow-300 p-1" >
                    <FontAwesomeIcon className="p-1" icon={faPencil} />
                </Button>
            </Card>
        </>
    )
}