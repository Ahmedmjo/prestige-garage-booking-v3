# Task r5 — Premium Booking Selection Boxes + Smart Reminders Enhancement

## Scope
- Apply `.booking-select-box` (with `.selected` on active) to ALL selection boxes in `BookingScreen.tsx`
- Use `.premium-card` for form input containers, make labels `font-bold`
- Use `.reminder-alert-expired` / `.reminder-alert-soon` / `.reminder-alert-ok` CSS classes for reminder cards in `BookingsScreen.tsx`
- Bolder fonts throughout selection boxes
- Variant name displayed in reminder cards

## Files Modified
- `src/components/booking/BookingScreen.tsx`
- `src/components/booking/BookingsScreen.tsx`

## Files NOT Modified (per constraints)
- store.ts, types.ts, i18n.ts, api.ts, HomeScreen.tsx, globals.css, AdminDashboard.tsx, VariantSelector.tsx

## Changes

### BookingScreen.tsx
1. Service selection cards (step 0): `.booking-select-box` + `.selected`, name `font-bold`, duration `font-semibold`
2. Date selector buttons: `.booking-select-box` + `.selected`, bolder day/month text
3. Time slot buttons: `.booking-select-box` + `.selected`, disabled uses opacity
4. Car type selector (Sedan/SUV/Large SUV): `.booking-select-box` + `.selected`
5. Car brand SelectTrigger: `.booking-select-box` + `.selected`
6. Field component container: `.premium-card` (replaces glass-card), label `font-bold text-white/70`
7. Car type/brand span labels: `font-bold text-white/70`

### BookingsScreen.tsx
- ReminderCard: apply `.reminder-alert-expired` / `.reminder-alert-soon` / `.reminder-alert-ok` CSS classes
- Add variant name display in reminder card
- Show expiry date + days remaining more prominently
- Prominent bell icon (already there)
