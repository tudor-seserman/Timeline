import { useEffect, useRef, useState } from 'react';
import { Timeline } from 'primereact/timeline';
import { useGetAllTimelineEventsQuery } from '../../API/RTKAPI'
import IEvent from '../../interfaces/IEvent';
import { Card } from 'primereact/card';
import { OverlayPanel } from 'primereact/overlaypanel';
import EventOverlay from './EventOverlay';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';


interface TimelineEventsProps {
    timelineId?: Number
}

export default function TimelineEvents({ timelineId }: TimelineEventsProps) {
    const { data, isSuccess } = useGetAllTimelineEventsQuery(timelineId as Number)
    const [event, setEvent] = useState<IEvent | null>(null)
    const [events, setEvents] = useState<IEvent[]>([])
    const currentDate = new Date();
    const currentDateAsTime = currentDate.getTime();


    const opRef = useRef<OverlayPanel | null>(null);

    useEffect(() => {
        if (data != undefined) {
            const newArr: IEvent[] = [];
            data.map(a => newArr.push(a))
            newArr.sort((a, b) => {
                const dateA = (a.dateFinished !== undefined) ? new Date(a.dateFinished) : currentDate;
                const dateB = (b.dateFinished !== undefined) ? new Date(b.dateFinished) : currentDate;

                return dateA.getTime() - dateB.getTime();
            })
            setEvents(newArr);

        }
    }, [data])


    const toggle = () => { if (opRef.current) { opRef.current.toggle(null) } };

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, item: IEvent) => {
        if (opRef.current) {
            opRef.current.toggle(e);
            setEvent(item)
        }
    };

    const highlightPastDueEvents = (item: IEvent) => {
        if (!!item.dateFinished) {
            if (new Date(item.dateFinished).getTime() >= currentDateAsTime) {
                return true;
            }
        }
        return false;
    }


    const customizedContent = (item: IEvent) => {

        return (
            <div>
                <Card title={item.name}
                    subTitle={"End Date: " + new Date(item.dateFinished as Date).toLocaleDateString()}
                    onClick={(e) => handleCardClick(e, item)}
                    className={highlightPastDueEvents(item) ? "!bg-Cora" : "!bg-OJ"}
                >
                    {item.description}
                </Card>
            </div>
        );
    };

    return (<>
        {isSuccess && <div className="card">
            <Timeline value={events} align="alternate" className="customized-timeline p-3" content={customizedContent} />
            <OverlayPanel className="bg-OJ" ref={opRef}>
                {event && <EventOverlay event={event} setEvent={setEvent} toggle={toggle} />}
            </OverlayPanel>
        </div>}
    </>
    )
}
