# Task f3 — Booking Flow + Customer Profile Redesign

## Scope
Redesign `BookingScreen.tsx` and `BookingsScreen.tsx` to add car type/brand selection,
inline Next button, smart reminders, and booking tracking lines (vertical on confirmation,
horizontal mini on each booking card).

## Changes Made

### `src/components/booking/BookingScreen.tsx`

**A. Car Type + Brand Selection (details step)**
- Added 3 square car-type buttons (Sedan / SUV / Large SUV) using Lucide `CarFront` icon.
  Selected button gets red border (`border-[#DC143C]`), red-tinted background, red glow shadow,
  and red-tinted icon container — matches reference screenshot pattern.
- Added car-brand dropdown using shadcn `Select` (`@/components/ui/select`).
  Brands fetched from `/api/car-brands` on mount; ~30 curated luxury + common Egyptian brands.
  Trigger gets red border when a brand is selected.
- Both appear in the details step BEFORE name/phone fields.
- `carType` and `carBrand` are now part of the booking POST body.
- `canNext` on the details step now requires both `carType` and `carBrand`.

**B. Inline "Next" for service selection (step 0)**
- When a service is selected at step 0, a full-width red gradient "Next" (التالي) button
  animates in immediately BELOW the selected-service card — no need to scroll past all
  services to find it.
- All services remain visible below for browsing.
- The bottom navigation area is hidden at step 0 (no duplicated Next button).

**C. Back button logic**
- The "السابق" (Back) button is visible at EVERY step except step 0 (service selection).
- At step 0, no Back button is shown — the user uses bottom nav to navigate away.
- Navigation buttons block is wrapped in `step > 0 && step < steps.length - 1`.

**D. Booking tracking line (confirmation screen)**
- Added a `VerticalTracker` component rendered below the booking summary on the confirmation page.
- 4 vertical stages with colored dots connected by a vertical line:
  1. قيد الانتظار (Pending) — yellow (#fbbf24)
  2. تم القبول (Accepted) — blue (#60a5fa)
  3. قيد التنفيذ (In Progress) — orange (#fb923c)
  4. مكتمل (Completed) — green (#4ade80)
- Current stage is larger (h-8 vs h-6) with a colored glow ring.
- Past stages show a checkmark icon in the dot.
- Future stages are dimmed gray.
- Connecting line uses gradient color transitions for past stages, gray for future.
- Cancelled status shows a red alert banner below the tracker.

**Type-safety cleanup**
- Removed all `as never` type casts on `t()` calls.
- Added `type T = (key: TranslationKey) => string` helper.
- `carType` state typed as `"sedan" | "suv" | "largeSuv" | null` for compile-time safety.

### `src/components/booking/BookingsScreen.tsx`

**A. Premium phone search**
- Phone input is now wrapped in a red-tinted `glass-card-red` container.
- Added a red gradient search button with shimmer effect.
- Phone icon now sits in a red-tinted square container.

**B. Mini horizontal tracking line per booking**
- Added `MiniTracker` component — 4 dots in a row (pending→accepted→in_progress→completed)
  connected by horizontal line segments.
- Current status dot is larger (h-4 vs h-2.5) with a colored glow ring.
- Past dots are full color; future dots are dimmed gray.
- Connecting line uses gradient color transitions.
- Status badge in the booking header now uses inline styles derived from `STAGE_COLORS`
  for all 4 statuses (consistent with the tracker — was previously using mismatched CSS classes).

**C. Smart Reminders section (top of page)**
- Section title: `t("smartReminders")` with a bell icon (Lucide `Bell`) that has a pulsing red dot.
- Shows count badge if there are reminders.
- For each booking with an `expiryDate`:
  - **Expired** (daysLeft < 0): red alert — "منتهي! احجز الآن لتجنب الضرر" + "احجز الآن" button
  - **Soon** (0–30 days): yellow alert — "ينتهي قريباً — X يوم متبقي" + "احجز الآن" button
  - **OK** (30+ days): green alert — "ساري — X يوم متبقي" (no button needed)
- Shows service name + formatted expiry date for each reminder.
- "Book Now" button preselects the booking's service and navigates to the booking tab.
- If no bookings have expiry dates, shows `t("noReminders")` empty state.
- Reminders are sorted by days-left ascending (most urgent first).

**D. Other enhancements**
- Each booking card now shows car-type and car-brand chips at the bottom (if set).
- Added `ExpiryBadge` component shown at the bottom of each booking card when `expiryDate` is set
  (mini inline pill — green/yellow/red based on remaining days).
- Booking count header: "حجوزاتك (N)".

## Files Modified
- `src/components/booking/BookingScreen.tsx` — full redesign of booking flow
- `src/components/booking/BookingsScreen.tsx` — full redesign with reminders + trackers

## Files NOT Modified (per constraints)
- `store.ts`, `types.ts`, `i18n.ts`, `api.ts`, `HomeScreen.tsx`, `AdminDashboard.tsx`, `globals.css`

## Verification
- `bun run lint`: 0 errors, 0 warnings in modified files
  (1 pre-existing error in `AdminDashboard.tsx` is from a previous agent's work and out of scope)
- `npx tsc --noEmit --skipLibCheck`: 0 errors in modified files
- Dev server compiles cleanly; `/api/car-brands` returns 200 with 30+ brands
- Page loads successfully at `/`
