import { useState } from "react"
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Button } from "primereact/button";
import api from "../API/axiosConfig";


interface EventType {
    datetime: Nullable<Date>,
    description: string
}

const Events = () => {
    const [event, setEvent] = useState<EventType>({
        datetime: null,
        description: ""
    })

    const createEvent = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await api.post("/Event", event);
        } catch (e) {
            console.log(e);
        }
    }




    return (
        <form onSubmit={createEvent}>
            <div className="card flex justify-content-center">
                <Calendar value={event.datetime} onChange={(e) => setEvent({ ...event, datetime: e.target.value })} inline showTime hourFormat="12" />
            </div>
            <div className="card flex justify-content-center">
                <span className="p-float-label">
                    <InputTextarea id="description" placeholder="Description" value={event.description} onChange={(e) => setEvent({ ...event, description: e.target.value })} rows={5} cols={30} />
                </span>
            </div>
            <div className="card flex justify-content-center">
                <Button label="Submit" />
            </div>
        </form>
    )
}

export default Events