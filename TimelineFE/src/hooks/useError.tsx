import { useState } from "react"
import { IBackendResponse } from "../interfaces/IBackendResponse";

export const useError = () => {
    const [apiError, setApiError] = useState<IBackendResponse | null>(null);

    return { apiError, setApiError };
}