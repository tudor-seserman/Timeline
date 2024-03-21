import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../API/axiosConfig"

const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
        .min(8)
        .max(24)
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
    ,
})

export type LoginSchemaValues = z.infer<typeof LoginSchema>

export type IRegistrationDTO = {
    username: string
    password: string
}

export const Login = () => {

    const { control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<LoginSchemaValues>({
            mode: "onBlur",
            reValidateMode: "onBlur",
            resolver: zodResolver(LoginSchema),
            defaultValues: {
                username: "",
                password: "",
            }
        });

    const onSubmit: SubmitHandler<LoginSchemaValues> = async (data) => {
        const loginDTO: IRegistrationDTO = {
            username: data.username,
            password: data.password,
        }

        const response = await api.post("Account/login", loginDTO, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log(data);
        reset();
        console.log(response);
    };


    return (
        <div className="registration-form">
            <div className="flex justify-content-center">
                <div className="card mt-2 mb-1.5">
                    <h5 className="text-center">Login</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText
                                            id={field.username}
                                            {...field}
                                            autoFocus />
                                    )} />
                                <label htmlFor="username" className={classNames({ 'p-error': errors.username })}>Name*</label>
                            </span>
                            {errors.username && <small className="p-error">{errors.username.message}</small>}
                        </div>


                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Password
                                            id={field.name}
                                            {...field}
                                            toggleMask
                                        />
                                    )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                            </span>
                            {errors.password && <small className="p-error">{errors.password.message}</small>}
                        </div>

                        <Button disabled={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Login"} />

                    </form>
                </div>
            </div>
        </div>
    )
}