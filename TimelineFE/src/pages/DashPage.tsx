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


export default function DashPage() {
    const navigate = useNavigate();
    let location = useLocation();
    const { isLoading, data } = useGetAllUserTimelinesQuery();
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
            <div className="col-12" key={timeline.id as Key}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} /> */}
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{timeline.name}</div>
                            {/* <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                            </div> */}
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <SelectButton timelineId={timeline.id} />
                            <EditButton timelineId={timeline.id} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (timeline: ITimeline) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={timeline.id as Key}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        {/*    <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.category}</span>
                        </div>
                        <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>*/}
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {/* <img className="w-9 shadow-2 border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} /> */}
                        <div className="text-2xl font-bold">{timeline.name}</div>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <SelectButton timelineId={timeline.id} />
                        <EditButton timelineId={timeline.id} />
                    </div>
                </div>
            </div >
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
        return <div className="grid grid-nogutter">{timelines.map((timeline, index) => itemTemplate(timeline, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-between">
                <Button label="Create New Timeline" onClick={() => navigate("/timelines/create")}> <FontAwesomeIcon icon={faPlus} /></Button>
                {/* <FloatLabel> */}
                <InputText id="search" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
                {/* <label for="search">Search</label>
                        </FloatLabel> */}
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    let timelines = data?.filter(timeline => { return timeline.name.toLowerCase().includes(search.toLowerCase()) || timeline.description?.toLowerCase().includes(search.toLowerCase()) })

    return (
        <div className="card">
            <Toast ref={toast} position="center" />
            {!isLoading && <DataView value={timelines} listTemplate={listTemplate} layout={layout as "grid" | "list" | (string & Record<string, unknown>) | undefined} header={header()} />}
            {isLoading && <ProgressSpinner />}
        </div>
    )
}
