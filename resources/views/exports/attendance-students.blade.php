<table>
    <thead>
        <!-- Judul & Identitas Lembaga -->
        <tr>
            <th colspan="{{ count($daysInMonth) + 10 }}" style="font-size: 16pt; font-weight: bold; text-align: center; height: 30px; vertical-align: middle;">
                {{ $schoolName ?? 'PONDOK PESANTREN LAN TABURO' }}
            </th>
        </tr>
        <tr>
            <th colspan="{{ count($daysInMonth) + 10 }}" style="font-size: 13pt; font-weight: bold; text-align: center; height: 25px; vertical-align: middle;">
                REKAPITULASI PRESENSI KEHADIRAN SISWA
            </th>
        </tr>
        <tr>
            <th colspan="{{ count($daysInMonth) + 10 }}" style="font-size: 10pt; text-align: center; color: #555555; height: 20px;">
                Periode: {{ $monthLabel }}
            </th>
        </tr>
        <tr></tr>

        <!-- Informasi Kelas & Wali -->
        <tr>
            <td colspan="3" style="font-weight: bold;">Kelas</td>
            <td colspan="{{ count($daysInMonth) + 7 }}">: {{ $classInfo['name'] ?? '-' }} ({{ $classInfo['gradeLevel'] ?? '-' }})</td>
        </tr>
        <tr>
            <td colspan="3" style="font-weight: bold;">Wali Kelas</td>
            <td colspan="{{ count($daysInMonth) + 7 }}">: {{ $teacherName ?? '-' }}</td>
        </tr>
        <tr>
            <td colspan="3" style="font-weight: bold;">Jumlah Siswa</td>
            <td colspan="{{ count($daysInMonth) + 7 }}">: {{ count($students) }} Siswa</td>
        </tr>
        <tr>
            <td colspan="3" style="font-weight: bold;">Waktu Unduh</td>
            <td colspan="{{ count($daysInMonth) + 7 }}">: {{ now()->translatedFormat('d F Y H:i:s') }}</td>
        </tr>
        <tr></tr>

        <!-- Header Tabel Rekap -->
        <tr>
            <th rowspan="2" style="background-color: #2D6A4F; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 50px;">No</th>
            <th rowspan="2" style="background-color: #2D6A4F; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 120px;">NIS</th>
            <th rowspan="2" style="background-color: #2D6A4F; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 220px;">Nama Siswa</th>
            <th rowspan="2" style="background-color: #2D6A4F; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 45px;">L/P</th>
            <th colspan="{{ count($daysInMonth) }}" style="background-color: #2D6A4F; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">Tanggal</th>
            <th colspan="5" style="background-color: #1B4332; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">Rekapitulasi</th>
            <th rowspan="2" style="background-color: #1B4332; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 60px;">%</th>
        </tr>
        <tr>
            @foreach ($daysInMonth as $day)
                @if ($day['isWeekend'])
                    <th style="background-color: #D8F3DC; color: #000000; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 35px;">
                        {{ (int) $day['dayNumber'] }}
                    </th>
                @else
                    <th style="background-color: #E8F5E9; color: #000000; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 35px;">
                        {{ (int) $day['dayNumber'] }}
                    </th>
                @endif
            @endforeach
            <th style="background-color: #C8E6C9; color: #1B5E20; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 40px;">H</th>
            <th style="background-color: #FFE082; color: #F57F17; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 40px;">T</th>
            <th style="background-color: #BBDEFB; color: #0D47A1; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 40px;">I</th>
            <th style="background-color: #E1BEE7; color: #4A148C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 40px;">S</th>
            <th style="background-color: #FFCDD2; color: #B71C1C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000; width: 40px;">A</th>
        </tr>
    </thead>
    <tbody>
        @forelse ($students as $index => $student)
            <tr>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $index + 1 }}</td>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #000000;">'{{ $student['nis'] }}</td>
                <td style="text-align: left; vertical-align: middle; border: 1px solid #000000;">{{ $student['name'] }}</td>
                <td style="text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['gender'] }}</td>

                @foreach ($daysInMonth as $day)
                    @php
                        $status = $student['dailyStatus'][$day['date']] ?? null;
                    @endphp
                    @if ($status === 'hadir')
                        <td style="background-color: #E8F5E9; color: #1B5E20; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: bold;">H</td>
                    @elseif ($status === 'terlambat')
                        <td style="background-color: #FFF8E1; color: #F57F17; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: bold;">T</td>
                    @elseif ($status === 'izin')
                        <td style="background-color: #E3F2FD; color: #0D47A1; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: bold;">I</td>
                    @elseif ($status === 'sakit')
                        <td style="background-color: #F3E5F5; color: #4A148C; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: bold;">S</td>
                    @elseif ($status === 'alpha')
                        <td style="background-color: #FFEBEE; color: #B71C1C; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: bold;">A</td>
                    @elseif ($day['isWeekend'])
                        <td style="background-color: #F5F5F5; color: #9E9E9E; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: normal;">-</td>
                    @else
                        <td style="background-color: #FFFFFF; color: #000000; text-align: center; vertical-align: middle; border: 1px solid #000000; font-weight: normal;">-</td>
                    @endif
                @endforeach

                <td style="background-color: #E8F5E9; color: #1B5E20; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['hadir'] }}</td>
                <td style="background-color: #FFF8E1; color: #F57F17; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['terlambat'] }}</td>
                <td style="background-color: #E3F2FD; color: #0D47A1; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['izin'] }}</td>
                <td style="background-color: #F3E5F5; color: #4A148C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['sakit'] }}</td>
                <td style="background-color: #FFEBEE; color: #B71C1C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['alpha'] }}</td>
                <td style="background-color: #FAFAFA; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $student['attendancePercentage'] }}%</td>
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($daysInMonth) + 10 }}" style="text-align: center; vertical-align: middle; border: 1px solid #000000; height: 30px;">
                    Tidak ada data siswa untuk kelas ini.
                </td>
            </tr>
        @endforelse
    </tbody>
    <tfoot>
        <!-- Total Row -->
        <tr>
            <th colspan="4" style="background-color: #E8F5E9; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">
                TOTAL AKUMULASI KELAS
            </th>
            <th colspan="{{ count($daysInMonth) }}" style="background-color: #E8F5E9; text-align: center; vertical-align: middle; border: 1px solid #000000;">-</th>
            <th style="background-color: #C8E6C9; color: #1B5E20; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $summary['totalHadir'] ?? 0 }}</th>
            <th style="background-color: #FFE082; color: #F57F17; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $summary['totalTerlambat'] ?? 0 }}</th>
            <th style="background-color: #BBDEFB; color: #0D47A1; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $summary['totalIzin'] ?? 0 }}</th>
            <th style="background-color: #E1BEE7; color: #4A148C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $summary['totalSakit'] ?? 0 }}</th>
            <th style="background-color: #FFCDD2; color: #B71C1C; font-weight: bold; text-align: center; vertical-align: middle; border: 1px solid #000000;">{{ $summary['totalAlpha'] ?? 0 }}</th>
            <th style="background-color: #FAFAFA; border: 1px solid #000000;"></th>
        </tr>

        <tr></tr>
        <tr></tr>

        <!-- Keterangan Legend -->
        <tr>
            <td colspan="4" style="font-weight: bold; font-size: 10pt;">Keterangan Kode:</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>
        <tr>
            <td style="background-color: #E8F5E9; color: #1B5E20; font-weight: bold; text-align: center; border: 1px solid #000000;">H</td>
            <td colspan="3" style="border: 1px solid #000000;">Hadir Tepat Waktu</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>
        <tr>
            <td style="background-color: #FFF8E1; color: #F57F17; font-weight: bold; text-align: center; border: 1px solid #000000;">T</td>
            <td colspan="3" style="border: 1px solid #000000;">Terlambat</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>
        <tr>
            <td style="background-color: #E3F2FD; color: #0D47A1; font-weight: bold; text-align: center; border: 1px solid #000000;">I</td>
            <td colspan="3" style="border: 1px solid #000000;">Izin</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>
        <tr>
            <td style="background-color: #F3E5F5; color: #4A148C; font-weight: bold; text-align: center; border: 1px solid #000000;">S</td>
            <td colspan="3" style="border: 1px solid #000000;">Sakit (Surat Dokter)</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>
        <tr>
            <td style="background-color: #FFEBEE; color: #B71C1C; font-weight: bold; text-align: center; border: 1px solid #000000;">A</td>
            <td colspan="3" style="border: 1px solid #000000;">Alpha (Tanpa Keterangan)</td>
            <td colspan="{{ count($daysInMonth) + 6 }}"></td>
        </tr>

        <tr></tr>
        <tr></tr>

        <!-- Lembar Tanda Tangan -->
        <tr>
            <td colspan="3" style="text-align: center;">Mengetahui,</td>
            <td colspan="{{ count($daysInMonth) }}"></td>
            <td colspan="7" style="text-align: center;">{{ now()->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center;">Kepala Sekolah</td>
            <td colspan="{{ count($daysInMonth) }}"></td>
            <td colspan="7" style="text-align: center;">Wali Kelas {{ $classInfo['name'] ?? '' }}</td>
        </tr>
        <tr>
            <td colspan="3" style="height: 50px;"></td>
            <td colspan="{{ count($daysInMonth) }}"></td>
            <td colspan="7" style="height: 50px;"></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center; font-weight: bold; text-decoration: underline;">( .................................................. )</td>
            <td colspan="{{ count($daysInMonth) }}"></td>
            <td colspan="7" style="text-align: center; font-weight: bold; text-decoration: underline;">{{ $teacherName ?? '( .................................................. )' }}</td>
        </tr>
    </tfoot>
</table>
