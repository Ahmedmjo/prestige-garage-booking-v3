# Task ID: x3+x4 — Redesign Home Categories + Services Page + Offers Carousel

## Summary
- Added `OfferItem` type + store wiring (`loadOffers`) + carousel section on home
- Enhanced category cards with BIG 32x32 emoji badges (top-start corner) + fluorescent-border (neon per category color) + 28px brand badges (top-end corner)
- Redesigned services cards with `.service-card-carbon` + `.service-emoji-tile` (56x56) + `.fluorescent-border`; price in service color
- Drill-down variant screen: carbon-fiber panel + service-color-accented selected variant options
- Booking car type selector: `.car-type-box` + `.car-type-emoji` (32px) + `.car-type-label` with 🚗/🚙/🚐 emojis

## Files Modified
1. `src/lib/types.ts` — added `OfferItem` interface
2. `src/lib/store.ts` — added `offers`, `setOffers`, `loadOffers`
3. `src/app/page.tsx` — calls `loadOffers()` in main effect
4. `src/components/home/HomeScreen.tsx` — offers carousel + enhanced category cards
5. `src/components/services/ServicesScreen.tsx` — carbon-fiber service cards + emoji tiles + carbon-fiber variant panel
6. `src/components/booking/BookingScreen.tsx` — car-type-box selector (only that section)

## Constraints Honored
- DO NOT modify: api.ts, globals.css, AdminDashboard.tsx, BookingScreen.tsx (except car type section), prisma/
- Used existing CSS classes (offer-poster, carbon-fiber, fluorescent-border, service-card-carbon, service-emoji-tile, cat-card-premium, emoji-badge, car-type-box, car-type-emoji, car-type-label, variants-panel, variant-option)
- Inline style overrides for `.emoji-badge` size/position (since globals.css is read-only)
- Brand identity preserved (#DC143C red + pure black + soft color palette)
- Mobile-first, max-w-md, "use client" directives

## Verification
- `bun run lint`: 0 errors, 0 warnings
- `bunx tsc --noEmit`: 0 errors in modified files (pre-existing errors in api routes / examples / skills untouched)
- Dev server compiles cleanly; `/api/offers` returns 3 seeded offers with 200; `/` returns 200

## Emoji Mappings Used
- Categories: 🛡️ protection, 🌡️ thermal, ✨ detailing, 💎 polish, 🚿 wash, ⚙️ extra
- Car types: 🚗 Sedan, 🚙 SUV, 🚐 Large SUV
- Service icons: ICON_EMOJI map from types.ts (Shield→🛡️, Gem→💎, Crown→👑, Wind→🌡️, Sparkles→✨, Droplets→🚿, Car→🚗, etc.)

## Notes for Future Agents
- The `.emoji-badge` class default size is 20x20/11px font; my inline overrides (32x32/18px) must be preserved if anyone rewrites the HomeScreen
- The `.variant-option.selected` CSS is hardcoded to red — my inline style overrides with `color.ring` for service-color matching. If globals.css is ever updated to use a `--variant-neon` CSS var, the inline overrides can be removed.
- 3 sample offers seeded in DB (Summer Ceramic / Detailing Bundle / Free Premium Wash) — these are visible in the home carousel now. They can be deleted via admin Offers tab if not wanted.
