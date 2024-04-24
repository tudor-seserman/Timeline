import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { useError } from "../../hooks/useError";
import { InputText } from "primereact/inputtext";
import { useCreateConnectionMutation } from "../../API/RTKAPI";
import { IBackendResponse } from "../../interfaces/IBackendResponse";
import IBackendConnectionDTO from "../../interfaces/IBackendConnectionDTO";
import { Dispatch, SetStateAction } from "react";

const AddConnectionSchema = z.object({
    connectionUsername: z.string().min(1),
})

export type AddConnectionValues = z.infer<typeof AddConnectionSchema>

interface AddConnectionFormProps {
    success: (connectionName: string) => void
}

export default function AddConnectionForm({ success }: AddConnectionFormProps) {
    const [connect] = useCreateConnectionMutation()
    const { setApiError } = useError();


    const { control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<AddConnectionValues>({
            mode: "all",
            reValidateMode: "onBlur",
            resolver: zodResolver(AddConnectionSchema),
            defaultValues: {
                connectionUsername: "",
            }
        });

    const onSubmit: SubmitHandler<AddConnectionValues> = async (data) => {
        const addConnectionDTO: IBackendConnectionDTO = {
            name: data.connectionUsername
        }

        try {
            await connect(addConnectionDTO).unwrap()
            reset();
            success(data.connectionUsername);
        } catch (error: unknown) {
            console.log(error)
            setApiError(error as IBackendResponse);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
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

            <Button disabled={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Make connection"} />

        </form>
    )
}