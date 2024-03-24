import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useError } from '../../hooks/useError';
import { IRegistrationError } from '../../interfaces/IRegistrationError';



export const ApiErrors = () => {
    const { apiError } = useError();
    const toast = useRef<Toast>(null);

    const showError = (message: string) => {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: (message), life: 3000 });
    }


    if (apiError?.data instanceof Array) {
        apiError?.data.forEach((e: IRegistrationError) => {
            showError(e.description);
        });
    } else {
        showError("Something went wrong. Please try again or contact support.");
    }

    return (
        <Toast ref={toast} />
    )
}

