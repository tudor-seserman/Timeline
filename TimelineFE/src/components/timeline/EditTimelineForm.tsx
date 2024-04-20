import { Card } from 'primereact/card';
import { useEditTimelineMutation } from '../../API/RTKAPI';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { useError } from '../../hooks/useError';
import TimeLineForm, { TimelineSchemaValues } from './TimelineForm';
import ITimeline from '../../interfaces/ITimeline';
import { SubmitHandler } from 'react-hook-form';
import IEditTimelineDTO from '../../interfaces/IEditTimelineDTO';

interface EditTimelineFormProps {
    timeline: ITimeline
}

export default function EditTimelineForm({ timeline }: EditTimelineFormProps) {
    const [editTimeline, { isSuccess }] = useEditTimelineMutation();
    const { setApiError } = useError();

    const populatedValues = {
        name: timeline.name as string,
        description: timeline.description ? timeline.description as string : "",
        dateStarted: timeline.dateStarted ? new Date(timeline.dateStarted as Date) : new Date(),
        dateFinished: timeline.dateCreated ? new Date(timeline.dateCreated as Date) : new Date(),
    }

    const onSubmit: SubmitHandler<TimelineSchemaValues> = async (data) => {
        const id = timeline.id as Number;
        const editTimelineDTO: IEditTimelineDTO = {
            id: id,
            name: data.name,
            description: data.description,
            dateStarted: data.dateStarted,
            dateFinished: data.dateFinished,
        }
        try {
            await editTimeline({ id, editTimelineDTO }).unwrap()
        } catch (error: unknown) {
            setApiError(error as IBackendResponse);
        }
    };




    return (
        <div className="registration-form">
            <div className="flex justify-content-center">
                <div className="card mt-2 mb-1.5 ">
                    <TimeLineForm submitHandler={onSubmit} success={isSuccess} action="Edit" populatedValues={populatedValues} />
                </div>
            </div>
        </div>
    );
}