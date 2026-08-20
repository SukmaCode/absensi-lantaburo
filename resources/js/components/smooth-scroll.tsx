import Lenis from 'lenis';
import { useEffect } from 'react';

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            smoothWheel: true,
            lerp: 0.1,
            anchors: {
                offset: -80,
            },
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
