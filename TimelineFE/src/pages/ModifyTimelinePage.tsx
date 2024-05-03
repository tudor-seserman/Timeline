import { useNavigate, useParams } from "react-router-dom";
import { useGetAllUserTimelinesQuery } from "../API/RTKAPI";
import EditTimelineForm from "../components/timeline/EditTimelineForm";
import { useEffect } from "react";
import DeleteTimeline from "../components/timeline/DeleteTimeline";
import { Card } from "primereact/card";
import ConnectionGroup from "../components/connections/ConnectionGroup";
import IBackendConnectionDTO from "../interfaces/IBackendConnectionDTO";


export default function ModifyTimelinePage() {
    const navigate = useNavigate();
    const { timelineId } = useParams();
    const { data: timelines = [] } = useGetAllUserTimelinesQuery();
    const timeline = timelines.find(timeline => timeline.id == Number(timelineId));

    useEffect(() => {
        if (timeline == undefined) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [timeline]);



    return (
        <div className="bg-Blu">
            {timeline != undefined &&
                <Card title={`Edit ${timeline.name}`} className="shadow-none">
                    <div className="flex justify-content-center" >
                        <ConnectionGroup timelineName={timeline.name} timelineId={timeline.id} connections={timeline.userTTimelines as IBackendConnectionDTO[]} creator={timeline.creator as IBackendConnectionDTO} removeConnection />
                    </div>
                    <EditTimelineForm timeline={timeline} />
                    <DeleteTimeline timeline={timeline} />
                </Card>}
        </div>
    )

}