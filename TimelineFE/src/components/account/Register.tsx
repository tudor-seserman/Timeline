import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IRegistrationDTO } from '../../interfaces/IRegistrationDTO';
import { useRegisterMutation } from '../../API/authAPI';
import { setCredentials } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useError } from '../../hooks/useError';
import { IBackendResponse } from '../../interfaces/IBackendResponse';
import { Card } from 'primereact/card';

const RegistrationSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
        .min(8)
        .max(24)
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/\W|_/, { message: "Must contain at least one non-letter and non-number." })
    ,
    verifyPassword: z.string().min(8).max(24),
}).refine(
    (form) => {
        return form.verifyPassword === form.password
    },
    {
        message: "Passwords must match",
        path: ["verifyPassword"]
    }
)

export type RegistrationSchemaValues = z.infer<typeof RegistrationSchema>



export const Register = () => {
    const [register] = useRegisterMutation();
    const dispatch = useDispatch();
    const { setApiError } = useError();


    const {
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<RegistrationSchemaValues>({
            mode: "onBlur",
            reValidateMode: "onBlur",
            resolver: zodResolver(RegistrationSchema),
            defaultValues: {
                username: "",
                email: "",
                password: "",
                verifyPassword: "",
            }
        });

    const onSubmit: SubmitHandler<RegistrationSchemaValues> = async (data) => {
        const registrationDTO: IRegistrationDTO = {
            username: data.username,
            email: data.email,
            password: data.password,
        }

        try {
            const user = await register(registrationDTO).unwrap()
            dispatch(setCredentials(user))
            reset();
        } catch (error: unknown) {
            setApiError(error as IBackendResponse);
        }
    };

    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>At least one special character</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <Card className="bg-cyan-600" title="Register">
            <div className="registration-form">
                <div className="flex justify-content-center">
                    <div className="card mt-2 mb-1.5 ">
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
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.username })}>Username*</label>
                                </span>
                                {errors.username && <small className="p-error">{errors.username.message}</small>}
                            </div>


                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <Controller name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <InputText
                                                id={field.name}
                                                {...field} />
                                        )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email*</label>
                                </span>
                                {errors.email && <small className="p-error">{errors.email.message}</small>}
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
                                                header={passwordHeader}
                                                footer={passwordFooter} />
                                        )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                                {errors.password && <small className="p-error">{errors.password.message}</small>}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="verifyPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <Password
                                                id={field.name}
                                                {...field}
                                                toggleMask
                                                feedback={false}
                                            />
                                        )} />
                                    <label htmlFor="verifyPassword" className={classNames({ 'p-error': errors.verifyPassword })}>Verify Password*</label>
                                </span>
                                {errors.verifyPassword && <small className="p-error">{errors.verifyPassword.message}</small>}
                            </div>
                            <Button loading={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Register"} />

                        </form>
                    </div>
                </div>
            </div>
        </Card >
    );
}