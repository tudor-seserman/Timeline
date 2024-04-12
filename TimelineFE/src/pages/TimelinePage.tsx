import { useNavigate, useParams } from "react-router-dom";
import { useGetTimelineQuery } from "../API/RTKAPI";
import { useEffect } from "react";
import { Card } from "primereact/card";
import CreateEventForm from "../components/timeline/CreateEventForm";
import TimelineEvents from "../components/timeline/TimelineEvents";

export default function TimelinePage() {
    const { timelineId } = useParams();
    const navigate = useNavigate();
    const { data: currentTimeline, isError } = useGetTimelineQuery(timelineId as string);

    useEffect(() => {
        if (isError) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [isError, navigate]);

    return (
        <>
            <div className="card justify-content-center">
                <Card title={currentTimeline?.name} >
                    <p className="m-0">
                        {currentTimeline?.description}
                        {currentTimeline?.events?.map((e) => { return (<>{e.name}</>) })}
                    </p>
                </Card>
            </div>
            <CreateEventForm timelineId={currentTimeline?.id} />
            <TimelineEvents timelineId={currentTimeline?.id} />
        </>)
}