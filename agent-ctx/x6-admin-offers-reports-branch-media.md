# Task x6 — Admin Offers Management + Reports Table + Branch Media Support

**Agent**: x6-admin-agent
**Scope**: ONLY modified `src/components/admin/AdminDashboard.tsx`
**Date**: 2026-06-26

## What was added

### A. Offers Management Tab (7th tab — "العروض")
- Added `"offers"` to the `Tab` union type
- Updated tab bar from `grid-cols-6` to `grid-cols-8` and reduced icon size from 15→14px, font from 8.5px→8px, and indicator bar width from w-8→w-6 (so all 8 tabs fit comfortably on mobile)
- New tab "العروض" with `Percent` icon (red active state)
- New `OffersManager` component:
  - Header banner with Percent icon + helper text
  - 2 Stat cards (total offers / active offers)
  - "إضافة عرض جديد" button (dashed red border)
  - Offer cards showing: Tag icon chip, title (AR + EN), active badge, expired/upcoming badge, description (line-clamped), image thumbnail (h-28), discount pill (red), old→new price pill (green), date range pill
  - Per offer: Edit (inline), Toggle active (Power button), Delete (Trash2)
  - Inline edit form: titleAr, title, descriptionAr, description, imageUrl, discountPct, oldPrice, newPrice, startDate, endDate — all as small inline inputs in a 2/3-column grid
  - `AddOfferModal` (bottom sheet) with same fields, defaults today → +30 days
  - Uses `adminFetchOffers`, `adminCreateOffer`, `adminUpdateOffer`, `adminDeleteOffer`

### B. Reports Tab (8th tab — "التقارير")
- Added `"reports"` to the `Tab` union type
- New tab "التقارير" with `BarChart` icon
- New `ReportsManager` component:
  - 3-mode toggle: يومي (daily) / شهري (monthly) / مالي (financial) — red gradient active state
  - Date picker (`<input type="date">`) for daily mode; month picker (`<input type="month">`) for monthly/financial modes
  - Auto-fetches report on mount + whenever mode/date/month changes (with `react-hooks/set-state-in-effect` disable)
  - Summary cards: total bookings (with CalendarDays icon), total revenue (TrendingUp icon, green, with ج.م suffix, red ring), completed count (green), pending count (yellow)
  - **Daily view**: `.report-table` showing ref, customer (+time), service (+variant name), price, status (color-coded pill: completed green / pending yellow / accepted blue / in_progress orange / cancelled red)
  - **Monthly view**: 2 `.report-table` tables — (1) by date (date, count, revenue), (2) by service (name, count, revenue)
  - **Financial view**: 2 `.report-table` tables — (1) by category (label, count, revenue, average) using `CATEGORY_LABELS[cat].ar`, (2) all completed bookings with ref/customer/service/date/revenue + a tfoot row with the total. The bookings table is scrollable (`max-h-96 overflow-y-auto`) with a sticky header.
  - Uses `adminFetchReport(pin, mode, params)` — passes `{ date }` for daily, `{ month }` for monthly/financial
  - Money formatter: `Math.round(n).toLocaleString("en-US")`

### C. Branch Media Support
- Added 2 helper functions before `BranchesManager`:
  - `parseBranchMedia(mapUrl)` — returns `{ map, image, video }`. Tries JSON.parse first (handles `{"map":"...","image":"...","video":"..."}`); falls back to plain map URL (sets `map`, leaves image/video empty).
  - `packBranchMedia(map, image, video)` — if image/video are present, returns `JSON.stringify({map, image, video})`; otherwise returns plain map URL (or null) for backward compatibility.
- Extended the `editing` state shape with `imageUrl` and `videoUrl` fields
- `startEdit()` now parses the existing `b.mapUrl` to populate `mapUrl`/`imageUrl`/`videoUrl` in the edit form
- `save()` packs them back via `packBranchMedia()` before sending to the API
- Edit form adds a "ميديا الفرع (اختياري)" section (with ImageIcon header) containing:
  - imageUrl input (with live preview thumbnail h-20 if URL set)
  - videoUrl input (with "معاينة الفيديو" link if URL set)
- Branch card display (non-editing view):
  - If image media exists → shows image thumbnail (h-24) at top
  - If only video exists (no image) → shows "فيديو مرفق" placeholder block + "تشغيل الفيديو" red link
  - If both → image thumbnail + "تشغيل الفيديو" red link strip below
  - "Open map" ExternalLink button now points to `parseBranchMedia(b.mapUrl).map` (extracts map URL even when mapUrl is JSON)
- `AddBranchModal` form state now includes `imageUrl` and `videoUrl`
- `AddBranchModal` submit packs via `packBranchMedia()` before sending
- `AddBranchModal` UI adds a "ميديا الفرع (اختياري)" section with imageUrl + videoUrl Input components + live image preview

## File changes summary
- `src/components/admin/AdminDashboard.tsx` — single file modified
  - Imports: added 8 new lucide icons (Percent, BarChart, Tag, Image as ImageIcon, Video, TrendingUp, Wallet, CalendarRange) + 5 new api helpers (adminFetchOffers, adminCreateOffer, adminUpdateOffer, adminDeleteOffer, adminFetchReport)
  - Tab type: extended with `offers` and `reports`
  - Tab bar: `grid-cols-6` → `grid-cols-8`, smaller text/icons, 2 new tab entries
  - Main: added 2 new conditional renders
  - BranchesManager: extended edit state, edit form UI, save logic, card display (image/video)
  - AddBranchModal: extended form state, UI, submit logic
  - NEW: `parseBranchMedia` + `packBranchMedia` helpers
  - NEW: `OfferItem` type, `OffersManager` + `AddOfferModal` components
  - NEW: `ReportBooking` / `ReportSummary` / `ReportData` types, `ReportsManager` component

## Constraints honored
- ONLY modified `src/components/admin/AdminDashboard.tsx`
- Did NOT modify: store.ts, types.ts, i18n.ts, api.ts, globals.css, HomeScreen.tsx, BookingScreen.tsx, ServicesScreen.tsx, page.tsx, prisma/
- Used existing shadcn/ui Table component + the `.report-table` CSS class from globals.css
- Brand identity preserved: black + #DC143C red (active tab indicator, Percent chip bg, red gradient on mode toggle + add buttons, red text for prices/active states)
- Mobile-first, max-w-md container, "use client" directive
- Used existing `Stat` and `Input` shared components from the file
- Used existing `cn`, `motion`, `toast` helpers
- All API requests use relative paths only

## Verification
- `bun run lint`: 0 errors, 1 warning (the warning is pre-existing in HomeScreen.tsx — out of scope)
- TypeScript: 0 errors in modified file (verified via `bunx tsc --noEmit` — only pre-existing errors in examples/, skills/, and a few api route files outside scope)
- Dev server compiles cleanly; `GET / 200` returned
