import { useNavigate, useParams } from "react-router-dom";
import { useGetTimelineQuery } from "../API/RTKAPI";
import { useEffect } from "react";
import { Card } from "primereact/card";
import CreateEventForm from "../components/timeline/CreateEventForm";
import TimelineEvents from "../components/timeline/TimelineEvents";
import { ProgressSpinner } from "primereact/progressspinner";
import ConnectionGroup from "../components/connections/ConnectionGroup";
import IBackendConnectionDTO from "../interfaces/IBackendConnectionDTO";

export default function TimelinePage() {
    const { timelineId } = useParams();
    const navigate = useNavigate();
    const { data: currentTimeline, isLoading, isError } = useGetTimelineQuery(timelineId as string);

    useEffect(() => {
        if (isError) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [isError, navigate]);

    if (currentTimeline == undefined) {
        return (<div className="card justify-content-center">
            {isLoading && <ProgressSpinner />}
        </div>)
    }

    return (
        <>
            <div className="card flex justify-content-center">
                {isLoading && <ProgressSpinner />}
                <Card title={currentTimeline.name} className="shadow-none" >
                    <p className="m-0">
                        {currentTimeline.description}
                    </p>
                    <div className="flex justify-content-center pt-4">
                        <ConnectionGroup timelineName={currentTimeline.name} timelineId={currentTimeline.id} connections={currentTimeline.userTTimelines as IBackendConnectionDTO[]} creator={currentTimeline.creator as IBackendConnectionDTO} />
                    </div>
                </Card >
            </div >
            <CreateEventForm timelineId={currentTimeline.id} />
            <TimelineEvents timelineId={currentTimeline.id} />
        </>)
}
