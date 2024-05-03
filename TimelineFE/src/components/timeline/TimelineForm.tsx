import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';

const TimelineSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    dateStarted: z.coerce.date(),
    dateFinished: z.coerce.date(),
}).refine((data) => data.dateFinished >= data.dateStarted, {
    message: "End date cannot be earlier than start date.",
    path: ["dateFinished"],
});

export type TimelineSchemaValues = z.infer<typeof TimelineSchema>

interface TimeLineFormProps {
    submitHandler: SubmitHandler<TimelineSchemaValues>,
    success: boolean,
    action: string;
    populatedValues?: TimelineSchemaValues;
}

export default function TimeLineForm({ submitHandler, success, action, populatedValues }: TimeLineFormProps) {
    const [startTime, setStartTime] = useState(false);
    const [endTime, setEndTime] = useState(false);


    const {
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset }
        = useForm<TimelineSchemaValues>({
            mode: "onBlur",
            reValidateMode: "onBlur",
            resolver: zodResolver(TimelineSchema),
            defaultValues: populatedValues ? populatedValues : {
                name: "",
                description: "",
                dateStarted: new Date(),
                dateFinished: new Date(),
            }
        });


    useEffect(() => { if (success) { reset() } }, [success])

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="p-fluid">

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
                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name</label>
                </span>
                {errors.name && <small className="p-error">{errors.name.message}</small>}
            </div>


            <div className="field">
                <span className="p-float-label p-input-icon-right">
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea
                                id={field.name}
                                {...field} />
                        )} />
                    <label htmlFor="description" className={classNames({ 'p-error': !!errors.description })}>Description</label>
                </span>
                {errors.description && <small className="p-error">{errors.description.message}</small>}
            </div>

            <div className="field">
                <span className="p-float-label flex">
                    <Controller
                        name="dateStarted"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                className="w-[50%]"
                                id={field.name}
                                {...field}
                                showTime={startTime}
                            />
                        )} />
                    <label htmlFor="dateStarted" className={classNames({ 'p-error': errors.dateStarted })}>Start Date</label>
                    <ToggleButton className="w-[50%] p-1 m-2" onLabel="Remove Time" offLabel="Add Time" checked={startTime} onChange={(e: ToggleButtonChangeEvent) => setStartTime(e.value)}>Time</ToggleButton>

                </span>
                {errors.dateStarted && <small className="p-error">{errors.dateStarted.message}</small>}
            </div>

            <div className="field">
                <span className="p-float-label flex">
                    <Controller name="dateFinished"

                        control={control}
                        render={({ field }) => (
                            <Calendar
                                className="w-[50%]"
                                id={field.name}
                                {...field}
                                showTime={endTime}
                            />
                        )} />
                    <label htmlFor="dateFinished" className={classNames({ 'p-error': errors.dateFinished })}>End Date</label>
                    <ToggleButton className="w-[50%] p-1 m-2" onLabel="Remove Time" offLabel="Add Time" checked={endTime} onChange={(e: ToggleButtonChangeEvent) => setEndTime(e.value)}>Time</ToggleButton>
                </span>
                {errors.dateFinished && <small className="p-error">{errors.dateFinished.message}</small>}
            </div>
            <Button loading={isSubmitting} className="bg-amber-400 mt-2" type="submit" label={isSubmitting ? "Sending..." : `${action}`} />

        </form>

    );
}