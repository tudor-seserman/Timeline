import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useAlert } from "../../hooks/useAlert";
import { useAppSelector } from "../../hooks/useRedux";
import { IToastAlert } from "../../interfaces/IToastAlert";
import { ApiErrors } from "./ApiErrors";

export default function Alerts() {
    const { clearAlert } = useAlert();
    const toast = useRef<Toast>(null);
    const alert = useAppSelector(state => state.alert);


    const showAlert = (alert: IToastAlert) => {
        console.log("hi")
        toast.current?.show(alert);
        clearAlert();
    }
    useEffect(() => {
        if (alert != null) {
            showAlert(alert)
        }
    }, [alert])



    return (
        <>
            <Toast ref={toast} />
            <ApiErrors />
        </>
    )
}
