<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Student;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', Rule::in(['calon_siswa'])],
        ], [
            'role.in' => 'Pendaftaran akun hanya diperbolehkan untuk calon siswa.',
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'phone' => $input['phone'] ?? null,
            'role' => 'calon_siswa',
            'status' => 'inactive',
        ]);

        // Student::firstOrCreate(
        //     ['user_id' => $user->id],
        //     [
        //         'nis' => 'S-'.date('Y').str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
        //         'gender' => 'L',
        //     ]
        // );

        $registrationFee = (int) config('midtrans.registration_fee', 150000);
        $orderId = 'REG-U'.$user->id.'-'.time();

        /** @var MidtransService $midtransService */
        $midtransService = app(MidtransService::class);
        $snapToken = $midtransService->createSnapToken($user, $registrationFee, $orderId);

        $user->payments()->create([
            'order_id' => $orderId,
            'amount' => $registrationFee,
            'type' => 'registration',
            'status' => 'pending',
            'snap_token' => $snapToken,
        ]);

        session()->flash('auto_open_snap', true);

        return $user;
    }
}
