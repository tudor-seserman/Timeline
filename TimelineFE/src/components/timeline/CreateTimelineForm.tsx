import { SubmitHandler } from 'react-hook-form';
import { Card } from 'primereact/card';
import { useCreateTimelineMutation } from '../../API/RTKAPI';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { useError } from '../../hooks/useError';
import TimeLineForm, { TimelineSchemaValues } from './TimelineForm';
import ICreateTimelineDTO from '../../interfaces/ICreateTimelineDTO';


export default function CreateTimeLineForm() {
    const [createTimeline, { isSuccess }] = useCreateTimelineMutation();
    const { setApiError } = useError();


    const onSubmit: SubmitHandler<TimelineSchemaValues> = async (data) => {
        const createTimelineDTO: ICreateTimelineDTO = {
            name: data.name,
            description: data.description,
            dateCreated: new Date(),
            dateStarted: data.dateStarted,
            dateFinished: data.dateFinished,
        }

        try {
            await createTimeline(createTimelineDTO).unwrap()
        } catch (error: unknown) {
            setApiError(error as IBackendResponse);
        }
    };




    return (
        <Card className="bg-Blu" title="Create Timeline">
            <div className="registration-form">
                <div className="flex justify-content-center">
                    <div className="card mt-2 mb-1.5 ">
                        <TimeLineForm submitHandler={onSubmit} success={isSuccess} action="Create Timeline" />
                    </div>
                </div>
            </div>
        </Card >
    );
}