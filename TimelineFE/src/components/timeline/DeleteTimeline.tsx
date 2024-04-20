import { Card } from "primereact/card";
import ITimeline from "../../interfaces/ITimeline";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useDeleteTimelineMutation } from "../../API/RTKAPI";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";

interface DeleteTimelineProps {
    timeline: ITimeline
}

export default function DeleteTimeline({ timeline }: DeleteTimelineProps) {
    const toast = useRef(null);
    const [deleteTimeline, { isLoading, isSuccess }] = useDeleteTimelineMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) { navigate('/dash') }
    }, [isSuccess])

    const accept = () => {
        deleteTimeline(timeline.id as Number)
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
            message: 'Are you sure you want to delete this timeline?',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup className="bg-yellow-200 text-gray-700 border-0 rounded-md shadow-lg z-40 mt-3 p-1" pt={{ footer: { style: { display: "flex", justifyContent: "space-between", } } }} />

            <Button
                loading={isLoading}
                onClick={confirm}
                raised
                size="large"
                severity="danger"
                label={`Delete ${timeline.name}`}
                className=" bg-red-600 p-1" >
                <FontAwesomeIcon className="p-1" icon={faX} />
            </Button>

        </>)
}