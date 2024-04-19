import { useNavigate, useParams } from "react-router-dom";
import ITimeline from "../interfaces/ITimeline"
import { useGetAllUserTimelinesQuery } from "../API/RTKAPI";
import EditTimeLineForm from "../components/timeline/EditTimelineForm";
import { useEffect } from "react";

// interface ModifyTimelinePageProps {
//     timeline: ITimeline
// }

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
            {timeline != undefined && <EditTimeLineForm timeline={timeline} />}
        </div>
    )

}