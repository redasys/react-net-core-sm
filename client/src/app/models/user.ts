export interface IUser {
    id: string;
    displayName: string;
    token: string;
    userName: string;
    imageUrl: string;
    
}

export interface UserFormValues {
    displayName?: string;
    userName?: string;
    email: string;
    password: string;
}