import { useNavigate, useParams } from "react-router-dom";
import { useGetAllUserTimelinesQuery } from "../API/RTKAPI";
import EditTimelineForm from "../components/timeline/EditTimelineForm";
import { useEffect } from "react";
import DeleteTimeline from "../components/timeline/DeleteTimeline";
import { Card } from "primereact/card";


export default function ModifyTimelinePage() {
    const navigate = useNavigate();
    const { timelineId } = useParams();
    const { data: timelines = [] } = useGetAllUserTimelinesQuery();
    const timeline = timelines.find(timeline => timeline.id == Number(timelineId));

    useEffect(() => {
        if (timeline == undefined) { return navigate("/dash", { state: { timelineError: "Could not find Timeline!" } }) }
    }, [timeline]);



    return (
        <div>
            {timeline != undefined &&
                <Card title="Edit Timeline" className="bg-cyan-600">
                    <EditTimelineForm timeline={timeline} />
                    <DeleteTimeline timeline={timeline} />
                </Card>}
        </div>
    )

}