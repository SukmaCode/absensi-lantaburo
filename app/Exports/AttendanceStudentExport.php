<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceStudentExport implements FromView, ShouldAutoSize, WithStyles, WithTitle
{
    /**
     * @param  array<string, mixed>  $recapData
     */
    public function __construct(
        private readonly array $recapData,
        private readonly ?string $schoolName = null,
        private readonly ?string $teacherName = null
    ) {}

    public function view(): View
    {
        return view('exports.attendance-students', [
            'classInfo' => $this->recapData['classInfo'] ?? [],
            'selectedMonth' => $this->recapData['selectedMonth'] ?? now()->format('Y-m'),
            'monthLabel' => $this->recapData['monthLabel'] ?? now()->translatedFormat('F Y'),
            'daysInMonth' => $this->recapData['daysInMonth'] ?? [],
            'students' => $this->recapData['students'] ?? [],
            'summary' => $this->recapData['summary'] ?? [],
            'schoolName' => $this->schoolName ?? 'PONDOK PESANTREN LAN TABURO',
            'teacherName' => $this->teacherName ?? 'Wali Kelas',
        ]);
    }

    public function title(): string
    {
        $className = $this->recapData['classInfo']['name'] ?? 'Presensi';

        return 'Rekap '.$className;
    }

    public function styles(Worksheet $sheet): array
    {
        $sheet->getParent()?->getDefaultStyle()->getFont()->setName('Calibri');

        return [];
    }
}
