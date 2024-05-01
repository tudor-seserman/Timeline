import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";
import { useCreateConnectionMutation } from "../../API/RTKAPI";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import { useAlert } from "../../hooks/useAlert";

interface AcceptConnectionProps {
    connection: IBackendConnectionDTO
}

export default function AcceptConnection({ connection }: AcceptConnectionProps) {
    const toast = useRef(null);
    const [acceptConnection, { isLoading, isSuccess }] = useCreateConnectionMutation();
    const { setAlert } = useAlert()

    useEffect(() => {
        if (isSuccess) {
            setAlert({
                severity: "warn",
                summary: `You are now connected with ${connection.name}`,
            })
        }
    }, [isSuccess])

    const accept = () => {
        acceptConnection(connection)
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
            message: `Are you sure you want to add ${connection.name} to your connections?`,
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
                size="large"
                severity="danger"
                label={`Approve`}
                className="!bg-Yel p-1" >
                <FontAwesomeIcon className="p-1" icon={faX} />
            </Button>

        </>)
}