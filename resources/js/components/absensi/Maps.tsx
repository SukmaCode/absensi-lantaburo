import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { X } from 'lucide-react';
import { FaCalendar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default marker icon (broken in bundlers)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapsProps {
    latitude: number;
    longitude: number;
    teacherName?: string;
    date?: string;
    time?: string;
    onClose: () => void;
}

export const Maps = ({ latitude, longitude, teacherName, date, time, onClose }: MapsProps) => {
    const position: [number, number] = [latitude, longitude];

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="relative flex flex-col w-full max-w-2xl overflow-hidden rounded-sm bg-white shadow-2xl"
                style={{ maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="font-semibold text-sm text-neutral-900">
                                {teacherName ?? 'Lokasi Absen'}
                            </h3>
                            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                                {date && (
                                    <span className="flex items-center gap-1">
                                        <FaCalendar className="size-3 text-brand" />
                                        {date}
                                    </span>
                                )}
                                {time && (
                                    <span className="flex items-center gap-1">
                                        <FaClock className="size-3 text-brand" />
                                        {time}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className='size-3 text-brand'/>
                                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        aria-label="Tutup peta"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Map */}
                <div className="relative" style={{ height: 420 }}>
                    <MapContainer
                        center={position}
                        zoom={30}
                        scrollWheelZoom={true}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}>
                            <Popup>
                                <div className="text-sm font-medium">{teacherName ?? 'Lokasi Absen'}</div>
                                {date && <div className="text-xs text-gray-500">{date} {time}</div>}
                                <div className="text-xs text-gray-400 mt-1 font-mono">
                                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                </div>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                    <p className="text-xs text-neutral-500">
                        Lokasi absensi guru berdasarkan GPS
                    </p>
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xs bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700"
                    >
                        <FaMapMarkerAlt className="size-3" />
                        Buka di Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
};