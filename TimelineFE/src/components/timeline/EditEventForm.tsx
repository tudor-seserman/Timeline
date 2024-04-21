import { SubmitHandler } from 'react-hook-form';
import { Card } from 'primereact/card';
import { useEditEventMutation, } from '../../API/RTKAPI';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { useError } from '../../hooks/useError';
import EventForm, { EventSchemaValues } from './EventForm';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';
import IEvent from '../../interfaces/IEvent';
import IEditEventDTO from '../../interfaces/IEditEventDTO';


interface EditEventFormProps {
    editToggle: () => void,
    event: IEvent
    toggle: () => void
}

export default function EditEventForm({ editToggle, event, toggle }: EditEventFormProps) {
    const [editEvent, { isSuccess }] = useEditEventMutation();
    const { setApiError } = useError();

    const onSubmit: SubmitHandler<EventSchemaValues> = async (data) => {
        const id = event.id as Number;

        const editEventDTO: IEditEventDTO = {
            id: id,
            name: data.name,
            description: data.description,
            dateStarted: data.dateStarted,
            dateFinished: data.dateFinished,
        }

        try {
            await editEvent({ id, editEventDTO }).unwrap()
            toggle();
        } catch (error: unknown) {
            setApiError(error as IBackendResponse);
        }
    };

    const populatedValues = {
        name: event.name as string,
        description: event.description ? event.description as string : "",
        dateStarted: event.dateStarted ? new Date(event.dateStarted as Date) : new Date(),
        dateFinished: event.dateCreated ? new Date(event.dateCreated as Date) : new Date(),
    }


    return (
        <Card >
            <div className="flex justify-content-center">
                <div className="card">
                    <EventForm submitHandler={onSubmit} success={isSuccess} action="Edit" populatedValues={populatedValues} />
                    <Button
                        onClick={editToggle}
                        label="Cancel Edit "
                        className="!bg-OJ p-1 mt-2 w-[100%]" >
                        <FontAwesomeIcon className="p-1" icon={faX} />
                    </Button>
                </div>
            </div>
        </Card >
    );
}