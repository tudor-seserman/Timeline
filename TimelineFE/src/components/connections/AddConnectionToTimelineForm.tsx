import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { useError } from "../../hooks/useError";
import { InputText } from "primereact/inputtext";
import { IBackendResponse } from "../../interfaces/IBackendResponse";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import { useAddConnectionToTimelineMutation } from "../../API/RTKAPI";
import { useAlert } from "../../hooks/useAlert";

const AddConnectionToTimelineSchema = z.object({
    connectionUsername: z.string().min(1),
})

export type AddConnectionToTimelineValues = z.infer<typeof AddConnectionToTimelineSchema>

interface AddConnectionToTimelineFormProps {
    timelineName: string
    timelineId: Number
}

export default function AddConnectionToTimelineForm({ timelineName, timelineId }: AddConnectionToTimelineFormProps) {
    const [addConnection] = useAddConnectionToTimelineMutation()
    const { setApiError } = useError();
    const { setAlert } = useAlert();

    const success = (connectionName: string) => {
        setAlert({
            severity: "success",
            summary: `${connectionName} has been added to ${timelineName}`,
        });
    }


    const { control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<AddConnectionToTimelineValues>({
            mode: "all",
            reValidateMode: "onBlur",
            resolver: zodResolver(AddConnectionToTimelineSchema),
            defaultValues: {
                connectionUsername: "",
            }
        });

    const onSubmit: SubmitHandler<AddConnectionToTimelineValues> = async (data) => {
        const addConnectionDTO: IBackendConnectionDTO = {
            name: data.connectionUsername
        }

        try {
            await addConnection({ id: timelineId, backendConnectionDTO: addConnectionDTO }).unwrap()
            reset();
            success(data.connectionUsername);
        } catch (error: unknown) {
            console.log(error)
            setApiError(error as IBackendResponse);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid p-2">
            <div className="field">
                <span className="p-float-label">
                    <Controller
                        name="connectionUsername"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                id={field.name}
                                {...field}
                            />
                        )} />
                    <label htmlFor="connectionUsername" className={classNames({ 'p-error': errors.connectionUsername })}>Username</label>
                </span>
                {errors.connectionUsername && <small className="p-error">{errors.connectionUsername.message}</small>}
            </div>

            <Button disabled={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Add Connection to Timeline"} />

        </form>
    )
}
