
---
Task ID: v1-v10
Agent: main (variants feature)
Task: Add ServiceVariant system (Nano Ceramic 3/5/8y, Prestige Shield Crown/Elite/Luxury, Detailing as variants), accordion selector, admin variants management page, reset admin password, align colors to #DC143C.

Work Log:
- Added ServiceVariant Prisma model (id, serviceId, name, nameAr, price, duration, sortOrder, isActive) with cascade delete
- Added variantId/variantName to Booking model
- Reseeded: 12 services, 3 with variants (Detailing×5, Nano Ceramic×3, Prestige Shield×3 = 11 variants total)
- Updated types.ts: ServiceVariant interface, hasVariants/priceNote/color on ServiceItem, variantId/variantName on BookingItem, SOFT_COLORS map + softColor() helper
- Updated Zustand store: selectedVariant state + selectVariant action (resets on service change)
- API: services include variants; new /api/admin/services list route; new /api/admin/variants + /[id] CRUD routes; bookings POST accepts variantId
- Updated globals.css: --primary #DC143C, brand tokens aligned, .variants-panel + .variant-option.selected styles (red border + red-tint bg matching reference), soft color utilities
- Created VariantSelector accordion component (compact mode closes on select; full mode for booking step)
- Rewrote ServicesScreen: variant services show "اختر النوع" pill, inline accordion, book disabled until variant chosen, soft colors per category
- Rewrote BookingScreen: 5-step flow (service→variant→date→details→confirm) when hasVariants, summary shows chosen variant + correct price
- Updated BookingsScreen + Admin bookings to display variantName
- Added VariantsManager admin page (4th tab "الأنواع"): accordion list of variant services, inline edit price/name/duration, add/delete variants
- Updated AddServiceModal: color picker, hasVariants toggle, priceNote field
- Fixed AdminLogin stale-closure bug (pinRef) for rapid keypad taps
- Reset adminPin to "1234" in DB (was corrupted); fixed seed to force-update adminPin
- Aligned all colors across components: #e30613→#DC143C, #ff1f2c→#ff1f4a, #ff5a64→#ff4d6d

Stage Summary:
- Variants system fully functional: Detailing (مقصورة/سقف/جنوط/موتور/كامل), Nano Ceramic (٣/٥/٨ سنوات), Prestige Shield (Crown/Elite/Luxury)
- Variant selection pattern matches reference: tap pill → options expand → select highlights in red → menu closes → continue booking
- Admin Variants page: full CRUD (add/edit/delete variant prices) — everything controllable
- Admin credentials: username=admin, password=prestige2024, PIN=1234
- Lint: 0 errors, 0 warnings. Browser-verified end-to-end booking with variant + admin price edit.

---
Task ID: r1-r9
Agent: main (refinement round)
Task: Customer DB, i18n language toggle, remove home glow, strong red, compact side menu, services drill-down, About/Contact page replication, luxury backgrounds, admin customers page.

Work Log:
- Added Customer Prisma model (name, phone[unique], carModel, carPlate, bookingsCount, lastVisit)
- Booking POST now upserts customer automatically (saves name/phone/car/plate, increments bookingsCount)
- New /api/admin/customers route (GET with search, DELETE)
- New CustomersManager admin tab (5th tab "العملاء"): customer cards with avatar, phone, car, plate, booking count, WhatsApp/Call/Delete actions, live search
- i18n system: translations dictionary (src/lib/i18n.ts) with 60+ keys (AR/EN), lang state in Zustand store (persisted), useT()/useLang()/useLangEffect() hooks, language toggle pill in Header + NavMenu
- Home: removed logo glow (glow=false), strong red gradient bg (bg-home-strong), luxury-overlay, i18n labels
- Side menu redesigned: compact rounded drawer-item-compact with emoji icons (🏠📅🔍🛠️📋🏢📞📤), language toggle in header, version footer
- Services drill-down: tapping a variant service navigates to dedicated DrillDownVariantScreen showing ONLY that service's variants on black bg with category tint — no other services visible (clean, not cluttered), radio-style selection, back button
- About page: hero card (crown + PRESTIGE GARAGE + description + SONAX AUTHORIZED DEALER gold badge) + 2x2 value props grid (🇩🇪/🏆/🛡️/⭐) + partners card (SONAX + Made in Germany + AUTHORIZED DEALER red pill) — matches reference exactly
- Contact page: garage info card (🏢 + Prestige Garage + Authorized SONAX partner + hours 10AM-12AM + 14 Hours Daily) + 2x2 contact grid (Call red/WhatsApp green/Location blue/Email yellow) + red "Open in Google Maps" button + social row (Instagram pink/Twitter blue/Snapchat yellow/TikTok white) — matches reference exactly
- Luxury car backgrounds per category: cat-bg-detailing (purple), cat-bg-wash (blue), cat-bg-protection (green), cat-bg-polish (yellow), cat-bg-extra (orange) — dark gradients with category-tinted glow
- CSS: variant-screen, drawer-compact, value-prop, contact-card-2x2, lang-toggle classes added

Stage Summary:
- Customer DB: auto-saves on every booking, full CRUD in admin
- i18n: AR/EN toggle works across all screens (persisted)
- Home: NO glow (as requested), strong red on black
- Side menu: compact 9/10 design (not square/clunky), emoji icons
- Services drill-down: clean focused variant screen, no clutter
- About + Contact pages: pixel-match to reference screenshots
- Lint: 0 errors. Browser-verified all flows.

---
Task ID: u1-u8
Agent: main (refinement round 2)
Task: Polish 3 stages, Solid tier, reorder categories, slot capacity system (wash=2, hide past, admin control), smoother animations, new extras.

Work Log:
- Reordered categories: protection → thermal → detailig → polish → wash → extra (added "thermal" as own category)
- Reseeded 16 services:
  - Protection: Nano Ceramic (3/5/8y), Prestige Shield (Crown/Elite/Luxury), Solid (new highest tier, 75000 EGP, Gem icon)
  - Thermal: Thermal Insulation (standalone)
  - Detailing: 5 variants (interior/roof/wheels/motor/full)
  - Polish: 3 variants (مرحلة واحدة/مرحلتين/ثلاث مراحل)
  - Wash: غسيل كامل، تنظيف داخلي، غسيل خارجي
  - Extras (7): فابريك كوتينج، إزالة قطران وجير، بلاك إديشن، دي كرومينج، نانو سيراميك فايبر، بوليش PPF، دوكو كامل
- Added Gem icon to ServiceIcon + admin icon picker
- Slot capacity system:
  - New /api/slots endpoint: returns available slots with remaining capacity per date+category
  - Hides past times for today automatically
  - Wash category = washSlotCapacity (default 2 cars/slot), others = slotCapacity (default 1)
  - Wash and non-wash tracked independently at same time slot
  - Booking POST enforces capacity (returns 409 with Arabic message when full)
- Admin settings: new "تحكم المواعيد والسعة" section with enable/disable toggle + wash/other capacity inputs
- New settings: slotCapacity, washSlotCapacity, slotControlEnabled (all admin-controllable)
- BookingScreen: fetches live slots, shows green badges with remaining count, disables full slots, shows "2 cars/slot" indicator for wash
- Smoother animations:
  - Page transitions: spring physics (stiffness 380, damping 32, mass 0.7) with subtle scale
  - Custom Drawer component replaces Sheet: spring slide (stiffness 320, damping 34) with overlay fade
- Fixed BookingScreen crash: added missing useT/useLang imports for i18n in slot rendering

Stage Summary:
- 16 services in exact requested order with all new items (Solid, 3-stage Polish, 7 extras)
- Slot system: wash=2 cars, others=1, past times hidden, admin can toggle/control/disable
- Verified: wash booking at 10:00 reduced capacity 2→1; detailing at 10:00 stayed 1/1 (independent)
- Smoother page + menu animations (spring physics)
- Lint: 0 errors. Browser-verified all flows.

---
Task ID: f2
Agent: redesign-agent (home screen + logo animation)
Task: Redesign home screen — bigger animated logo, smaller book button, premium trust badges, remove Detailing section, luxurious category grid with inner shadows + corner badges (SONAX/crown), new branches section, artistic premium contact card, pure-black background.

Work Log:
- src/app/globals.css:
  - Updated `.bg-home-strong` base color from `#050505` → `#000000` (pure black)
  - Added `@keyframes logo-float` (translateY 0→-6→0 + rotate -2deg→2deg→-2deg, 4s ease-in-out infinite)
  - Added `.logo-lively` utility (applies logo-float animation, transform-origin center, will-change transform)
  - Added `.cat-card-inner-shadow` utility (inset 0 0 20px rgba(255,255,255,0.04) base — overridden per-card with category-tinted shadow via inline style)
- src/components/brand/Logo.tsx:
  - Added `lively?: boolean` prop to `BrandCrown` interface
  - When `lively` is true, applies `logo-lively` CSS class to the wrapper div (in addition to / instead of glow) — coexists with `glow` since glow is on the inner Image (filter) and lively is on the wrapper (transform)
- src/components/home/HomeScreen.tsx (full rewrite):
  - Hero logo: size 140 (was 116), wrapped in framer-motion `motion.div` with continuous `y:[0,-6,0]` + `rotate:[-2,2,-2]` animation (4s infinite ease-in-out). Title text-xl (was text-3xl).
  - Book Now button: py-3 text-sm (was py-4 text-base). Crown icon 18 (was 20).
  - Trust badges (3 cards): replaced lucide icons with SonaxBadge size 28 (badge 1: "ضمان SONAX"/"SONAX Warranty"), 🏆 emoji text-2xl (badge 2: "احترافي"/"Professional"), ⚡ emoji text-2xl (badge 3: "في الموعد"/"On Time").
  - REMOVED entire Detailing highlight section (glass-card-red with "قسم الديتيلنج" + "استكشف باقات الديتيلنج" button) — deleted whole block.
  - Categories grid redesigned: each card has `cat-bg-{cat}` tint + `cat-card-inner-shadow` class + inline `boxShadow: inset 0 0 20px {softColor(catKey).bg}` for category-tinted inner shadow. Corner badge (absolute top-2 end-2): BrandCrown size 16 glow=false for premium cats (protection, thermal); SonaxBadge size 16 for SONAX cats (detailing, wash, polish, extra). Uses `softColor()` from types.ts with CAT_COLOR_KEY mapping (protection→green, thermal→orange, detailing→purple, polish→yellow, wash→blue, extra→orange).
  - NEW Branches section: title `t("ourBranches")`, horizontally scrollable (no-scrollbar, overflow-x-auto) cards (260px wide each), each with Building2 icon in red neon-border chip + branch name + address (line-clamp-2) + phone (tel link) + "Visit Branch" pill (links to mapUrl). Only renders if activeBranches.length > 0.
  - Bottom contact section redesigned as premium artistic card: gradient backdrop (red→black→black→red), 2 decorative blurred radial glows (red top-right + gold bottom-left), SVG diagonal-line pattern overlay (opacity 0.08), header row with crown + "تواصل معنا"/"Get in Touch" + gold divider. Three info rows (working hours / call / address) each as rounded-2xl bg-white/[0.04] backdrop-blur card with red-tinted icon chip (9x9 grid, DC143C/15 bg).

Constraints honored:
- Did NOT modify store.ts, types.ts, i18n.ts, api.ts, BookingScreen.tsx, AdminDashboard.tsx
- Did NOT create new files (only edited 3 existing files: globals.css, Logo.tsx, HomeScreen.tsx)
- Used existing useT(), useLang(), useApp(), useSettings() hooks
- Brand identity preserved: black + #DC143C red + gold accents
- Responsive (max-w-md container, mobile-first), grid-cols-2/3 + horizontal scroll for branches
- "use client" directive kept on HomeScreen and Logo
- 0 TypeScript errors. Lint: 0 errors (1 pre-existing warning in BookingScreen.tsx outside scope).

Stage Summary:
- Home screen fully redesigned per spec: bigger lively floating crown logo, smaller book button, premium SONAX/🏆/⚡ trust badges, removed Detailing section, luxurious tinted category grid with corner SONAX/crown badges + inner shadows, new horizontally-scrollable branches section, premium artistic gradient contact card with decorative shapes.
- Pure black (#000000) home background.
- Lint clean, dev server compiling successfully.

---
Task ID: f4
Agent: main (admin dashboard redesign)
Task: Redesign Admin Dashboard — booking workflow with progress bar, branches tab, services table view, working hours control.

Work Log:
- Added 6th tab "الفروع" (Branches) to admin dashboard with MapPin icon; updated tab bar to grid-cols-6 with smaller text (8.5px) and tighter icons (15px)
- Imported shadcn Table components (Table, TableHeader, TableBody, TableHead, TableRow, TableCell) for the services table view
- Imported new lucide icons: MapPin, Building, List, Table, Play, CalendarClock, ExternalLink, Pencil
- Imported new API functions: adminUpdateBookingExpiry, adminFetchBranches, adminCreateBranch, adminUpdateBranch, adminDeleteBranch
- Imported workflowProgress() helper from types.ts

A. Booking Workflow with Progress Bar:
- Rewrote BookingsManager to use full workflow (pending → accepted → in_progress → completed | cancelled)
- Created WorkflowProgress component showing 4 horizontal segments colored by stage:
  - pending (gold #d4af37), accepted (blue #60a5fa), in_progress (orange #fb923c), completed (green #4ade80)
  - Current stage filled + glowing, past stages dimmed (80% opacity), future stages gray
  - Cancelled status shows inline "✗ تم الإلغاء" badge instead of progress bar
- Created statusPillClass() helper for status badges (inline styles since globals.css can't be modified)
- Action buttons per status:
  - pending: "قبول" (blue, accept) + "رفض" (red, cancel)
  - accepted: "بدء التنفيذ" (orange, start)
  - in_progress: "إكمال" (green, complete)
  - completed: "✓ مكتمل" badge + "تحديد تاريخ الانتهاء" button (opens date input → calls adminUpdateBookingExpiry)
  - cancelled: "ملغي" badge
- Added updatingId state to show inline spinner during status transitions
- Showed car type, car brand, branch name (with MapPin icon) in booking card
- Showed acceptedAt, completedAt, expiryDate timestamps when present
- Added pending count banner ("لديك X حجز بانتظار القبول") when there are pending bookings
- Updated filter pills to: all, pending, accepted, in_progress, completed, cancelled
- Revenue stat now uses Arabic number formatting (toLocaleString("ar-EG"))

B. Branches Management (new tab):
- Created BranchesManager component with full CRUD
- Branch card shows: MapPin icon, nameAr + name (English), addressAr, phone (with Phone icon), active badge, mapUrl link (ExternalLink icon)
- Inline edit mode for all fields: nameAr, name, addressAr, address, phone, mapUrl + isActive toggle
- AddBranchModal (bottom sheet) with all fields + textarea for addresses
- Stats: total branches, active branches
- Empty state CTA when no branches exist

C. Services Table View:
- Added view toggle at top of ServicesManager: "قائمة" (List) vs "جدول" (Table) with red active state
- Added sort selector for table view: "حسب القسم" (by category) or "الأحدث" (newest)
- Created ServicesTableView component:
  - Grouped by category view: each category in its own glass-card with colored header (matches softColor palette: protection=green, thermal=orange, detailing=purple, polish=yellow, wash=blue, extra=gray)
  - Columns: Service (with icon + name + createdAt date), Price (Arabic formatted), Duration, Active (green/gray dot), Actions (edit/toggle/delete)
  - Summary row per category: total value, total duration, active count / total count
  - Newest view: flat table sorted by createdAt desc, shows category in subtitle
- Used type extension `ServiceItem & { createdAt?: string }` to access createdAt (returned by API but not in TS type)

D. Working Hours Control (Settings tab):
- Added "مواعيد العمل" section ABOVE the slot capacity section
- Open hour selector: 8/9/10/11/12 (auto-updates openTime too as "HH:00")
- Close hour selector: 18/19/20/21/22/23/24 (24 shown as "12:00 ص منتصف الليل", auto-updates closeTime)
- Working days text inputs: Arabic (workingDaysAr) + English (workingDays)
- Used CalendarClock icon for section header

E. Tab Bar Update:
- 6 tabs in grid-cols-6: Services (Tags), Variants (Layers), Bookings (CalendarDays), Customers (Users), Branches (MapPin), Settings (SettingsIcon)
- Smaller text (8.5px), smaller icons (15px), narrower active underline (w-8)

Cleanup:
- Removed unused imports: TrendingUp, ChevronLeft, WORKFLOW_STEPS
- Removed setLoading(true) inside BookingsManager effect (was triggering react-hooks/set-state-in-effect error)

Stage Summary:
- Booking workflow: full 4-stage progress bar with colored segments, status-aware action buttons, expiry date editor for completed bookings
- Branches: complete CRUD with add/edit/delete/toggle + mapUrl integration
- Services table view: grouped by category with summary rows, plus newest-first flat view
- Working hours: admin-controllable open/close hours + working days
- 6 tabs cleanly fit on mobile (max-w-md, grid-cols-6, 8.5px labels)
- Lint: 0 errors, 0 warnings. TypeScript: 0 errors in AdminDashboard.tsx (pre-existing errors in other files unchanged).

---
Task ID: f3
Agent: booking-flow-agent (booking + customer profile redesign)
Task: Redesign booking flow with car type+brand selection, inline Next button, Back button logic, vertical booking tracker on confirmation; redesign My Bookings as customer profile with mini horizontal tracker per booking, smart reminders section, premium phone search.

Work Log:
- src/components/booking/BookingScreen.tsx (full redesign):
  A. Car Type + Brand Selection (details step, BEFORE name/phone fields):
    - 3 square car-type buttons (Sedan / SUV / Large SUV) with Lucide CarFront icon — selected gets red border (#DC143C) + red-tint bg + red glow shadow + red-tinted icon container (matches reference screenshot pattern)
    - Car-brand dropdown using shadcn Select component (@/components/ui/select); brands fetched from /api/car-brands on mount (~30 curated luxury + common Egyptian brands). Trigger gets red border when brand selected.
    - carType state typed as "sedan" | "suv" | "largeSuv" | null for compile-time safety
    - Both fields added to booking POST body; canNext on details step requires both carType && carBrand
  B. Inline "Next" for service selection (step 0):
    - When a service is selected, a full-width red gradient "Next" (التالي) button animates in IMMEDIATELY BELOW the selected-service card (motion fade-up). User does NOT need to scroll past all services.
    - All services remain visible below for browsing.
    - Bottom navigation area is hidden at step 0 (no duplicated Next button).
  C. Back button logic:
    - "السابق" (Back) button visible at EVERY step except step 0 (service selection).
    - At step 0, no Back button — user navigates away via bottom nav.
    - Navigation buttons block wrapped in `step > 0 && step < steps.length - 1`.
  D. Booking tracking line (confirmation screen):
    - Added VerticalTracker component below booking summary.
    - 4 vertical stages with colored dots connected by vertical line:
      1. قيد الانتظار (Pending) — yellow #fbbf24
      2. تم القبول (Accepted) — blue #60a5fa
      3. قيد التنفيذ (In Progress) — orange #fb923c
      4. مكتمل (Completed) — green #4ade80
    - Current stage: larger (h-8 vs h-6) + colored glow ring (4px halo).
    - Past stages: checkmark icon in dot, full color.
    - Future stages: dimmed gray, smaller.
    - Connecting line uses gradient color transitions for past stages, gray for future.
    - Cancelled status shows red alert banner below tracker.
  Type-safety cleanup: removed all `as never` casts on t() calls; added `type T = (key: TranslationKey) => string` helper; carType state narrowly typed.

- src/components/booking/BookingsScreen.tsx (full redesign as customer profile):
  A. Premium phone search:
    - Wrapped in red-tinted glass-card-red container with red gradient search button (shimmer effect).
    - Phone icon sits in red-tinted square chip.
  B. Mini horizontal tracking line per booking:
    - MiniTracker component: 4 dots in a row (pending→accepted→in_progress→completed) connected by horizontal line segments.
    - Current dot: larger (h-4 vs h-2.5) + colored glow ring.
    - Past dots full color, future dots dimmed gray.
    - Connecting line uses gradient transitions for past stages.
    - Status badge in booking header now uses inline styles from STAGE_COLORS for all 4 statuses (consistent with tracker — was previously using mismatched CSS classes for completed/cancelled).
  C. Smart Reminders section (top of page, before bookings list):
    - Title: t("smartReminders") with Lucide Bell icon (pulsing red dot).
    - Count badge if there are reminders.
    - For each booking with expiryDate:
      - Expired (daysLeft<0): red alert — "منتهي! احجز الآن لتجنب الضرر" + "احجز الآن" button
      - Soon (0–30 days): yellow alert — "ينتهي قريباً — X يوم متبقي" + "احجز الآن" button
      - OK (30+ days): green alert — "ساري — X يوم متبقي" (no button needed)
    - Shows service name + formatted expiry date for each reminder.
    - "Book Now" button preselects the booking's service via selectService() and navigates to booking tab.
    - Empty state shows t("noReminders") if no bookings have expiry dates.
    - Reminders sorted by days-left ascending (most urgent first).
  D. Other enhancements:
    - Each booking card shows car-type and car-brand chips at bottom (if set).
    - ExpiryBadge component at bottom of each booking card when expiryDate is set (mini inline pill — green/yellow/red based on remaining days).
    - Booking count header: "حجوزاتك (N)".

Constraints honored:
- Did NOT modify: store.ts, types.ts, i18n.ts, api.ts, HomeScreen.tsx, AdminDashboard.tsx, globals.css
- Used existing shadcn Select component from @/components/ui/select
- Used useT() and useLang() for all user-facing text
- Brand identity preserved: black + #DC143C red
- Mobile-first, max-w-md container
- "use client" directive on both files

Stage Summary:
- Booking flow: car type + brand selection required, inline Next button right under selected service, Back button on all steps except step 0, beautiful vertical 4-stage tracker on confirmation (yellow→blue→orange→green dots with glow).
- Customer profile: premium phone search, smart reminders section at top (red/yellow/green alerts based on expiry), mini horizontal tracker per booking with consistent colored status badges, car-type/brand chips, expiry badges.
- Lint: 0 errors, 0 warnings in modified files (1 pre-existing error in AdminDashboard.tsx is from a previous agent's work and out of scope).
- TypeScript: 0 errors in modified files.
- Dev server compiles cleanly; /api/car-brands returns 200 with 30+ brands; page loads successfully at /.

---
Task ID: f1-f7 (Final Round)
Agent: main + 3 subagents (f2, f3, f4)
Task: Comprehensive refinement — home redesign, booking flow, admin workflow, branches, smart reminders, i18n, services table, working hours

Work Log (main agent - foundation):
- Added Branch model to Prisma (name, nameAr, address, phone, mapUrl, isActive, sortOrder)
- Added booking workflow fields: carType, carBrand, branchId, acceptedAt, inProgressAt, completedAt, expiryDate
- Updated BookingStatus type: pending → accepted → in_progress → completed | cancelled
- Added WORKFLOW_STEPS + workflowProgress() helper
- Created API routes: /api/branches (public), /api/admin/branches (CRUD), /api/car-brands, /api/admin/bookings (list)
- Updated bookings POST to accept carType/carBrand/branchId + customer upsert saves them
- Updated admin bookings PUT to set workflow timestamps automatically + accept expiryDate
- Updated slots API to use admin-controllable openHour/closeHour from settings
- Added 3 branches to seed (New Cairo, Sheikh Zayed, Maadi)
- Added working hours settings (openHour, closeHour, openTime, closeTime, workingDays)
- Added 50+ i18n keys for car selection, tracking, reminders, branches, admin workflow
- Added branches state + loadBranches to Zustand store
- Added branch + customer API helpers to client api.ts

Subagent f2 (Home redesign):
- Logo: size 140 + lively float animation (translateY + rotate)
- Smaller PRESTIGE GARAGE text (text-xl)
- Smaller book button (py-3 text-sm)
- Trust badges: SONAX badge + 🏆 + ⚡
- Removed detailing section box
- Categories: inner shadow + corner badges (SONAX for wash/detailing/polish/extra, Crown for protection/thermal)
- New branches section (horizontally scrollable cards)
- Artistic bottom contact section (gradient + decorative glows + SVG pattern)
- Pure black background (#000000)

Subagent f3 (Booking flow + customer profile):
- Car type selector (Sedan/SUV/Large SUV) with red border on selected
- Car brand dropdown (fetches from /api/car-brands, ~30 brands)
- Inline Next button below selected service (not at page bottom)
- Back button at every step except step 0
- Vertical tracking line on confirmation (4 colored stages)
- Mini horizontal tracker per booking in profile
- Smart reminders section (expired/soon/ok alerts based on expiryDate)

Subagent f4 (Admin dashboard):
- Booking workflow: pending→accepted→in_progress→completed with horizontal progress bar
- Action buttons: Accept/Reject → Start → Complete + Set Expiry Date
- 6th tab: Branches management (full CRUD)
- Services table view (grouped by category, columns, summary rows)
- Working hours control in settings (open/close hour selectors)
- Updated 6-tab layout

Stage Summary:
- All requested features implemented and browser-verified
- Home: bigger animated logo, smaller text, no detailing box, artistic sections, pure black, branches
- Booking: car dropdowns, inline next, back button, vertical tracking line
- Customer profile: smart reminders + mini tracking per booking
- Admin: workflow progress bar with accept/start/complete, branches CRUD, services table, working hours
- i18n: English pages fully English
- Lint: 0 errors

---
Task ID: r3+r4
Agent: redesign-agent (splash + home premium + admin bell)
Task: Redesign splash screen with cinematic inside-out logo animation, redesign home screen with premium visual enhancements (bigger badges, emoji badges, glow circles, premium cards), and add notification bell to admin dashboard.

Work Log:
- src/app/page.tsx (SPLASH SCREEN):
  - Increased splash duration: 1500ms -> 2800ms
  - Enlarged crown logo: 130 -> 160 (with glow={false})
  - Replaced framer-motion scale animation with CSS `.splash-logo-cinematic` class — emerges from center small + blurred (scale 0.3, blur 8px) expanding outward to full size (1.8s cubic-bezier), then continuous gentle float (3s ease-in-out infinite starting at 1.8s)
  - Applied `.splash-title-glow` to the "PRESTIGE GARAGE" h1 — animates letter-spacing from 0.5em -> 0.2em with opacity fade-in (starts at 0.8s)
  - Applied `.splash-tagline-rise` to the "Born in Germany. Mastered in Egypt." tagline — rises from bottom (translateY 40px -> 0) over 1.2s starting at 1.2s delay
  - Removed unused framer-motion wrappers from splash (animation now CSS-driven)
  - Kept "use client", AnimatePresence/motion still used for customer app page transitions

- src/components/home/HomeScreen.tsx (HOME SCREEN):
  - Trust badges: replaced `glass-card` with `.premium-card` class on all 3 cards. Added inline `--card-accent` CSS var (red for SONAX+warranty badges, gold for the trophy badge). Bigger icons: SonaxBadge size 26 inside `.service-badge-large` wrapper (28px container with border + shadow), 🏆 and ⚡ emojis upgraded from text-2xl to text-3xl. More padding (py-4 vs py-3.5), more gap (gap-2 vs gap-1.5).
  - Categories grid: replaced `glass-card cat-card-inner-shadow` with `.cat-card-premium` class. Set inline `--cat-tint` (softColor bg) and `--cat-accent` (softColor ring) CSS vars per category. Kept `cat-bg-${cat}` for category radial gradient backgrounds. Inset tint glow now driven by `--cat-tint` variable.
  - Corner brand badges enlarged from 16px -> 24px:
    - Premium categories (protection, thermal): BrandCrown size 24 (was 16), glow={false}
    - SONAX categories (detailing, wash, polish, extra): SonaxBadge size 24 (was 16) wrapped in `.service-badge-large` div (28px container with border + shadow)
  - Added emoji badges to category cards: `.emoji-badge` class on a `<span>` placed in the corner with the category emoji (🛡️ protection, 🌡️ thermal, ✨ detailing, 💎 polish, 🚿 wash, ⚙️ extra). Set inline `--badge-bg` (rgba(0,0,0,0.85)) and `--badge-ring` (softColor ring per category) CSS vars so the emoji badge ring matches the category's soft color.
  - Branch cards: replaced `glass-card` with `.premium-card` class (with `--card-accent: rgba(168,85,247,0.3)` for purple hover accent). Replaced Building2 icon container (red neon-border chip) with a `.glow-circle` (44x44px h-11 w-11) wrapping MapPin icon — purple glow via inline `--glow-color: rgba(168,85,247,0.4)` and `--glow-bg: rgba(168,85,247,0.08)`. Icon color #c084fc (purple-400).
  - Contact section icons (clock/phone/map-pin): replaced square `bg-[#DC143C]/15` chips with `.glow-circle` (44x44px h-11 w-11) using category-specific glow colors via inline CSS vars:
    - Clock (working hours): gold/amber glow — `--glow-color: rgba(245,158,11,0.4)`, `--glow-bg: rgba(245,158,11,0.08)`, icon color #fbbf24
    - Phone (call): red glow — `--glow-color: rgba(220,20,60,0.4)`, `--glow-bg: rgba(220,20,60,0.08)`, icon color #ff4d6d
    - Map pin (address): blue glow — `--glow-color: rgba(59,130,246,0.4)`, `--glow-bg: rgba(59,130,246,0.08)`, icon color #60a5fa
    - All icons upgraded from size 16 to size 18

- src/components/admin/AdminDashboard.tsx (ADMIN NOTIFICATION BELL):
  - Added `Bell` icon to lucide-react imports
  - Created `NotificationBell` component (placed above ServicesManager):
    - State: `count` (pending bookings since lastSeen), `seen` (whether bell has been clicked before — lazy-initialized from localStorage to avoid synchronous setState in effect)
    - On mount: reads `adminNotificationsLastSeen` from localStorage (lazy init for `seen`), then fetches count via GET `/api/admin/notifications?lastSeen=ISO` with `x-admin-pin` header. Polls every 30 seconds via setInterval.
    - handleClick: calls `onOpenBookings()` (navigates to bookings tab), then PUT `/api/admin/notifications` to mark seen (server stores lastSeen in DB). On success, stores lastSeen in localStorage, sets `seen=true`, sets `count=0`.
    - Visual states:
      - count > 0 (new pending bookings): renders `.notification-badge` (red, pulsing) with count (or "99+" if > 99)
      - count === 0 && seen (previously opened): renders `.notification-dot-green` (small green dot indicating "opened/caught up")
      - count === 0 && !seen (initial, never clicked): no badge/dot shown
    - Uses `.notification-bell` class for hover scale animation
  - Placed NotificationBell in admin header next to the logout button (wrapped both in a flex gap-2 container)

Constraints honored:
- Only modified the 3 allowed files: src/app/page.tsx, src/components/home/HomeScreen.tsx, src/components/admin/AdminDashboard.tsx
- Did NOT modify: store.ts, types.ts, i18n.ts, api.ts, BookingScreen.tsx, globals.css
- Used existing CSS classes from globals.css (splash-logo-cinematic, splash-tagline-rise, splash-title-glow, glow-circle, premium-card, cat-card-premium, emoji-badge, service-badge-large, notification-bell, notification-badge, notification-dot-green) — no new CSS classes added
- Brand identity preserved: black + #DC143C red + gold accents + soft color palette per category
- Mobile-first, max-w-md container, "use client" directive on all 3 files
- Used existing useT(), useLang(), useApp(), useSettings() hooks
- API requests use relative paths only (no absolute URLs)
- Inline fetch calls for notifications API (couldn't add to api.ts since it's read-only) — used same x-admin-pin header pattern as other admin calls

Stage Summary:
- Splash: 2.8s cinematic inside-out logo reveal (small+blurred -> full size with cubic-bezier easing) + tagline rises from bottom (1.2s delay) + title letter-spacing glow (0.8s delay). Bigger 160px crown, NO glow (animation provides visual interest).
- Home: premium-card trust badges with bigger SONAX/trophy/lightning icons, category cards now use cat-card-premium with --cat-tint inner glow + emoji badges in corner (🛡️🌡️✨💎🚿⚙️) using category soft color ring, larger 24px SONAX/crown corner badges (service-badge-large wrapper for SONAX), glow-circle (44x44) for contact icons (gold clock / red phone / blue map pin) and purple glow-circle MapPin for branch cards.
- Admin: notification bell in header (left of logout button) — polls /api/admin/notifications every 30s, shows red pulsing badge with count when new pending bookings exist, switches to green dot after bell is clicked (marks seen via PUT + localStorage). Clicking the bell also navigates to the Bookings tab.
- Lint: 0 errors, 0 warnings. TypeScript: 0 errors. Dev server compiling successfully.

---
Task ID: r5
Agent: redesign-agent (premium booking boxes + smart reminders enhancement)
Task: Redesign ALL booking selection boxes with premium visual styling (booking-select-box class + selected state + bolder fonts + colored shadows) and enhance Smart Reminders section in BookingsScreen with the new CSS classes (reminder-alert-expired/soon/ok), variant name display, and prominent bell icon.

Work Log:

### `src/components/booking/BookingScreen.tsx` — applied premium `.booking-select-box` styling to all selection boxes:

1. **Service selection cards (step 0)**:
   - Replaced inline `border/bg/rounded-2xl/transition` with `booking-select-box` class + `selected` when active (now uses CSS-driven 14px radius, 1.5px border, gradient bg, premium transition, colored shadow on hover/selected)
   - Service name bumped from `font-semibold` → `font-bold` (text-white)
   - Duration/options text bumped from no weight → `font-semibold` (text-white/55)
   - Price bumped from `font-bold` → `font-extrabold` (text-[#ff4d6d])

2. **Date selector buttons**:
   - Replaced inline border/bg/transition with `booking-select-box` + `selected`
   - Day label bumped `font-semibold` → `font-bold`, color opacity bumped `/45` → `/55`
   - Day number kept `font-extrabold`, color opacity bumped `/80` → `/85`
   - Month label bumped from no weight → `font-semibold`, color `/40` → `/50`

3. **Time slot buttons**:
   - Replaced `slot-selected/slot-available/slot-disabled` with `booking-select-box` + `selected` (red gradient + colored glow on selected)
   - Disabled slots use `opacity-40 cursor-not-allowed` (booking-select-box base still applied)
   - Kept the green capacity badge logic
   - Active slot explicitly sets `text-white`

4. **Car type selector (Sedan/SUV/Large SUV)**:
   - Replaced inline border/bg/shadow/transition with `booking-select-box` + `selected`
   - Label bumped already `font-bold` — color opacity `/55` → `/60` when inactive

5. **Car brand SelectTrigger** (shadcn Select):
   - Applied `booking-select-box h-12 w-full px-3.5 text-sm font-bold` (booking-select-box overrides default trigger border/bg/radius/shadow)
   - Adds `selected text-white` when carBrand chosen, `text-white/50` placeholder color when not
   - SelectItem items bumped to `font-semibold`

6. **Field component (form input containers)**:
   - Container: replaced `glass-card rounded-xl` with `premium-card px-3.5 py-3` (premium gradient bg, subtle border, premium shadow, hover lift)
   - Added `transition-all focus-within:border-[#DC143C]/60 focus-within:!translate-y-0` so focus state shows red border and disables the hover lift (input focus shouldn't cause layout shift)
   - Label bumped from `font-semibold text-white/55` → `font-bold text-white/70`

7. **Car type & Car brand span labels** (above selectors):
   - Both bumped from `font-semibold text-white/55` → `font-bold text-white/70`

### `src/components/booking/BookingsScreen.tsx` — Smart Reminders enhancement:

1. **ReminderCard component — full rewrite**:
   - Uses the new CSS classes from globals.css:
     - expired → `.reminder-alert-expired` (red gradient + border + inset glow)
     - soon → `.reminder-alert-soon` (yellow gradient + border + inset glow)
     - ok → `.reminder-alert-ok` (green gradient + border + inset glow)
   - Removed all inline `background/border` styles on the card container (now driven by CSS classes)
   - Icon container enlarged from h-9 w-9 → h-10 w-10 with `bg + border` colored per level (red/yellow/green tints)
   - Title bumped `font-bold` → `font-extrabold`, color-coded per level (#f87171 / #fbbf24 / #4ade80)
   - **NEW: Variant name displayed** alongside service name with Tag icon in red — `font-bold text-[#ff4d6d]`
   - Service name bumped `font-semibold text-white/80` → `font-bold text-white`
   - Expiry date + days remaining shown in dedicated row with color-coded days text (matches level color)
   - Days-remaining text now shows `منتهي منذ X يوم` / `Expired Xd ago` for past-expiry reminders (clearer messaging)
   - "Book Now" button bumped `font-bold` → `font-extrabold`, kept red gradient + shimmer

2. **Smart Reminders section header — more prominent bell icon**:
   - Bell icon now wrapped in a 32×32 rounded red-tinted chip (`bg-[#DC143C]/15 border border-[#DC143C]/30`)
   - Pulsing dot enlarged from h-1.5 w-1.5 → h-2 w-2 for visibility on the chip
   - Section title kept `font-extrabold text-white`
   - Count badge kept (red pill)

Constraints honored:
- Only modified: `src/components/booking/BookingScreen.tsx`, `src/components/booking/BookingsScreen.tsx`
- Did NOT modify: store.ts, types.ts, i18n.ts, api.ts, HomeScreen.tsx, AdminDashboard.tsx, globals.css, VariantSelector.tsx
- Used existing CSS classes from globals.css (booking-select-box, booking-select-box.selected, premium-card, reminder-alert-expired, reminder-alert-soon, reminder-alert-ok) — no new CSS classes added
- Brand identity preserved: black + #DC143C red + color-coded alerts (red/yellow/green for reminders)
- Mobile-first, max-w-md container, "use client" directive on both files
- Used existing useT(), useLang(), useApp() hooks

Stage Summary:
- Booking flow: ALL selection boxes (service cards, date buttons, time slots, car type, car brand dropdown, form fields) now use premium `.booking-select-box` (or `.premium-card` for form fields) styling with bolder fonts (font-bold/extrabold) and colored red glow shadows on selected state.
- Customer profile: Smart Reminders cards now use the proper CSS classes (reminder-alert-expired/soon/ok) for color-coded backgrounds with inset glow + matching borders. Each reminder shows service name + variant + expiry date + days remaining (with proper "expired X days ago" messaging for past dates). Section header has a prominent bell icon in a red-tinted chip with pulsing dot.
- Variant name is already `font-bold` via the existing `.variant-name` CSS rule (font-weight: 700) — no change needed in VariantSelector.tsx.
- Lint: 0 errors, 0 warnings. TypeScript: 0 errors in modified files (pre-existing errors in api routes / examples / skills unchanged).
- Dev server compiles cleanly; page loads at / with 200.


---
Task ID: x6
Agent: x6-admin-agent (admin offers + reports + branch media)
Task: Add 7th "عروض" (Offers) management tab, 8th "تقارير" (Reports) tab with daily/monthly/financial report tables, and image/video media support for branches (stored as JSON in the existing mapUrl field).

Work Log:

### src/components/admin/AdminDashboard.tsx — single file modified

**A. Offers Management Tab (NEW 7th tab):**
- Imports: added `Percent, BarChart, Tag, Image as ImageIcon, Video, TrendingUp, Wallet, CalendarRange` from lucide-react + `adminFetchOffers, adminCreateOffer, adminUpdateOffer, adminDeleteOffer, adminFetchReport` from `@/lib/api`
- Extended `Tab` union with `"offers"` and `"reports"`
- Tab bar: `grid-cols-6` → `grid-cols-8`, icon size 15→14, text 8.5px→8px, indicator bar w-8→w-6 (so all 8 fit on mobile)
- Added "العروض" tab with Percent icon, "التقارير" tab with BarChart icon
- Added `<OffersManager pin={adminPin} />` and `<ReportsManager pin={adminPin} />` routing in main
- `OfferItem` type defined (matches Prisma Offer model fields)
- `OffersManager` component:
  - Header banner + 2 Stat cards (total/active)
  - "إضافة عرض جديد" dashed red button
  - Offer cards with: Tag icon chip, AR/EN title, active badge + expired/upcoming badges, description (line-clamped), image thumbnail (h-28), discount pill (red), old→new price pill (green), date range pill
  - Edit/Toggle/Delete buttons per offer
  - Inline edit form with all 11 fields in compact 2/3-col grid
  - `AddOfferModal` bottom-sheet (defaults today → +30 days)
- Uses all 4 offer API helpers

**B. Reports Tab (NEW 8th tab):**
- `ReportsManager` component:
  - 3-mode toggle (daily/monthly/financial) with red gradient active
  - Native `<input type="date">` (daily) or `<input type="month">` (monthly/financial) picker
  - Auto-fetches on mount + on mode/date/month change (with `react-hooks/set-state-in-effect` disable)
  - 4 summary cards: total bookings, total revenue (green with ج.م suffix + red ring), completed count (green), pending count (yellow)
  - **Daily**: `.report-table` with ref / customer(+time) / service(+variant) / price / status pill (color-coded: completed=green, pending=yellow, accepted=blue, in_progress=orange, cancelled=red)
  - **Monthly**: 2 tables — by date (date/count/revenue), by service (name/count/revenue)
  - **Financial**: 2 tables — by category (label/count/revenue/average using `CATEGORY_LABELS[cat].ar`), all completed bookings (ref/customer/service/date/revenue + tfoot total). Bookings table is `max-h-96 overflow-y-auto` with sticky header.
  - Money formatter: `Math.round(n).toLocaleString("en-US")`
- Uses `adminFetchReport(pin, mode, params)`

**C. Branch Media Support:**
- Added 2 helper functions before `BranchesManager`:
  - `parseBranchMedia(mapUrl)` → `{ map, image, video }`. Tries JSON.parse first; falls back to plain map URL.
  - `packBranchMedia(map, image, video)` → JSON string if media present, else plain map URL or null. Backward compatible with existing branches.
- Extended `editing` state shape with `imageUrl` and `videoUrl` fields
- `startEdit()` parses existing mapUrl to populate the three fields
- `save()` packs them back via `packBranchMedia()` before sending
- Edit form: added "ميديا الفرع (اختياري)" section (ImageIcon header) with imageUrl + videoUrl inputs + live image preview thumbnail (h-20) + video preview link
- Branch card display:
  - If image media → image thumbnail (h-24) at top
  - If only video → "فيديو مرفق" placeholder + "تشغيل الفيديو" red link strip
  - If both → image + red video link strip
  - "Open map" button now extracts the map URL from JSON via `parseBranchMedia(b.mapUrl).map`
- `AddBranchModal` form state extended with `imageUrl` + `videoUrl`
- `AddBranchModal` submit packs via `packBranchMedia()` before sending
- `AddBranchModal` UI: "ميديا الفرع (اختياري)" section with 2 Input components + live image preview

Constraints honored:
- ONLY modified `src/components/admin/AdminDashboard.tsx`
- Did NOT modify: store.ts, types.ts, i18n.ts, api.ts, globals.css, HomeScreen.tsx, BookingScreen.tsx, ServicesScreen.tsx, page.tsx, prisma/
- Used existing shadcn/ui Table component + `.report-table` CSS class from globals.css
- Brand identity preserved: black + #DC143C red
- Mobile-first, max-w-md container, "use client" directive
- All API requests use relative paths only

Stage Summary:
- Admin now has 8 tabs: Services, Variants, Bookings, Customers, Branches, Offers, Reports, Settings
- Offers: full CRUD with image, discount, old/new price, date range, active toggle, expired/upcoming badges
- Reports: 3 view modes with summary cards + .report-table tables (daily bookings, monthly by-date/by-service, financial by-category/completed bookings with totals)
- Branches: media support added (imageUrl + videoUrl stored as JSON in existing mapUrl field) — backward compatible with plain map URLs, image thumbnail + video link shown in admin cards, and image preview in edit form
- Lint: 0 errors, 1 warning (pre-existing in HomeScreen.tsx, out of scope)
- TypeScript: 0 errors in modified file
- Dev server compiles cleanly; GET / 200 returned

---
Task ID: x3+x4
Agent: redesign-agent (offers + categories + services + car types)
Task: Add offers carousel to home, enhance category cards (bigger emoji badges + fluorescent border), redesign services page with carbon-fiber cards + emoji tiles, and replace booking car type selector with big-emoji car-type-box.

Work Log:

### A. Offers Store Integration
- `src/lib/types.ts` — added `OfferItem` interface: `{ id, title, titleAr, description, descriptionAr, imageUrl, discountPct, oldPrice, newPrice, startDate, endDate, isActive }`
- `src/lib/store.ts` — added `offers: OfferItem[]`, `setOffers`, `loadOffers` (fetches `/api/offers`) to the Zustand store
- `src/app/page.tsx` — added `loadOffers` call in the main `useEffect` alongside `loadServices`, `loadSettings`, `loadBranches`

### B. Home Screen (`src/components/home/HomeScreen.tsx`)
1. **Offers Carousel (NEW section after CTA buttons, before trust badges):**
   - Title: `t("specialOffers")` with a `Sparkles` icon (red)
   - Horizontal scrollable carousel of `.offer-poster` cards (no-scrollbar)
   - Each poster shows:
     - Title (Arabic if lang=ar)
     - Description (lang-aware, line-clamped to 2)
     - Discount % badge (top-end corner, red gradient pill with Tag icon)
     - Old price (strikethrough) + New price (red, bold) row at bottom
     - Optional `imageUrl` as background (45% opacity, object-cover)
   - Section only renders when `offers.length > 0` (filters to `isActive` only)
   - Imports: added `Sparkles`, `Tag` from lucide-react

2. **Category Cards Enhancement:**
   - BIG emoji badge using `.emoji-badge` class with inline overrides:
     - `width: 32px`, `height: 32px`, `fontSize: 18px` (overrides default 20/20/11px)
     - Moved to TOP-START corner (top-right in Arabic RTL — matches task spec) via `bottom: auto, top: 8px, insetInlineEnd: auto, insetInlineStart: 8px`
     - Emoji from `CATEGORY_EMOJI[cat]` (imported from types.ts — removed duplicate `CAT_EMOJI` constant)
   - Applied `.fluorescent-border` to each card with neon matching category color:
     - `--neon-color`, `--neon-glow`, `--neon-bright` set from `softColor(cat).ring/bg`
   - Brand badges (SONAX / Prestige crown) kept in TOP-END corner, enlarged to 28px (was 24px)
   - Card now has `pt-14` padding-top to clear the 32px emoji badge + 8px gap

### C. Services Page (`src/components/services/ServicesScreen.tsx`)

1. **Service cards redesigned with carbon-fiber texture:**
   - Each card uses `.service-card-carbon .fluorescent-border` classes
   - CSS vars: `--card-tint`, `--card-neon`, `--card-neon-bright`, `--neon-color`, `--neon-glow`, `--neon-bright` (all from `softColor(s.color)`)
   - Replaced old icon slab with LARGE `.service-emoji-tile` (56x56):
     - CSS vars `--tile-bg`, `--tile-ring`, `--tile-glow` from service's soft color
     - Emoji from `ICON_EMOJI[s.icon]` with fallback to `CATEGORY_EMOJI[s.category]`
     - Inline `fontSize: 28px, lineHeight: 1` for the emoji span (overrides default)
   - Card padding bumped to `p-4` (was `p-3.5 pl-2`), gap-3 between tile and content
   - Service name kept `font-bold`, price now uses `style={{ color: color.icon }}` (category color, was hardcoded `text-[#ff4d6d]`)
   - Removed unused imports: `AnimatePresence`, `Crown`, `ServiceIcon` (replaced by emoji tiles)

2. **Drill-down variant screen:**
   - Hero header icon replaced with bigger `.service-emoji-tile` (72x72, font-size 36px) using the service's emoji
   - Variants panel container now has `.carbon-fiber` background class
   - Selected variant options override `.variant-option.selected` inline with service color:
     - `borderColor: color.ring`
     - `background: linear-gradient(135deg, color.bg 0%, rgba(0,0,0,0.2) 100%)`
     - `boxShadow: 0 0 0 1px color.ring, 0 0 14px color.ring, inset 0 0 12px color.bg`
   - Selected radio dot border now uses `color.icon` (service color) instead of hardcoded red
   - Variant price text color uses `color.icon` (was always red)

### D. Booking Car Type Icons (`src/components/booking/BookingScreen.tsx`)

- Updated `CAR_TYPES` constant: replaced `icon: CarFront` (Lucide icon) with `emoji: "🚗"` / `"🚙"` / `"🚐"` per type
- Replaced `booking-select-box` car type buttons with `.car-type-box` class:
  - `.car-type-emoji` (32px font-size) renders the car emoji prominently
  - `.car-type-label` (12px font-bold) shows the type label
- Removed the inner icon container (no longer needed — emoji is the visual)
- Only modified the car type selector section; rest of BookingScreen untouched

Constraints honored:
- DID NOT modify: api.ts, globals.css, AdminDashboard.tsx, BookingScreen.tsx (except car type section), prisma/ schema, i18n.ts (already had needed keys)
- Used existing CSS classes: `.offer-poster`, `.carbon-fiber`, `.fluorescent-border`, `.service-card-carbon`, `.service-emoji-tile`, `.cat-card-premium`, `.emoji-badge`, `.car-type-box`, `.car-type-emoji`, `.car-type-label`, `.variants-panel`, `.variant-option`
- Inline style overrides for `.emoji-badge` size + position (can't modify globals.css)
- Brand identity preserved: #DC143C red, pure black, soft color palette per category
- Mobile-first, max-w-md container, "use client" directive on all 3 modified screens
- Used existing useT(), useLang(), useApp(), useSettings() hooks
- API requests use relative paths only

Stage Summary:
- Offers: full pipeline working — `OfferItem` type, `loadOffers` in store, called from page.tsx, carousel renders posters with discount badge + old/new price + optional bg image; hidden when no offers
- Categories: BIG 32x32 emoji badge in top-start corner (top-right in Arabic), 28px brand badge in top-end corner, fluorescent border with neon tint per category color
- Services: carbon-fiber cards with large 56x56 emoji tiles (icon-based emoji with category fallback), price in service color, fluorescent border with neon tint, carbon-fiber variants panel with service-color-accented selected state
- Booking car types: 3 car-type-box buttons with big 32px emojis (🚗 Sedan / 🚙 SUV / 🚐 Large SUV) and font-bold labels — clearly clickable + visible
- Seeded 3 sample offers via Prisma to verify carousel renders correctly
- Lint: 0 errors, 0 warnings
- TypeScript: 0 errors in modified files
- Dev server compiles cleanly; /api/offers returns 200 with 3 offers; / returns 200


---
Task ID: x1-x8 (Final Refinement Round)
Agent: main + 2 subagents (x3+x4, x6)
Task: Fix page transitions, WhatsApp links, home emoji+fluorescent borders, services carbon-fiber cards, booking car type icons, admin offers+reports+branch media, PWA readiness

Work Log (main agent):
- Fixed page transition jankiness: replaced spring physics with simple 0.2s fade (opacity only) — much smoother
- Fixed WhatsApp links: created /lib/phone.ts with normalizePhone() that converts Egyptian 01xxxxxxxxx → 201xxxxxxxxx format for wa.me. Updated all wa.me links in ContactScreen, BookingScreen, AdminDashboard to use waLink()/telLink() helpers
- Added Offer Prisma model (title, titleAr, description, imageUrl, discountPct, oldPrice, newPrice, startDate, endDate, isActive)
- Created API routes: /api/offers (public GET), /api/admin/offers (CRUD), /api/admin/report (daily/monthly/financial with grouping by service/category/date)
- Added offers + report API helpers to client api.ts
- Added CATEGORY_EMOJI + ICON_EMOJI maps to types.ts
- Added 20+ i18n keys for offers, reports, dates
- Added CSS: .carbon-fiber, .fluorescent-border, .offer-poster, .service-card-carbon, .service-emoji-tile, .car-type-box, .report-table
- Fixed ServicesScreen default category: protection (was detailing which showed only 1 service)

Subagent x3+x4 (Home + Services + Offers):
- Added OfferItem type + offers state to store + loadOffers in page.tsx
- Home: offers carousel with .offer-poster banners (3 seeded offers)
- Home: category cards with BIG emoji badges (32px, CATEGORY_EMOJI), fluorescent borders with inner glow, 28px SONAX/Prestige corner badges
- Services: .service-card-carbon + .fluorescent-border with per-service color CSS vars, .service-emoji-tile (56x56, 28px emoji from ICON_EMOJI)
- Drill-down: carbon-fiber variant panel, service-color neon on selected variant
- Booking car types: .car-type-box with emoji (🚗🚙🚐) + .car-type-label

Subagent x6 (Admin Offers + Reports + Branch Media):
- Offers tab (7th): full CRUD with offer cards (title, discount, prices, dates, active toggle, edit/delete)
- Reports tab (8th): daily/monthly/financial views with date/month picker, summary cards (bookings, revenue, completed, pending), report tables grouped by service/category/date
- Branch media: parseBranchMedia/packBranchMedia for image+video URLs stored as JSON in mapUrl field, media preview in branch cards + edit form

Stage Summary:
- Page transitions: smooth fade, no jank
- WhatsApp: links now use 20XXXXXXXXXXX format (works without country code error)
- Home: offers carousel + big emoji badges + fluorescent neon borders + enlarged logos
- Services: carbon-fiber texture + big emoji tiles + colored fluorescent borders
- Admin: 8 tabs (Services, Variants, Bookings, Customers, Branches, Offers, Reports, Settings)
- Reports: date-based grouping (daily/monthly/financial) with revenue totals
- Offers: admin can create promotional poster banners shown on home carousel
- Branch media: supports image + video URLs
- Lint: 0 errors. Browser-verified all flows.
