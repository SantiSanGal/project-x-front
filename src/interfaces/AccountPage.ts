export interface UserData {
    username: string,
    name: string;
    email: string;
    last_name: string;
    country?: string | null;
    city?: string | null;
}

export interface AboutComponentsProps {
    accessToken: string | null;
}