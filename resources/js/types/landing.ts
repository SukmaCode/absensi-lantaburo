export interface SchoolProfile {
    id: number;
    name: string;
    logo: string | null;
    hero_image: string | null;
    about_image: string | null;
    activities_image_1: string | null;
    activities_image_2: string | null;
    activities_image_3: string | null;
    description_heading: string | null;
    description_body: string | null;
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
    contact_person: string | null;
    phone: string | null;
}

export interface LandingPageProps {
    school: SchoolProfile | null;
    events: EventItem[];
}
