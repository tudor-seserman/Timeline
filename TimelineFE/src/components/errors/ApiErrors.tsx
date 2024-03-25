import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useAppSelector } from '../../hooks/useRedux';
import { useError } from '../../hooks/useError';
import { IToastAlert } from '../../interfaces/IToastAlert';



export const ApiErrors = () => {
    const { clearError } = useError();
    const toast = useRef<Toast>(null);
    const errorAlerts = useAppSelector(state => state.errorAlert);
    let errorsToShow: IToastAlert[];

    const showError = (alerts: IToastAlert[]) => {
        toast.current?.show(alerts);
    }

    if (errorAlerts != null) {
        setTimeout(() => {
            toast.current?.clear();
            errorsToShow = errorAlerts.map(alert => { return { severity: alert.severity, summary: 'Error', detail: alert.message, life: 3000 } })
            showError(errorsToShow)
            clearError()
        }, 0)
    }

    return (
        <Toast ref={toast} />
    )
}

