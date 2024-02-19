import { useState } from "react"
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Button } from "primereact/button";

interface EventType {
    datetime: Nullable<Date>,
    description: string
}

const Events = () => {
    const [event, setEvent] = useState<EventType>({
        datetime: null,
        description: ""
    })

    return (
        <form>
            <div className="card flex justify-content-center">
                <Calendar value={event.datetime} onChange={(e) => setEvent({ ...event, datetime: e.target.value })} inline showWeek />
                <InputTextarea value={event.description} onChange={(e) => setEvent({ ...event, description: e.target.value })} rows={5} cols={30} />
                <Button label="Submit" />
            </div>
        </form>
    )
}

export default Events