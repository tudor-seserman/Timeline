import { SubmitHandler } from 'react-hook-form';
import { Card } from 'primereact/card';
import { useCreateEventMutation, } from '../../API/RTKAPI';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { useError } from '../../hooks/useError';
import ICreateEventDTO from '../../interfaces/ICreateEventDTO';
import { Panel } from 'primereact/panel';
import EventForm, { EventSchemaValues } from './EventForm';
import { useRef } from 'react';

interface CreateEventFormProps {
    timelineId: Number | undefined
}

export default function CreateEventForm({ timelineId }: CreateEventFormProps) {
    const [createEvent, { isSuccess }] = useCreateEventMutation();
    const { setApiError } = useError();
    const menu = useRef<Panel>(null);

    const onSubmit: SubmitHandler<EventSchemaValues> = async (data) => {
        const createEventDTO: ICreateEventDTO = {
            name: data.name,
            description: data.description,
            dateCreated: new Date(),
            dateStarted: data.dateStarted,
            dateFinished: data.dateFinished,
            TTimelineId: timelineId
        }

        try {
            await createEvent(createEventDTO).unwrap();
            menu.current?.collapse(undefined);
        } catch (error: unknown) {
            setApiError(error as IBackendResponse);
        }
    };


    return (
        <Panel toggleable collapsed ref={menu} header="Add Event">
            <Card className="bg-Blu shadow-none" title="Create Event">
                <div className="registration-form">
                    <div className="flex justify-content-center">
                        <div className="card mt-2 mb-1.5 ">
                            <EventForm submitHandler={onSubmit} success={isSuccess} action="Create" />
                        </div>
                    </div>
                </div>
            </Card >
        </Panel >
    );
}