import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ILoginDTO } from '../../interfaces/ILoginDTO';
import { useLoginMutation } from '../../API/RTKAPI';
import { useDispatch } from 'react-redux';
import { useError } from '../../hooks/useError';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { setCredentials } from '../../redux/authSlice';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
        .min(8)
        .max(24)
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/\W|_/, { message: "Must contain at least one non-letter and non-number." })
    ,
    details: z.string().max(0, 'You are a bot!'),
})

export type LoginSchemaValues = z.infer<typeof LoginSchema>



export const Login = () => {
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const { setApiError } = useError();
    const navigate = useNavigate();


    const { control,
        formState: { errors, isSubmitting },
        register,
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
        if (data.details === '') {
            const loginDTO: ILoginDTO = {
                username: data.username,
                password: data.password,
            }
            try {
                const user = await login(loginDTO).unwrap()
                dispatch(setCredentials(user))
                reset();
                navigate("/dash");
            } catch (error: unknown) {
                setApiError(error as IBackendResponse);
            }
        } else {
            navigate("/");
        }
    }



    return (
        <Card title="Login" className="shadow-none">
            <div className="registration-form">
                <div className="flex justify-content-center">
                    <div className="card mt-2 mb-1.5">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="username"
                                        control={control}
                                        render={({ field }) => (
                                            <InputText
                                                id={field.name}
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
                                                feedback={false}
                                            />
                                        )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}> Password*</label>
                                </span>
                                {errors.password && <small className="p-error">{errors.password.message}</small>}
                            </div>
                            <div className="hidden">
                                <label htmlFor="details">Don't fill this out if you're human:</label>
                                <input {...register('details')} />
                            </div>

                            <Button disabled={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Login"} />

                        </form>
                    </div>
                </div>
            </div>
        </Card>
    )
}