
# UNIFY — Turning Empty Spaces into Shared Moments

A pastel, friendly, three-sided marketplace connecting Individuals, Event Managers, and Corporates around events in underused public spaces. Real backend (Lovable Cloud) with auth, database, and role-based dashboards.

## Design direction
- Palette: pastels — soft peach, mint, lavender, buttercream, sky blue, on warm off-white background. Rounded corners, generous whitespace, playful but trustworthy.
- Typography: distinctive display (e.g. Fraunces / DM Serif) + clean sans (Plus Jakarta Sans) — not Inter/Poppins.
- Motion: gentle fade/slide via Framer Motion on hero + card entrances.

## Roles & core flows

### Landing (public)
Hero explaining the "3-way bridge", three role cards, featured events, "how it works", CTA to sign up.

### Auth
Email + password + Google. On signup user picks a role (individual / manager / corporate). Role stored in `user_roles` table (separate from profile — never on profile).

### Individual dashboard `/app`
- "For You" location + interest feed of events
- Filters: cause, duration, location, date
- Event detail page → RSVP / book with pass
- "Looking for a Buddy" tag toggle on booking
- Suggest-a-Space form
- Impact tracker (events attended, hours) → pass credits
- Pass system (Free / Monthly Pass with N credits)
- Post-event feedback (event, venue, organizer, crowd ratings)
- Organizer profile pages with reviews
- Aadhaar verification stub (mock modal that flips `is_verified`)

### Event Manager dashboard `/manager`
- Profile: pricing, scale, specializations
- Incoming corporate match notifications
- Create/manage events, pick venue + slot from curated list
- View bookings + audience count
- Earnings/commission summary
- Toggle premium tier (visual only)

### Corporate dashboard `/corporate`
- CSR budget tracker (quarterly, 2% mandate helper)
- Browse & sponsor events (filter by cause)
- Self-serve: publish own event directly
- Choose engagement level (data-only / full-service)
- Audience analytics per sponsored event
- Downloadable ESG/Impact certificate (client-side PDF or printable page)
- Year-over-year impact chart

### Shared
- `/events` public browse, `/events/$id` detail, `/organizers/$id`, `/venues`
- Role-aware navbar, sign-out

## Data model (Lovable Cloud / Postgres)

```
app_role enum: individual | manager | corporate | admin
user_roles(user_id, role)
profiles(id, full_name, avatar_url, city, interests[], is_aadhaar_verified, buddy_mode)
manager_profiles(user_id, pricing_tier, scale, specializations[], is_premium)
corporate_profiles(user_id, company_name, csr_budget_quarter, industry, is_premium)
venues(id, name, type, address, lat, lng, capacity, is_public_space, suggested_by)
events(id, title, description, cause, duration_min, starts_at, venue_id, organizer_id, sponsor_id, capacity, price, cover_url, status)
bookings(id, event_id, user_id, looking_for_buddy, checked_in, created_at)
passes(id, user_id, credits_total, credits_used, valid_until)
feedback(id, event_id, user_id, event_rating, venue_rating, organizer_rating, crowd_rating, comment)
organizer_reviews(id, organizer_id, user_id, rating, comment)
space_suggestions(id, user_id, name, address, notes, status)
sponsorships(id, corporate_id, event_id, amount, engagement_level)
impact_log(id, user_id, event_id, hours, created_at)
```
All tables get `GRANT` + RLS. `has_role()` security-definer function for role checks.

## Tech notes
- TanStack Start file routes: `index`, `auth`, `_authenticated/app`, `_authenticated/manager`, `_authenticated/corporate`, `_authenticated/events/…`, plus public `events` browse.
- Server functions (`*.functions.ts`) for role-gated writes (create event, sponsor, feedback, redeem pass).
- Public reads (event list/detail) via publishable-key server client.
- Design tokens defined as pastel OKLCH in `src/styles.css` + `@theme inline`.
- Framer Motion for hero/section reveals; shadcn components restyled to pastel.
- SEO head per route; hero cover image generated for landing OG.

## Build order
1. Enable Lovable Cloud + auth (email/password + Google) + role picker.
2. Migration: enums, tables, RLS, grants, `has_role`, profile trigger.
3. Pastel design system + landing page + shared navbar.
4. Individual experience (feed, event detail, booking, buddy, passes, feedback, suggest-space, impact).
5. Manager experience (profile, event CRUD, bookings, earnings).
6. Corporate experience (CSR tracker, sponsor, self-publish, analytics, certificate).
7. Seed demo venues + events + organizers in the migration.
8. Polish: motion, empty states, verify build, sweep runtime errors.

I'll ship this in a few iterations, starting with Cloud + auth + schema + landing, then layering each role's dashboard.
