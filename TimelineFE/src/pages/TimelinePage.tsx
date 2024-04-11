import { useNavigate, useParams } from "react-router-dom";
import { useGetTimelineQuery } from "../API/authAPI";
import { useEffect } from "react";

export default function TimelinePage() {
    const { timelineId } = useParams();
    const navigate = useNavigate();
    const { data: currentTimeline, isError } = useGetTimelineQuery(timelineId as string);

    useEffect(() => {
        if (isError) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [isError, navigate]);

    return (
        <> {currentTimeline?.name}</>)

}