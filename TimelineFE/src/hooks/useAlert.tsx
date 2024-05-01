import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createAlert, resetAlertState } from "../redux/alertSlice";
import { IToastAlert } from "../interfaces/IToastAlert";

export const useAlert = () => {
    const [alert, setAlert] = useState<IToastAlert | null>(null);
    const dispatch = useDispatch();

    const clearAlert = () => {
        dispatch(resetAlertState());
        setAlert(null)
    };

    useEffect(() => {
        if (alert != null) {
            dispatch(createAlert(alert));
        }
    }, [alert])

    return { alert, setAlert, clearAlert };
}