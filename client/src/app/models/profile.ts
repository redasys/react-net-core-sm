import Photo from "./photo";

export default interface Profile { 
    id?: string;   
    displayName: string;
    userName: string;
    image: string;
    bio: string;
    photos: Photo[];
}