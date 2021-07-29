import { IsEmail, IsString, Length } from "class-validator";

export class UserDTO {
    id?: number;
    @IsString()
    @Length(3,255, {message: 'The user name is wrong minimum 3 characters'})
    username: string;
    @Length(6,6,{message: 'password must be at least 6 characteres'})
    password: string;
    @IsEmail()
    email: string;
    firstName: string;
    lastName: string;
    age: number;
}
