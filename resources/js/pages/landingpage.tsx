import { Head, usePage } from '@inertiajs/react';

import About from '@/components/landing/about';
import Activities from '@/components/landing/activities';
import Agenda from '@/components/landing/agenda';
import Approach from '@/components/landing/approach';
import CallToAction from '@/components/landing/call-to-action';
import Hero from '@/components/landing/hero';
import Programs from '@/components/landing/programs';
import SiteFooter from '@/components/landing/site-footer';
import SiteNav from '@/components/landing/site-nav';
import Testimonials from '@/components/landing/testimonials';
import SmoothScroll from '@/components/smooth-scroll';
import type { LandingPageProps } from '@/types/landing';

type Props = LandingPageProps;

export default function LandingPage({ school, events }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Homeschooling Lantaburo" />
            <div className="font-regular min-h-screen bg-brand-bg text-brand-text">
                <SiteNav loggedIn={auth.user !== null} />
                <main>
                    <SmoothScroll />
                    <Hero />
                    <About />
                    <Programs />
                    <Approach />
                    <Activities />
                    <Agenda events={events} />
                    <Testimonials />
                    <CallToAction />
                </main>
                <SiteFooter school={school} />
            </div>
        </>
    );
}