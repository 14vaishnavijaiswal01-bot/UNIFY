
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('individual', 'manager', 'corporate', 'admin');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.engagement_level AS ENUM ('data_only', 'venues_only', 'full_service');
CREATE TYPE public.suggestion_status AS ENUM ('pending', 'approved', 'rejected');

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  city text DEFAULT 'Mumbai',
  interests text[] DEFAULT ARRAY[]::text[],
  is_aadhaar_verified boolean NOT NULL DEFAULT false,
  buddy_mode boolean NOT NULL DEFAULT false,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles owner update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles owner insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ MANAGER PROFILES ============
CREATE TABLE public.manager_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  pricing_tier text DEFAULT 'standard',
  scale text DEFAULT 'small',
  specializations text[] DEFAULT ARRAY[]::text[],
  is_premium boolean NOT NULL DEFAULT false,
  rating numeric(3,2) DEFAULT 0,
  events_run int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.manager_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.manager_profiles TO authenticated;
GRANT ALL ON public.manager_profiles TO service_role;
ALTER TABLE public.manager_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp public read" ON public.manager_profiles FOR SELECT USING (true);
CREATE POLICY "mp owner write" ON public.manager_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ CORPORATE PROFILES ============
CREATE TABLE public.corporate_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT 'My Company',
  industry text,
  csr_budget_quarter numeric(12,2) DEFAULT 0,
  csr_spent_quarter numeric(12,2) DEFAULT 0,
  is_premium boolean NOT NULL DEFAULT false,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.corporate_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.corporate_profiles TO authenticated;
GRANT ALL ON public.corporate_profiles TO service_role;
ALTER TABLE public.corporate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp public read" ON public.corporate_profiles FOR SELECT USING (true);
CREATE POLICY "cp owner write" ON public.corporate_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ VENUES ============
CREATE TABLE public.venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'park',
  address text NOT NULL,
  neighborhood text,
  capacity int DEFAULT 50,
  is_public_space boolean NOT NULL DEFAULT true,
  suggested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.venues TO anon, authenticated;
GRANT INSERT ON public.venues TO authenticated;
GRANT ALL ON public.venues TO service_role;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "venues public read" ON public.venues FOR SELECT USING (true);
CREATE POLICY "venues authed insert" ON public.venues FOR INSERT TO authenticated WITH CHECK (auth.uid() = suggested_by);

-- ============ EVENTS ============
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cause text NOT NULL DEFAULT 'community',
  duration_min int NOT NULL DEFAULT 90,
  starts_at timestamptz NOT NULL,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sponsor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  capacity int NOT NULL DEFAULT 30,
  price numeric(10,2) NOT NULL DEFAULT 0,
  cover_emoji text DEFAULT '🌿',
  status public.event_status NOT NULL DEFAULT 'published',
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events organizer/sponsor write" ON public.events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = organizer_id OR auth.uid() = sponsor_id);
CREATE POLICY "events organizer/sponsor update" ON public.events FOR UPDATE TO authenticated
  USING (auth.uid() = organizer_id OR auth.uid() = sponsor_id);
CREATE POLICY "events organizer/sponsor delete" ON public.events FOR DELETE TO authenticated
  USING (auth.uid() = organizer_id OR auth.uid() = sponsor_id);

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  looking_for_buddy boolean NOT NULL DEFAULT false,
  checked_in boolean NOT NULL DEFAULT false,
  used_pass boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings owner read" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookings organizer read" ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id = auth.uid() OR e.sponsor_id = auth.uid())));
CREATE POLICY "bookings owner write" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings owner update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookings owner delete" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ PASSES ============
CREATE TABLE public.passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_total int NOT NULL DEFAULT 4,
  credits_used int NOT NULL DEFAULT 0,
  valid_until timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  tier text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.passes TO authenticated;
GRANT ALL ON public.passes TO service_role;
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "passes owner all" ON public.passes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ FEEDBACK ============
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_rating int NOT NULL,
  venue_rating int NOT NULL,
  organizer_rating int NOT NULL,
  crowd_rating int NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
GRANT SELECT ON public.feedback TO anon, authenticated;
GRANT INSERT, UPDATE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback public read" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "feedback owner write" ON public.feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feedback owner update" ON public.feedback FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============ ORGANIZER REVIEWS ============
CREATE TABLE public.organizer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organizer_reviews TO anon, authenticated;
GRANT INSERT ON public.organizer_reviews TO authenticated;
GRANT ALL ON public.organizer_reviews TO service_role;
ALTER TABLE public.organizer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org reviews public read" ON public.organizer_reviews FOR SELECT USING (true);
CREATE POLICY "org reviews owner insert" ON public.organizer_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ SPACE SUGGESTIONS ============
CREATE TABLE public.space_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  notes text,
  status public.suggestion_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.space_suggestions TO authenticated;
GRANT ALL ON public.space_suggestions TO service_role;
ALTER TABLE public.space_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suggestions owner read" ON public.space_suggestions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "suggestions owner insert" ON public.space_suggestions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ SPONSORSHIPS ============
CREATE TABLE public.sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  engagement_level public.engagement_level NOT NULL DEFAULT 'data_only',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (corporate_id, event_id)
);
GRANT SELECT, INSERT ON public.sponsorships TO authenticated;
GRANT ALL ON public.sponsorships TO service_role;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsorships public read" ON public.sponsorships FOR SELECT USING (true);
CREATE POLICY "sponsorships owner write" ON public.sponsorships FOR INSERT TO authenticated WITH CHECK (auth.uid() = corporate_id);
GRANT SELECT ON public.sponsorships TO anon;

-- ============ IMPACT LOG ============
CREATE TABLE public.impact_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  hours numeric(5,2) NOT NULL DEFAULT 1.5,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.impact_log TO authenticated;
GRANT ALL ON public.impact_log TO service_role;
ALTER TABLE public.impact_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "impact owner all" ON public.impact_log FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ SEED VENUES ============
INSERT INTO public.venues (id, name, type, address, neighborhood, capacity, is_public_space) VALUES
  (gen_random_uuid(), 'Shivaji Park', 'park', 'Shivaji Park, Dadar West', 'Dadar', 200, true),
  (gen_random_uuid(), 'Joggers Park', 'park', 'Carter Road, Bandra West', 'Bandra', 80, true),
  (gen_random_uuid(), 'Priyadarshini Park', 'park', 'Nepean Sea Road', 'Malabar Hill', 120, true),
  (gen_random_uuid(), 'Five Gardens', 'garden', 'Parsi Colony, Dadar East', 'Dadar East', 60, true),
  (gen_random_uuid(), 'Andheri Sports Complex Hall', 'community_hall', 'JP Road, Andheri West', 'Andheri', 100, true),
  (gen_random_uuid(), 'Powai Lakeside Promenade', 'promenade', 'Powai Lake', 'Powai', 150, true);

-- ============ SEED EVENTS ============
INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Sunrise Yoga & Chai', 'Start your Saturday with 45 minutes of gentle vinyasa followed by chai and conversations. Beginners welcome.', 'wellness', 90, now() + interval '3 days', v.id, 25, 0, '🧘', ARRAY['yoga','wellness','morning']
FROM public.venues v WHERE v.name = 'Shivaji Park' LIMIT 1;

INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Beach Cleanup Squad', 'Join 40 volunteers to clean a stretch of Bandra''s coastline. Gloves and bags provided.', 'environment', 120, now() + interval '5 days', v.id, 40, 0, '🌊', ARRAY['cleanup','volunteer','eco']
FROM public.venues v WHERE v.name = 'Joggers Park' LIMIT 1;

INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Storytelling Circle', 'A cozy evening of true stories from Mumbai locals. Bring one story, take home five.', 'community', 90, now() + interval '7 days', v.id, 30, 150, '📖', ARRAY['storytelling','community','evening']
FROM public.venues v WHERE v.name = 'Five Gardens' LIMIT 1;

INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Weekend Chess Meetup', 'All levels welcome. Bring a board if you have one — we''ll have a few spares.', 'community', 120, now() + interval '2 days', v.id, 20, 0, '♟️', ARRAY['chess','games','friendly']
FROM public.venues v WHERE v.name = 'Priyadarshini Park' LIMIT 1;

INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Beginner Watercolour Workshop', 'Two-hour intro to watercolours. Supplies included. Come as you are.', 'arts', 120, now() + interval '9 days', v.id, 15, 400, '🎨', ARRAY['art','workshop','creative']
FROM public.venues v WHERE v.name = 'Andheri Sports Complex Hall' LIMIT 1;

INSERT INTO public.events (title, description, cause, duration_min, starts_at, venue_id, capacity, price, cover_emoji, tags)
SELECT 'Powai Lakeside Sunset Run', '5K social run around Powai Lake, followed by fruit and cold coffee.', 'wellness', 75, now() + interval '4 days', v.id, 50, 0, '🏃', ARRAY['running','sunset','fitness']
FROM public.venues v WHERE v.name = 'Powai Lakeside Promenade' LIMIT 1;
