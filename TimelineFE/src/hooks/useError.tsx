import { useEffect, useState } from "react"
import { IBackendResponse } from "../interfaces/IBackendResponse";
import { useDispatch } from "react-redux";
import { createErrorMsg, resetState } from "../redux/errorAlertSlice";

export const useError = () => {
    const [apiError, setApiError] = useState<IBackendResponse | null>(null);
    const dispatch = useDispatch();

    const handleApiError = (apiErrorToHandle: IBackendResponse) => {
        if (apiErrorToHandle?.status == 500) {
            if (Array.isArray(apiErrorToHandle.data)) {
                const errors = apiErrorToHandle?.data?.map(e => {
                    return {
                        severity: "error",
                        message: e.description
                    };
                });
                dispatch(createErrorMsg(errors as IAlert[]))
            }
        } else if (apiErrorToHandle?.originalStatus == 401) {
            dispatch(createErrorMsg([{
                severity: "error",
                message: apiErrorToHandle.data
            }] as IAlert[]))
        } else {
            dispatch(createErrorMsg([{
                severity: "error",
                message: "Something went wrong, please refresh and try again or contact support if problem persits."
            }] as IAlert[]))
        }
    }
    const clearError = () => {
        dispatch(resetState());
        setApiError(null)
    };

    useEffect(() => {
        if (apiError != null) {
            handleApiError(apiError);
        }
    }, [apiError])


    return { apiError, setApiError, clearError };
}