<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use App\Models\User;
use App\Services\AbsenAnakService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsenAnakController extends Controller
{
    public function __invoke(Request $request, AbsenAnakService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $parentProfile = $user->parentProfile ?? ParentProfile::firstOrCreate(['user_id' => $user->id]);

        $month = $request->query('month');
        $studentId = $request->query('student_id');

        return Inertia::render('orangtua/absen-anak', $service->getAbsenData($parentProfile, $month, $studentId ? (int) $studentId : null));
    }
}
