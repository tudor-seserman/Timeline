import { useState, Key, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ITimeline from '../interfaces/ITimeline';
import { useGetAllUserTimelinesQuery } from '../API/RTKAPI';
import { faTimeline, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import ConnectionGroup from '../components/connections/ConnectionGroup';
import { useAppSelector } from '../hooks/useRedux';



export default function DashPage() {
    const navigate = useNavigate();
    let location = useLocation();
    const { isLoading, data } = useGetAllUserTimelinesQuery();
    let username = useAppSelector(state => state.auth.username);
    const [layout, setLayout] = useState<"grid" | "list" | (string & Record<string, unknown>) | undefined>('grid');
    const toast = useRef<Toast>(null);
    const [search, setSearch] = useState<string>("")


    const show = (detailParm: string,) => {
        toast.current?.show({ severity: "error", summary: 'Info', detail: detailParm });
    };

    useEffect(() => {
        if (location.state != null) {
            show(location.state.timelineError);
        }
    }, [location]);

    interface ButtonLinkProps {
        timelineId: Number | undefined;
    }
    const SelectButton: React.FC<ButtonLinkProps> = ({ timelineId }) => { return <Link to={`/timelines/${timelineId}`} className="btn" ><FontAwesomeIcon icon={faTimeline} /> Select</Link> };

    const EditButton: React.FC<ButtonLinkProps> = ({ timelineId }) => { return <Link to={`/timelines/modify/${timelineId}`} className="btn" ><FontAwesomeIcon icon={faPencil} /> Edit</Link> };


    const listItem = (timeline: ITimeline, index: number) => {
        return (
            <div className="col-12 border-OJ bg-Blu" key={timeline.id as Key}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-OJ', { 'border-top-1 ': index !== 0 })}>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 bg-Blu">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{timeline.name}</div>
                            <ConnectionGroup timelineName={timeline.name} timelineId={timeline.id as Number} connections={timeline.userTTimelines} creator={timeline.creator} />
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2  ">
                            <SelectButton timelineId={timeline.id} />
                            {username === timeline.creator.name && <EditButton timelineId={timeline.id} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (timeline: ITimeline) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p- bg-OJ " key={timeline.id as Key}>
                <div className="p-4 border-1 h-full border-round border-OJ bg-Blu flex flex-column justify-content-between">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{timeline.name}</div>
                        <ConnectionGroup timelineName={timeline.name} timelineId={timeline.id as Number} connections={timeline.userTTimelines} creator={timeline.creator} />
                    </div>
                    <div className="flex align-items-baseline justify-content-between flex-wrap">
                        <SelectButton timelineId={timeline.id} />
                        {username === timeline.creator.name && <EditButton timelineId={timeline.id} />}
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (item: ITimeline, layout: "grid" | "list" | (string & Record<string, unknown>) | undefined, index: number) => {
        if (!item) {
            return null;
        }
        if (layout === 'list') return listItem(item, index);
        else if (layout === 'grid') return gridItem(item);
    };

    const listTemplate = (timelines: ITimeline[], layout?: 'list' | 'grid' | (string & Record<string, unknown>)): React.ReactNode => {
        return <div className="grid grid-nogutter ">{timelines.map((timeline, index) => itemTemplate(timeline, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex flex-col md:flex-row md:justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <Button label="Create New Timeline" onClick={() => navigate("/timelines/create")}>
                    <FontAwesomeIcon icon={faPlus} className="px-1" />
                </Button>
                <div className="w-full md:w-auto flex justify-center">
                    <FloatLabel>
                        <InputText id="search" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
                        <label htmlFor="search">Search Timelines</label>
                    </FloatLabel>
                </div>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    let timelines = data?.filter(timeline => { return timeline.name.toLowerCase().includes(search.toLowerCase()) || timeline.description?.toLowerCase().includes(search.toLowerCase()) })

    return (
        <div className="card" >
            <Toast ref={toast} position="center" />
            {!isLoading &&
                <DataView value={timelines}
                    listTemplate={listTemplate}
                    layout={layout as "grid" | "list" | (string & Record<string, unknown>) | undefined}
                    header={header()}
                    pt={{
                        header: () => ({
                            style: { background: '#FF4500', borderColor: '#FF4500' }
                        }),
                        root: { style: { gutterColor: "#FF4500", borderColor: '#FF4500', divide: '#FF4500', } }
                    }}
                />}
            {isLoading && <ProgressSpinner />}
        </div>
    )
}
