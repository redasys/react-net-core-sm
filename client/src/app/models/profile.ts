import Photo from "./photo";

export default interface Profile {
    displayName: string;
    userName: string;
    image: string;
    bio: string;
    photos: Photo[];
}