export interface IToastAlert {
    severity: "error" | "success" | "info" | "warn" | undefined;
    summary: string;
    detail?: string | undefined;
    life?: number;
}[]