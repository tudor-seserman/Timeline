import { Card } from "primereact/card"
import IEvent from "../../interfaces/IEvent"
import { Button } from "primereact/button"
import { faX, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"
import { Toast } from "primereact/toast"
import { useRef, Dispatch, SetStateAction, useState } from "react"
import { useDeleteEventMutation } from "../../API/RTKAPI"
import EditEventForm from "./EditEventForm"
import { Calendar, CalendarDateTemplateEvent } from "primereact/calendar"


interface EventOverlayProps {
    event: IEvent;
    setEvent: Dispatch<SetStateAction<IEvent | null>>;
    toggle: () => void;
}

export default function EventOverlay({ event, setEvent, toggle }: EventOverlayProps) {
    const toast = useRef(null);
    const [deleteEvent] = useDeleteEventMutation();
    const [editMode, setEditMode] = useState(false);

    const accept = () => {
        deleteEvent(event.id as Number)
        setEvent(null);
        toggle();
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

    const formatDate = (date: Date | undefined) => {
        if (date !== undefined) {
            return new Date(date)
        } else {
            return new Date();
        }
    }

    const dateTemplate = (date: CalendarDateTemplateEvent, end: Date, start: Date) => {
        const cDate = new Date(date.year, date.month, date.day)
        if (cDate > start && cDate < end) {
            return (
                <div style={{ background: '#87ceeb', borderRadius: '50%', width: '2em', height: '2em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {date.day}
                </div>
            );
        }
        return date.day;
    }


    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup className="bg-Highlight text-gray-700 border-0 rounded-md shadow-lg z-40 mt-3 p-1" pt={{ footer: { style: { display: "flex", justifyContent: "space-between", } } }} />
            <Card title={event.name} subTitle={event.description} hidden={editMode}>
                <Calendar
                    value={formatDate(event?.dateFinished)}
                    minDate={formatDate(event?.dateFinished)}
                    maxDate={formatDate(event?.dateStarted)}
                    inline
                    readOnlyInput
                    dateTemplate={(date) => dateTemplate(date, formatDate(event?.dateFinished), formatDate(event?.dateStarted))}
                    pt={{
                        panel: () => ({
                            style: { background: '#FF4500', borderColor: '#FF4500' }
                        }),
                        header: () => ({
                            style: { background: '#FF4500', borderColor: '#FF4500' }
                        }),
                    }}
                />

                <div className="flex justify-between p-2">
                    <Button
                        onClick={handleEdit}
                        raised
                        size="large"
                        severity="info"
                        label="Edit"
                        className=" p-1" >
                        <FontAwesomeIcon className="p-1" icon={faPencil} />
                    </Button>
                    <Button
                        onClick={confirm}
                        raised
                        size="large"
                        severity="danger"
                        label="Delete"
                        className=" !bg-OJ p-1" >
                        <FontAwesomeIcon className="p-1" icon={faX} />
                    </Button>
                </div>
            </Card>
            <div hidden={!editMode} >
                <EditEventForm editToggle={handleEdit} event={event} toggle={toggle} />
            </div>
        </>
    )
}