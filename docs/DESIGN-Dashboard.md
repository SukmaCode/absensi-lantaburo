Design a modern, professional, and human-centered ADMIN DASHBOARD for Homeschooling Lantaburo.

This is an internal school management dashboard used by administrators to monitor attendance, manage students, manage users, and publish school announcements.

The dashboard must feel like a natural extension of the existing Lantaburo landing page and authentication pages.

Do NOT create a generic SaaS dashboard.
Do NOT create a dense analytics dashboard filled with random charts and repetitive cards.
The design should feel like a real Indonesian education management platform: clear, calm, trustworthy, modern, and easy to use.

==================================================
BRAND SYSTEM
============

Primary brand color:
#41C623

Dark brand color:
#246914

Supporting colors:
#FFFFFF
#F8FCFF
#E0F4FF
#172033
#64748B
#FBBF24

Use the dark brand color #246914 for the main sidebar.

The bright green #41C623 should be used selectively for:

* Active states
* Primary actions
* Important highlights
* Status indicators
* Focus states

Do not overuse bright green across the entire interface.

The visual hierarchy should primarily use:
dark green + white + soft neutral backgrounds.

==================================================
TYPOGRAPHY
==========

Use Plus Jakarta Sans.

Font weights:

* 400 Regular for body text
* 500 Medium for navigation and labels
* 600 SemiBold for buttons and important UI text
* 700 Bold for page titles and major numbers

The typography should be highly readable and calm.

Avoid excessively large dashboard typography.

==================================================
OVERALL LAYOUT
==============

Create a desktop-first application dashboard.

Layout structure:

LEFT
Permanent vertical sidebar

RIGHT
Main application content area

The sidebar should be visually strong and become the main anchor of the dashboard.

The content area should feel light, spacious, and organized.

Use:

* Generous whitespace
* Clear content grouping
* Subtle borders
* Minimal shadows
* Medium corner radius around 12px

Avoid putting every element inside a floating card.

Use surfaces and cards only when they improve information grouping.

==================================================
SIDEBAR
=======

Sidebar background:
#246914

Sidebar width:
approximately 260px on desktop

Top area:

* Lantaburo logo or wordmark
* Small label: "ADMIN PANEL"

Navigation items:

1. Dashboard
2. Absensi
3. Data Siswa
4. Data Guru
5. Pengumuman
6. Pengaturan

Use simple line icons.

Do not use colorful icons.

Inactive navigation:

* White text with reduced opacity
* Subtle hover background

Active navigation:

* Slightly lighter green surface
* White text
* Small visual indicator or rounded highlight

Example visual direction:

Sidebar background:
#246914

Active item:
rgba white or lighter green surface

Accent:
#41C623

Place user profile information at the bottom of the sidebar:

* Small avatar
* Admin name
* Role label: Administrator
* Dropdown icon

Include logout inside the user profile dropdown rather than as a large red sidebar item.

==================================================
TOP HEADER
==========

The main content area uses:

Background:
#F8FCFF

Top header:
White or transparent depending on the composition.

Left side:
Breadcrumb or page context.

Example:
"Dashboard / Overview"

Right side:

* Notification icon
* Current date
* Small admin profile avatar

Do not overcrowd the header.

==================================================
DASHBOARD OVERVIEW
==================

Main page heading:

"Selamat Datang, Admin"

Supporting text:

"Berikut ringkasan aktivitas dan kehadiran hari ini."

Below the introduction, display the current date in a subtle format.

==================================================
ATTENDANCE SUMMARY
==================

Create a concise attendance summary for today.

Use four meaningful statistics:

* Total Siswa
* Hadir Hari Ini
* Terlambat
* Belum Absen

Do not create four identical generic statistic cards.

Instead:

* Use one slightly emphasized main statistic
* Use three supporting summary cards or compact metric blocks
* Create variation in hierarchy while maintaining consistency

Use colors carefully:

Hadir:
subtle green accent

Terlambat:
#FBBF24 or soft warm yellow accent

Belum Absen:
neutral or subtle muted color

Do not use overly saturated red unless necessary.

==================================================
MAIN DASHBOARD CONTENT
======================

Create a two-column content composition.

LEFT COLUMN — approximately 65%

"Overview Kehadiran Hari Ini"

Display a clean attendance visualization.

Use a simple bar chart or horizontal comparison chart showing:

* Hadir
* Terlambat
* Izin
* Sakit
* Belum Absen

The chart should feel simple and useful.

Do not use unnecessary gradients.

Below or beside it, include:

"Absensi Terbaru"

Display a compact table containing:

* Nama
* Role
* Status
* Waktu

Use realistic sample data.

Example statuses:

* Hadir
* Terlambat
* Izin

Use subtle colored status badges.

Do not make the table overly dense.

==================================================
RIGHT COLUMN — approximately 35%
================================

Create a contextual information column.

SECTION 1:
"Pengumuman Terbaru"

Show 2–3 recent announcements.

Each item includes:

* Title
* Short description
* Date
* Small status or category indicator

Do not make each announcement a large card.

Use a clean list composition with subtle dividers.

SECTION 2:
"Quick Actions"

Provide 2–3 useful administrative actions:

* Tambah Siswa
* Buat Pengumuman
* Lihat Semua Absensi

The primary action should use #41C623.

Other actions should use white surfaces with subtle borders.

Do not create oversized shortcut buttons.

==================================================
DATA VISUALIZATION
==================

Use charts only when they communicate meaningful information.

Possible chart:
Weekly attendance trend.

Use simple lines or bars.

Avoid:

* 3D charts
* Excessive gradients
* Rainbow color schemes
* Too many legends
* Decorative analytics with no purpose

The dashboard should prioritize operational clarity over visual spectacle.

==================================================
STUDENT MANAGEMENT PREVIEW
==========================

Include a subtle preview or navigation section that suggests the admin can manage students.

Possible table preview:

Nama
NIS
Kelas
Status

Include:

* Search input
* Filter button
* Primary button: "Tambah Siswa"

The design should feel like a practical data management interface.

==================================================
COLOR USAGE RULES
=================

#246914
Use for:

* Main sidebar
* Strong brand surfaces
* Selected dark states

#41C623
Use for:

* Primary buttons
* Active indicators
* Positive states
* Important actions

#F8FCFF
Use for:

* Main application background

#FFFFFF
Use for:

* Content surfaces
* Tables
* Cards
* Inputs

#172033
Use for:

* Main text

#64748B
Use for:

* Secondary text
* Metadata
* Supporting information

#FBBF24
Use sparingly for:

* Warning
* Late attendance
* Attention states

Do not introduce unrelated brand colors.

==================================================
BUTTONS AND INPUTS
==================

Primary button:
Background: #41C623
Text: #FFFFFF

Secondary button:
White background
Subtle border
Dark text

Input fields:
Background: #FFFFFF
Border: subtle neutral gray
Focus border: #41C623
Focus ring: subtle green tint

Use approximately:
10–12px border radius

Avoid pill-shaped UI everywhere.

==================================================
CARD DESIGN
===========

Cards should not dominate the dashboard.

Use cards only for:

* Important metrics
* Grouped content
* Tables
* Contextual information

Card styling:

* White background
* 1px subtle border
* Minimal shadow or no shadow
* 12–16px border radius
* Generous internal spacing

Avoid:

* Heavy shadows
* Floating glass effects
* Excessive rounded containers

==================================================
RESPONSIVE DESIGN
=================

Desktop:

* Fixed sidebar
* Spacious content area
* Two-column dashboard composition

Tablet:

* Sidebar can collapse into a compact icon navigation
* Dashboard columns can adjust proportionally

Mobile:

* Sidebar becomes an off-canvas navigation drawer
* Main content becomes single column
* Summary metrics adapt into a compact grid
* Tables become horizontally scrollable or simplified
* Quick actions remain easy to tap

Do not simply shrink the desktop layout.

==================================================
IMPORTANT DESIGN CONSTRAINTS
============================

DO NOT use:

* Generic SaaS dashboard aesthetic
* Excessive metric cards
* Repetitive identical cards
* Random analytics charts
* Rainbow colors
* Excessive gradients
* Glassmorphism
* Neon green
* Huge decorative blobs
* Overly rounded pill components
* Heavy shadows
* Dense information overload
* Fake AI-generated business analytics
* Cartoon illustrations
* Excessive colorful icons

==================================================
DESIRED DESIGN IMPRESSION
=========================

The final dashboard should communicate:

TRUST
+
CLARITY
+
EDUCATION
+
EFFICIENCY
+
ADMINISTRATIVE CONTROL

The user should immediately understand:

1. What is happening today
2. How many students have attended
3. Who has not attended
4. What recent attendance activity occurred
5. What important announcements exist
6. What action the administrator can take next

The final result should feel like a thoughtfully designed school administration platform for Homeschooling Lantaburo, visually connected to the existing landing page through the same green brand system, Plus Jakarta Sans typography, spacing, and visual restraint.

Focus on information hierarchy and usability over decorative effects.
