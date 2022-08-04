import { Expose } from "class-transformer"

export class UserDto {
    @Expose()
    id: string

    @Expose()
    fullName: string

    @Expose()
    email: string

    @Expose()
    profileID: string
}