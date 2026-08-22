<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Services\RekapMuridService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RekapMuridController extends Controller
{
    public function __invoke(Request $request, RekapMuridService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        $month = $request->query('month');

        return Inertia::render('guru/rekap-murid', $service->getMonthlyRecap($teacher, $month));
    }
}
