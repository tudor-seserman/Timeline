import { useEffect, useState } from "react"
import { IBackendResponse } from "../interfaces/IBackendResponse";
import { useDispatch } from "react-redux";
import { createErrorMsg, resetState } from "../redux/errorAlertSlice";

export const useError = () => {
    const [apiError, setApiError] = useState<IBackendResponse | null>(null);
    const dispatch = useDispatch();

    if (apiError?.status == 500) {
        const errors = apiError?.data?.map(e => {
            return {
                severity: "error",
                message: e.description
            };
        });
        setTimeout(() => {
            dispatch(createErrorMsg(errors as IAlert[]))
        }, 0);
        console.log(apiError.data?.length)
    }

    // useEffect(() => {
    //     if (apiError?.status == 500) {
    //         const errors = apiError?.data?.map(e => {
    //             return {
    //                 severity: "error",
    //                 message: e.description
    //             };
    //         });
    //         dispatch(createErrorMsg(errors as IAlert[]))
    //     }
    // }, [apiError])

    const clearError = () => {
        dispatch(resetState()); // Clear the stored errors in Redux state
        setApiError(null)
    };


    return { apiError, setApiError, clearError };
}