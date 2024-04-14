import { useNavigate, useParams } from "react-router-dom";
import { useGetTimelineQuery } from "../API/RTKAPI";
import { useEffect } from "react";
import { Card } from "primereact/card";
import CreateEventForm from "../components/timeline/CreateEventForm";
import TimelineEvents from "../components/timeline/TimelineEvents";
import { ProgressSpinner } from "primereact/progressspinner";
import IEvent from "../interfaces/IEvent";

export default function TimelinePage() {
    const { timelineId } = useParams();
    const navigate = useNavigate();
    const { data: currentTimeline, isLoading, isError } = useGetTimelineQuery(timelineId as string);

    useEffect(() => {
        if (isError) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [isError, navigate]);

    return (
        <>
            <div className="card justify-content-center">
                {isLoading && <ProgressSpinner />}
                <Card title={currentTimeline?.name} >
                    <p className="m-0">
                        {currentTimeline?.description}
                        {currentTimeline?.events?.map((e: IEvent) => { return (<>{e.name}</>) })}
                    </p>
                </Card>
            </div>
            <CreateEventForm timelineId={currentTimeline?.id} />
            <TimelineEvents timelineId={currentTimeline?.id} />
        </>)
}