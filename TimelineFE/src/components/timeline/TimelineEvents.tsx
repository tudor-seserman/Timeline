import { useRef, useState } from 'react';
import { Timeline } from 'primereact/timeline';
import { useGetAllTimelineEventsQuery } from '../../API/RTKAPI'
import IEvent from '../../interfaces/IEvent';
import { Card } from 'primereact/card';
import { OverlayPanel } from 'primereact/overlaypanel';
import EventOverlay from './EventOverlay';


interface TimelineEventsProps {
    timelineId?: Number
}

export default function TimelineEvents({ timelineId }: TimelineEventsProps) {
    const { data, isSuccess } = useGetAllTimelineEventsQuery(timelineId as Number)
    const [event, setEvent] = useState<IEvent | null>(null)


    // const customizedMarker = (item: IEvent) => {
    //     return (
    //         <span className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1" style={{ backgroundColor: item.color }}>
    //             <i className={item.icon}></i>
    //         </span>
    //     );
    // };

    const opRef = useRef<OverlayPanel | null>(null);

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, item: IEvent) => {
        if (opRef.current) {
            opRef.current.toggle(e);
            setEvent(item)
        }
    };


    const customizedContent = (item: IEvent) => {

        return (
            <div>
                <Card title={item.name} subTitle={item.description} onClick={(e) => handleCardClick(e, item)}>
                </Card>
            </div>
        );
    };

    return (<>
        {isSuccess && <div className="card">
            <Timeline value={data} align="alternate" className="customized-timeline" content={customizedContent} />
            <OverlayPanel ref={opRef}>
                {event && <EventOverlay event={event} setEvent={setEvent} timelineId={timelineId} />}
            </OverlayPanel>
        </div>}
    </>
    )
}
