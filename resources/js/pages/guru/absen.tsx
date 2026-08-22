import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    Clock,
    Compass,
    FileText,
    Loader2,
    MapPin,
    RefreshCw,
    RotateCcw,
    Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { absen, dashboard } from '@/routes/guru';
import type { AbsenGuruPageProps } from '@/types/guru';

export default function AbsenGuruPage({
    todayAttendance,
    currentTime,
    currentDate,
}: AbsenGuruPageProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const [gpsLoading, setGpsLoading] = useState<boolean>(true);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        photo_selfie: '',
        latitude: '',
        longitude: '',
        notes: '',
    });

    // Start Webcam
    const startCamera = async () => {
        setCameraError(null);
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                    },
                    audio: false,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                setCameraActive(true);
            } else {
                setCameraError('Kamera tidak didukung oleh browser Anda.');
            }
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
            setCameraActive(false);
        }
    };

    // Stop Webcam
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    // Capture Frame from Video
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const context = canvas.getContext('2d');
        if (context) {
            // Flip horizontally if front camera
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setCapturedPhoto(dataUrl);
            setData('photo_selfie', dataUrl);
            stopCamera();
            toast.success('Foto selfie berhasil diambil!');
        }
    };

    // Retake Photo
    const retakePhoto = () => {
        setCapturedPhoto(null);
        setData('photo_selfie', '');
        startCamera();
    };

    // Fetch GPS Location
    const fetchLocation = () => {
        setGpsLoading(true);
        setGpsError(null);

        if (!navigator.geolocation) {
            setGpsError('Geolocation tidak didukung oleh browser Anda.');
            setGpsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setGpsCoords({ latitude, longitude, accuracy });
                setData((prev) => ({
                    ...prev,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                }));
                setGpsLoading(false);
            },
            (error) => {
                console.error('GPS error:', error);
                let message = 'Gagal mendeteksi lokasi GPS.';
                if (error.code === error.PERMISSION_DENIED) {
                    message = 'Izin lokasi ditolak. Silakan izinkan akses lokasi di browser.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = 'Informasi lokasi tidak tersedia.';
                } else if (error.code === error.TIMEOUT) {
                    message = 'Permintaan lokasi habis waktu (timeout).';
                }
                setGpsError(message);
                setGpsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // Initialize Camera and GPS on mount if not attended yet
    useEffect(() => {
        if (!todayAttendance.hasAttended) {
            startCamera();
            fetchLocation();
        }

        return () => {
            stopCamera();
        };
    }, [todayAttendance.hasAttended]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.photo_selfie) {
            toast.error('Silakan ambil foto selfie terlebih dahulu!');
            return;
        }

        post(absen.url(), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Presensi kehadiran berhasil dikirim!');
            },
            onError: () => {
                toast.error('Gagal mengirim presensi. Periksa kembali form isian.');
            },
        });
    };

    return (
        <>
            <Head title="Absen Guru" />
            <div className="flex flex-1 flex-col gap-6 bg-brand-bg p-4 sm:p-6 lg:p-8">
                {/* Header Navigation */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-brand-muted hover:text-brand-text">
                                <Link href={dashboard()}>
                                    <ArrowLeft className="mr-1 size-4" />
                                    Kembali ke Dashboard
                                </Link>
                            </Button>
                        </div>
                        <h1 className="mt-1 font-bold text-2xl text-brand-text sm:text-3xl">
                            Absensi Guru
                        </h1>
                        <p className="mt-0.5 text-sm text-brand-muted">
                            {currentDate} &bull; Jam Sistem: {currentTime} WIB
                        </p>
                    </div>
                </div>

                {/* State 1: Already Attended Today */}
                {todayAttendance.hasAttended ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs lg:col-span-2">
                            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-[#e7f6e0] text-brand">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg text-brand-text">
                                        Anda Telah Melakukan Presensi Hari Ini
                                    </h2>
                                    <p className="text-xs text-brand-muted">
                                        Presensi tercatat pada sistem absensi sekolah
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                                    <span className="text-xs text-brand-muted">Waktu Masuk</span>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Clock className="size-4 text-brand" />
                                        <span className="font-bold text-xl text-brand-text">
                                            {todayAttendance.checkInTime} WIB
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                                    <span className="text-xs text-brand-muted">Status Kehadiran</span>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'inline-flex items-center rounded-md px-2.5 py-1 font-semibold text-xs',
                                                todayAttendance.status === 'Hadir'
                                                    ? 'bg-[#e7f6e0] text-brand'
                                                    : 'bg-[#fdf0d5] text-[#b9770e]',
                                            )}
                                        >
                                            {todayAttendance.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* GPS & Notes Info */}
                            <div className="flex flex-col gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-sm text-brand-muted">
                                <div className="flex items-start gap-2.5">
                                    <MapPin className="mt-0.5 size-4 text-brand shrink-0" />
                                    <div>
                                        <span className="font-medium text-brand-text">Lokasi GPS: </span>
                                        {todayAttendance.latitude && todayAttendance.longitude ? (
                                            <span>
                                                {todayAttendance.latitude.toFixed(6)}, {todayAttendance.longitude.toFixed(6)}
                                            </span>
                                        ) : (
                                            <span className="italic">Tidak ada data GPS</span>
                                        )}
                                    </div>
                                </div>

                                {todayAttendance.notes && (
                                    <div className="flex items-start gap-2.5 border-t border-neutral-100 pt-2.5">
                                        <FileText className="mt-0.5 size-4 text-brand shrink-0" />
                                        <div>
                                            <span className="font-medium text-brand-text">Catatan: </span>
                                            <span>{todayAttendance.notes}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <Button asChild className="rounded-xl bg-brand text-white hover:bg-brand-dark">
                                    <Link href={dashboard()}>Kembali ke Beranda</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Selfie Preview */}
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs text-center">
                            <h3 className="mb-3 font-semibold text-sm text-brand-text">Foto Selfie Presensi</h3>
                            {todayAttendance.photoUrl ? (
                                <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-xs">
                                    <img
                                        src={todayAttendance.photoUrl}
                                        alt="Bukti Kehadiran"
                                        className="h-64 w-full object-cover sm:h-72"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-neutral-100 text-brand-muted">
                                    <Camera className="size-10 text-neutral-300" />
                                </div>
                            )}
                            <p className="mt-3 text-xs text-brand-muted">Tercatat secara otomatis saat presensi</p>
                        </div>
                    </div>
                ) : (
                    /* State 2: Form Absen Masuk (Camera + GPS) */
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Camera Section */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs lg:col-span-7">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Camera className="size-5 text-brand" />
                                    <h2 className="font-semibold text-base text-brand-text">Kamera Selfie</h2>
                                </div>
                                <span className="text-xs text-brand-muted">Wajib Foto Wajah</span>
                            </div>

                            {/* Camera Viewfinder / Preview */}
                            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-inner flex items-center justify-center">
                                {capturedPhoto ? (
                                    <img
                                        src={capturedPhoto}
                                        alt="Foto Selfie"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <video
                                            ref={videoRef}
                                            playsInline
                                            muted
                                            className="h-full w-full object-cover scale-x-[-1]"
                                        />
                                        {!cameraActive && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900/90 p-6 text-center text-white">
                                                <Camera className="size-12 text-neutral-500 animate-pulse" />
                                                <p className="text-sm">
                                                    {cameraError ?? 'Memuat kamera...'}
                                                </p>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={startCamera}
                                                    className="rounded-xl bg-brand text-white hover:bg-brand-dark"
                                                >
                                                    <RefreshCw className="mr-1.5 size-4" />
                                                    Coba Lagi
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Target Guide Box Overlay */}
                                {cameraActive && !capturedPhoto && (
                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                                        <div className="size-48 sm:size-56 rounded-full border-2 border-dashed border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
                                    </div>
                                )}
                            </div>

                            {/* Camera Controls */}
                            <div className="flex items-center justify-center gap-3 pt-2">
                                {capturedPhoto ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={retakePhoto}
                                        className="rounded-xl border-neutral-200 gap-2"
                                    >
                                        <RotateCcw className="size-4" />
                                        Foto Ulang
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={capturePhoto}
                                        disabled={!cameraActive}
                                        className="gap-2 rounded-xl bg-brand px-6 text-white hover:bg-brand-dark shadow-xs"
                                    >
                                        <Camera className="size-4" />
                                        Ambil Foto Sekarang
                                    </Button>
                                )}
                            </div>
                            {errors.photo_selfie && (
                                <p className="text-center text-xs text-rose-500">{errors.photo_selfie}</p>
                            )}
                        </div>

                        {/* GPS & Submission Section */}
                        <div className="flex flex-col gap-5 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs lg:col-span-5">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Compass className="size-5 text-brand" />
                                    <h2 className="font-semibold text-base text-brand-text">Lokasi & Verifikasi</h2>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-dark">
                                    <Sparkles className="size-3" />
                                    Presensi
                                </span>
                            </div>

                            {/* GPS Status Card */}
                            <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-brand-text">Deteksi Lokasi GPS</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={fetchLocation}
                                        disabled={gpsLoading}
                                        className="h-7 px-2 text-xs text-brand hover:bg-brand-soft"
                                    >
                                        <RefreshCw className={cn('mr-1 size-3', gpsLoading && 'animate-spin')} />
                                        Perbarui
                                    </Button>
                                </div>

                                <div className="mt-2.5 flex items-start gap-3">
                                    <div
                                        className={cn(
                                            'flex size-9 shrink-0 items-center justify-center rounded-lg',
                                            gpsCoords ? 'bg-[#e7f6e0] text-brand' : 'bg-neutral-200 text-neutral-500',
                                        )}
                                    >
                                        <MapPin className="size-4.5" />
                                    </div>
                                    <div className="min-w-0 flex-1 text-xs">
                                        {gpsLoading ? (
                                            <div className="flex items-center gap-1.5 text-brand-muted">
                                                <Loader2 className="size-3.5 animate-spin" />
                                                <span>Mendeteksi koordinat GPS...</span>
                                            </div>
                                        ) : gpsCoords ? (
                                            <div className="flex flex-col gap-0.5">
                                                <p className="font-semibold text-brand-text">
                                                    {gpsCoords.latitude.toFixed(6)}, {gpsCoords.longitude.toFixed(6)}
                                                </p>
                                                <p className="text-[11px] text-brand-muted">
                                                    Akurasi &plusmn;{Math.round(gpsCoords.accuracy ?? 0)} meter
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-rose-500">
                                                <p className="font-medium">{gpsError ?? 'Lokasi tidak terdeteksi'}</p>
                                                <p className="mt-0.5 text-[11px] text-neutral-400">
                                                    Pastikan GPS aktif & browser mengizinkan lokasi.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Current Time Reminder */}
                            <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white p-3 text-xs">
                                <span className="text-brand-muted">Waktu Saat Ini</span>
                                <span className="font-bold text-brand-text tabular-nums">{currentTime} WIB</span>
                            </div>

                            {/* Optional Notes */}
                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-xs font-medium text-brand-text">
                                    Catatan / Keterangan (Opsional)
                                </Label>
                                <Input
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Piket pagi, tugas luar, dll."
                                    className="rounded-xl text-xs"
                                    maxLength={255}
                                />
                                {errors.notes && <p className="text-xs text-rose-500">{errors.notes}</p>}
                            </div>

                            {/* Warning info */}
                            <div className="flex items-start gap-2 rounded-xl bg-amber-50/80 p-3 text-[11px] text-amber-700">
                                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                                <p>Foto selfie & lokasi GPS akan tersimpan sebagai bukti kehadiran resmi.</p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing || !capturedPhoto}
                                className="mt-auto h-11 w-full gap-2 rounded-xl bg-brand font-semibold text-white shadow-xs hover:bg-brand-dark disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Menyimpan Presensi...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="size-4" />
                                        Kirim Absensi Sekarang
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

AbsenGuruPage.layout = {
    breadcrumbs: [
        {
            title: 'Absen Saya',
            href: absen(),
        },
    ],
};
