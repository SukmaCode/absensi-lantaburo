export interface SchoolProfile {
    id: number;
    name: string;
    logo: string | null;
    description: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
}

export interface EventItem {
    id: number;
    title: string;
    description: string | null;
    event_date: string;
    location: string | null;
}

export interface LandingPageProps {
    school: SchoolProfile | null;
    events: EventItem[];
}
