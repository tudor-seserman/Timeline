import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../API/axiosConfig"

const RegistrationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
        .min(8)
        .max(24)
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
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

export type IRegistrationDTO = {
    username: string
    email: string
    password: string
}


export const Register = () => {

    const { control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<RegistrationSchemaValues>({
            mode: "onBlur",
            reValidateMode: "onBlur",
            resolver: zodResolver(RegistrationSchema),
            defaultValues: {
                name: "",
                email: "",
                password: "",
                verifyPassword: "",
            }
        });

    const onSubmit: SubmitHandler<RegistrationSchemaValues> = async (data) => {
        const registrationDTO: IRegistrationDTO = {
            username: data.name,
            email: data.email,
            password: data.password,
        }

        const response = await api.post("Account/register", registrationDTO, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log(data);
        reset();
        console.log(response);
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
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="registration-form">
            <div className="flex justify-content-center">
                <div className="card mt-2 mb-1.5">
                    <h5 className="text-center">Register</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText
                                            id={field.name}
                                            {...field}
                                            autoFocus />
                                    )} />
                                <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                            </span>
                            {errors.name && <small className="p-error">{errors.name.message}</small>}
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
                                        />
                                    )} />
                                <label htmlFor="verifyPassword" className={classNames({ 'p-error': errors.verifyPassword })}>Verify Password*</label>
                            </span>
                            {errors.verifyPassword && <small className="p-error">{errors.verifyPassword.message}</small>}
                        </div>
                        <Button disabled={isSubmitting} className="mt-2" type="submit" label={isSubmitting ? "Sending..." : "Register"} />

                    </form>
                </div>
            </div>
        </div>
    );
}