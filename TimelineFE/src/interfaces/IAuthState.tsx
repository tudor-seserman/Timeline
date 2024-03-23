import { IUser } from "./IUser"

export interface IAuthState {
    user: IUser | null
    token: string | null
}