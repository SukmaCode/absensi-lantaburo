<?php

namespace App\Http\Middleware;

use App\Models\SchoolProfile;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $schoolProfile = SchoolProfile::first();

        return [
            ...parent::share($request),
            'name' => $schoolProfile?->name ?? config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'photo' => $request->user()?->avatar ?? ($request->user()?->photo ? asset('storage/'.$request->user()->photo) : null),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'description_heading' => $schoolProfile?->description_heading,
            'description_body' => $schoolProfile?->description_body,
            'address' => $schoolProfile?->address,
            'phone' => $schoolProfile?->phone,
            'email' => $schoolProfile?->email,
            'logo' => $schoolProfile?->logo,
            'hero_image' => $schoolProfile?->hero_image,
            'about_image' => $schoolProfile?->about_image,
            'activities_image_1' => $schoolProfile?->activities_image_1,
            'activities_image_2' => $schoolProfile?->activities_image_2,
            'activities_image_3' => $schoolProfile?->activities_image_3,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'parent_credentials' => fn () => $request->session()->get('parent_credentials'),
            ],
        ];
    }
}
