import { useState } from "react"
import { IBackendResponse } from "../interfaces/IBackendResponse";
import { useDispatch } from "react-redux";
import { createErrorMsg, resetState } from "../redux/errorAlertSlice";

export const useError = () => {
    const [apiError, setApiError] = useState<IBackendResponse | null>(null);
    const dispatch = useDispatch();

    if (apiError?.status == 500) {
        if (Array.isArray(apiError.data)) {
            const errors = apiError?.data?.map(e => {
                return {
                    severity: "error",
                    message: e.description
                };
            });
            dispatch(createErrorMsg(errors as IAlert[]))
        }
    } else if (apiError?.originalStatus == 401) {
        dispatch(createErrorMsg([{
            severity: "error",
            message: apiError.data
        }] as IAlert[]))

    }


    const clearError = () => {
        dispatch(resetState());
        setApiError(null)
    };


    return { apiError, setApiError, clearError };
}