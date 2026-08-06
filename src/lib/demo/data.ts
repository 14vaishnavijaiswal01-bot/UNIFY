export type Cause =
  | "Education" | "Environment" | "Healthcare" | "Senior Citizens" | "Women Empowerment"
  | "Digital Literacy" | "Cybersecurity Awareness" | "Community Development" | "Animal Welfare"
  | "Sports" | "Arts & Culture" | "Volunteering" | "Social Causes";

export const CAUSES: Cause[] = [
  "Education", "Environment", "Healthcare", "Senior Citizens", "Women Empowerment",
  "Digital Literacy", "Cybersecurity Awareness", "Community Development", "Animal Welfare",
  "Sports", "Arts & Culture", "Volunteering", "Social Causes",
];

export const SKILLS = ["Leadership", "Communication", "Teamwork", "Event Management", "Cybersecurity Awareness", "Teaching", "Design", "Logistics", "First Aid", "Photography"];
export const AVAILABILITY = ["Weekdays", "Weekends", "Evenings", "Flexible"];
export const EVENT_TYPES = ["Workshop", "Drive", "Camp", "Awareness", "Fundraiser", "Cleanup", "Mentoring"];
export const CITIES = ["Mumbai", "Pune", "Bengaluru", "Delhi NCR", "Hyderabad"];

export type NgoPartner = { id: string; name: string; focus: Cause; beneficiaries: number; initiatives: number; verified: boolean; emoji: string };
export const NGOS: NgoPartner[] = [
  { id: "ngo-1", name: "Sahyog Foundation", focus: "Senior Citizens", beneficiaries: 1200, initiatives: 24, verified: true, emoji: "🧓" },
  { id: "ngo-2", name: "GreenRoots Collective", focus: "Environment", beneficiaries: 3400, initiatives: 41, verified: true, emoji: "🌱" },
  { id: "ngo-3", name: "Vidya Setu Trust", focus: "Education", beneficiaries: 2600, initiatives: 33, verified: true, emoji: "📚" },
];

export type CsrCompany = {
  id: string; name: string; industry: string; focus: Cause[]; budget: number; spent: number;
  employees: number; city: string; verified: boolean; logo: string; impactScore: number;
};
export const COMPANIES: CsrCompany[] = [
  { id: "csr-1", name: "Aether Technologies", industry: "IT Services", focus: ["Digital Literacy", "Cybersecurity Awareness", "Education"], budget: 5000000, spent: 3120000, employees: 4200, city: "Mumbai", verified: true, logo: "🟣", impactScore: 92 },
  { id: "csr-2", name: "Northwind Bank", industry: "BFSI", focus: ["Senior Citizens", "Digital Literacy", "Women Empowerment"], budget: 8000000, spent: 4600000, employees: 11000, city: "Mumbai", verified: true, logo: "🔵", impactScore: 88 },
  { id: "csr-3", name: "Verdant Pharma", industry: "Healthcare", focus: ["Healthcare", "Community Development"], budget: 3500000, spent: 1900000, employees: 2600, city: "Pune", verified: true, logo: "🟢", impactScore: 84 },
  { id: "csr-4", name: "Solstice Retail", industry: "Retail", focus: ["Environment", "Sports", "Volunteering"], budget: 2400000, spent: 900000, employees: 7300, city: "Bengaluru", verified: true, logo: "🟠", impactScore: 79 },
  { id: "csr-5", name: "Meridian Logistics", industry: "Logistics", focus: ["Community Development", "Animal Welfare"], budget: 1800000, spent: 640000, employees: 3100, city: "Delhi NCR", verified: true, logo: "🟡", impactScore: 74 },
];

export type EventManager = {
  id: string; name: string; verified: boolean; specializations: string[]; pastEvents: number;
  availability: string[]; cities: string[]; budgetMin: number; budgetMax: number; rating: number;
  teamSize: number; successRate: number; about: string; services: string[]; clients: string[];
  portfolio: { title: string; scale: string }[]; logo: string; revenue: number;
};
export const MANAGERS: EventManager[] = [
  { id: "em-1", name: "EventX Solutions", verified: true, specializations: ["CSR Events", "Community Events", "Volunteer Drives"], pastEvents: 128, availability: ["Aug 2026", "Sep 2026"], cities: ["Mumbai", "Pune"], budgetMin: 150000, budgetMax: 300000, rating: 4.8, teamSize: 24, successRate: 97, about: "A Mumbai-based experiential agency specialising in large-scale CSR and community programmes with on-ground volunteer coordination.", services: ["Event Setup", "User Management", "Logistics", "On-ground Coordination", "Documentation"], clients: ["Aether Technologies", "Northwind Bank"], portfolio: [{ title: "Digital Literacy Mela 2025", scale: "1,200 participants" }, { title: "Coastal Cleanup Drive", scale: "800 volunteers" }], logo: "🎯", revenue: 4820000 },
  { id: "em-2", name: "Kindle Experiences", verified: true, specializations: ["Workshops", "Education Camps"], pastEvents: 76, availability: ["Sep 2026"], cities: ["Mumbai", "Bengaluru"], budgetMin: 80000, budgetMax: 180000, rating: 4.6, teamSize: 12, successRate: 93, about: "Boutique studio running high-touch education and mentoring formats for schools and NGOs.", services: ["Curriculum Design", "Facilitators", "Logistics"], clients: ["Vidya Setu Trust"], portfolio: [{ title: "STEM For Her", scale: "400 students" }], logo: "🔶", revenue: 2140000 },
  { id: "em-3", name: "Grid & Co.", verified: true, specializations: ["Large Format", "Fundraisers"], pastEvents: 210, availability: ["Aug 2026", "Oct 2026"], cities: ["Mumbai", "Delhi NCR"], budgetMin: 400000, budgetMax: 1200000, rating: 4.9, teamSize: 55, successRate: 98, about: "Full-service production house for flagship CSR galas and city-wide fundraisers.", services: ["Production", "Branding", "Media", "Logistics"], clients: ["Northwind Bank", "Solstice Retail"], portfolio: [{ title: "Impact Summit 2025", scale: "3,000 attendees" }], logo: "⬛", revenue: 12400000 },
  { id: "em-4", name: "Sprout Collective", verified: true, specializations: ["Environment Drives", "Cleanups"], pastEvents: 54, availability: ["Aug 2026"], cities: ["Pune", "Bengaluru"], budgetMin: 60000, budgetMax: 150000, rating: 4.5, teamSize: 9, successRate: 91, about: "Green-first operators for plantation drives, cleanups and sustainability camps.", services: ["Site Recce", "Volunteer Ops", "Waste Management"], clients: ["Solstice Retail"], portfolio: [{ title: "10K Trees Pune", scale: "10,000 saplings" }], logo: "🟩", revenue: 1180000 },
  { id: "em-5", name: "Nimbus Events", verified: false, specializations: ["Health Camps", "Corporate Volunteering"], pastEvents: 38, availability: ["Sep 2026", "Oct 2026"], cities: ["Mumbai", "Hyderabad"], budgetMin: 120000, budgetMax: 260000, rating: 4.3, teamSize: 15, successRate: 88, about: "Health-camp specialists with medical partner network across western India.", services: ["Medical Partners", "Registration Desk", "Logistics"], clients: ["Verdant Pharma"], portfolio: [{ title: "Free Eye Camp Series", scale: "2,100 screenings" }], logo: "🔷", revenue: 960000 },
];

export type UnifyEvent = {
  id: string; title: string; cause: Cause; type: string; city: string; area: string; date: string;
  online: boolean; verified: boolean; organizer: string; ngoId?: string; csrId?: string; managerId?: string;
  participants: number; capacity: number; beneficiaryGoal: number; beneficiaries: number;
  fundingGoal: number; funded: number; impactScore: number; hours: number; emoji: string;
  about: string; popular: boolean;
};
export const EVENTS: UnifyEvent[] = [
  { id: "ev-1", title: "Digital Safety for Senior Citizens", cause: "Cybersecurity Awareness", type: "Workshop", city: "Mumbai", area: "Dadar", date: "2026-08-15", online: false, verified: true, organizer: "UNIFY x Sahyog Foundation", ngoId: "ngo-1", csrId: "csr-1", managerId: "em-1", participants: 72, capacity: 100, beneficiaryGoal: 500, beneficiaries: 320, fundingGoal: 200000, funded: 140000, impactScore: 92, hours: 4, emoji: "🛡️", about: "A community initiative helping senior citizens understand smartphones, UPI, online banking, digital safety and common cyber-fraud techniques.", popular: true },
  { id: "ev-2", title: "Coastal Cleanup: Versova Beach", cause: "Environment", type: "Cleanup", city: "Mumbai", area: "Versova", date: "2026-08-22", online: false, verified: true, organizer: "GreenRoots Collective", ngoId: "ngo-2", csrId: "csr-4", managerId: "em-4", participants: 180, capacity: 250, beneficiaryGoal: 1000, beneficiaries: 640, fundingGoal: 120000, funded: 96000, impactScore: 87, hours: 3, emoji: "🌊", about: "A morning shoreline cleanup with waste-segregation training and a plastic audit.", popular: true },
  { id: "ev-3", title: "Code Club for Municipal Schools", cause: "Education", type: "Mentoring", city: "Mumbai", area: "Kurla", date: "2026-08-29", online: false, verified: true, organizer: "Vidya Setu Trust", ngoId: "ngo-3", csrId: "csr-1", managerId: "em-2", participants: 44, capacity: 60, beneficiaryGoal: 300, beneficiaries: 150, fundingGoal: 180000, funded: 110000, impactScore: 85, hours: 5, emoji: "💻", about: "Weekend mentoring where volunteers teach block-based coding to grade 6-8 students.", popular: false },
  { id: "ev-4", title: "UPI & Fraud Awareness Camp", cause: "Digital Literacy", type: "Camp", city: "Mumbai", area: "Andheri", date: "2026-09-05", online: false, verified: true, organizer: "Northwind Bank CSR", csrId: "csr-2", managerId: "em-1", participants: 55, capacity: 120, beneficiaryGoal: 800, beneficiaries: 260, fundingGoal: 250000, funded: 250000, impactScore: 90, hours: 4, emoji: "📱", about: "Branch-led awareness camp on safe digital payments for first-time users.", popular: true },
  { id: "ev-5", title: "Women in Tech Mentorship Day", cause: "Women Empowerment", type: "Workshop", city: "Bengaluru", area: "Indiranagar", date: "2026-09-12", online: false, verified: true, organizer: "UNIFY Community", csrId: "csr-4", managerId: "em-2", participants: 90, capacity: 150, beneficiaryGoal: 400, beneficiaries: 120, fundingGoal: 300000, funded: 150000, impactScore: 83, hours: 6, emoji: "👩‍💻", about: "Speed-mentoring pairing early-career women with senior engineers and founders.", popular: false },
  { id: "ev-6", title: "Free Health Screening Drive", cause: "Healthcare", type: "Camp", city: "Pune", area: "Kothrud", date: "2026-09-19", online: false, verified: true, organizer: "Verdant Pharma CSR", csrId: "csr-3", managerId: "em-5", participants: 38, capacity: 80, beneficiaryGoal: 1200, beneficiaries: 420, fundingGoal: 400000, funded: 220000, impactScore: 81, hours: 7, emoji: "🩺", about: "Diabetes, BP and vision screenings with follow-up referrals for low-income households.", popular: false },
  { id: "ev-7", title: "Street Animal Care Weekend", cause: "Animal Welfare", type: "Drive", city: "Delhi NCR", area: "Saket", date: "2026-09-26", online: false, verified: true, organizer: "UNIFY Community", csrId: "csr-5", participants: 26, capacity: 60, beneficiaryGoal: 200, beneficiaries: 60, fundingGoal: 90000, funded: 30000, impactScore: 72, hours: 4, emoji: "🐾", about: "Feeding, vaccination support and adoption awareness across three neighbourhoods.", popular: false },
  { id: "ev-8", title: "Cyber Hygiene Webinar Series", cause: "Cybersecurity Awareness", type: "Awareness", city: "Mumbai", area: "Online", date: "2026-08-19", online: true, verified: true, organizer: "Aether Technologies CSR", csrId: "csr-1", participants: 210, capacity: 500, beneficiaryGoal: 2000, beneficiaries: 900, fundingGoal: 60000, funded: 60000, impactScore: 78, hours: 2, emoji: "🔐", about: "Three-part live series on passwords, phishing and safe social media for families.", popular: true },
  { id: "ev-9", title: "Community Sports Day", cause: "Sports", type: "Drive", city: "Mumbai", area: "Shivaji Park", date: "2026-10-03", online: false, verified: true, organizer: "UNIFY Community", managerId: "em-3", participants: 130, capacity: 300, beneficiaryGoal: 600, beneficiaries: 0, fundingGoal: 350000, funded: 80000, impactScore: 70, hours: 5, emoji: "🏏", about: "An inclusive sports carnival for children from shelter homes and local schools.", popular: false },
  { id: "ev-10", title: "Heritage Walk & Art Restoration", cause: "Arts & Culture", type: "Workshop", city: "Mumbai", area: "Fort", date: "2026-10-10", online: false, verified: true, organizer: "UNIFY x Sahyog Foundation", ngoId: "ngo-1", participants: 34, capacity: 70, beneficiaryGoal: 150, beneficiaries: 0, fundingGoal: 70000, funded: 15000, impactScore: 68, hours: 4, emoji: "🎨", about: "Guided heritage walk followed by a supervised mural restoration session.", popular: false },
];

export type BuddyUser = {
  id: string; name: string; avatar: string; city: string; age: string; verified: boolean;
  interests: Cause[]; skills: string[]; availability: string[]; eventsAttended: number;
  impactScore: number; bio: string; commonEvents: number;
};
export const USERS: BuddyUser[] = [
  { id: "u-1", name: "Riya Menon", avatar: "🧕", city: "Mumbai", age: "25-34", verified: true, interests: ["Cybersecurity Awareness", "Education", "Social Causes"], skills: ["Communication", "Teaching"], availability: ["Weekends"], eventsAttended: 14, impactScore: 780, bio: "Product designer who volunteers every other weekend.", commonEvents: 3 },
  { id: "u-2", name: "Arjun Shetty", avatar: "🧑🏽", city: "Mumbai", age: "25-34", verified: true, interests: ["Environment", "Sports", "Volunteering"], skills: ["Leadership", "Logistics"], availability: ["Weekends", "Evenings"], eventsAttended: 21, impactScore: 910, bio: "Runs a neighbourhood cleanup crew in Bandra.", commonEvents: 2 },
  { id: "u-3", name: "Fatima Sheikh", avatar: "👩🏽‍🏫", city: "Mumbai", age: "35-44", verified: true, interests: ["Education", "Women Empowerment", "Digital Literacy"], skills: ["Teaching", "Communication"], availability: ["Weekdays"], eventsAttended: 9, impactScore: 540, bio: "Teacher, mentors first-generation learners.", commonEvents: 2 },
  { id: "u-4", name: "Dev Patel", avatar: "🧑🏻‍💻", city: "Mumbai", age: "18-24", verified: false, interests: ["Cybersecurity Awareness", "Digital Literacy", "Senior Citizens"], skills: ["Cybersecurity Awareness", "Teamwork"], availability: ["Weekends"], eventsAttended: 5, impactScore: 320, bio: "CS student, loves teaching grandparents tech.", commonEvents: 3 },
  { id: "u-5", name: "Ananya Rao", avatar: "👩🏽", city: "Bengaluru", age: "25-34", verified: true, interests: ["Women Empowerment", "Arts & Culture"], skills: ["Design", "Photography"], availability: ["Flexible"], eventsAttended: 12, impactScore: 610, bio: "Illustrator documenting community stories.", commonEvents: 1 },
  { id: "u-6", name: "Kabir Nair", avatar: "🧔🏽", city: "Mumbai", age: "35-44", verified: true, interests: ["Healthcare", "Community Development"], skills: ["First Aid", "Leadership"], availability: ["Weekends"], eventsAttended: 18, impactScore: 720, bio: "Paramedic volunteering at health camps.", commonEvents: 1 },
  { id: "u-7", name: "Sneha Iyer", avatar: "👩🏻", city: "Pune", age: "18-24", verified: true, interests: ["Animal Welfare", "Environment"], skills: ["Teamwork", "Photography"], availability: ["Weekends"], eventsAttended: 7, impactScore: 400, bio: "Fosters rescue pups between semesters.", commonEvents: 1 },
  { id: "u-8", name: "Rohan Gupta", avatar: "🧑🏽‍🦱", city: "Delhi NCR", age: "25-34", verified: false, interests: ["Sports", "Community Development"], skills: ["Event Management"], availability: ["Evenings"], eventsAttended: 4, impactScore: 210, bio: "Organises street cricket leagues.", commonEvents: 0 },
  { id: "u-9", name: "Meera Joshi", avatar: "👩🏽‍⚕️", city: "Mumbai", age: "45+", verified: true, interests: ["Senior Citizens", "Healthcare", "Social Causes"], skills: ["First Aid", "Communication"], availability: ["Weekdays", "Weekends"], eventsAttended: 26, impactScore: 1040, bio: "Retired nurse, full-time community volunteer.", commonEvents: 2 },
  { id: "u-10", name: "Zoya Khan", avatar: "🧕🏽", city: "Mumbai", age: "18-24", verified: true, interests: ["Digital Literacy", "Education", "Cybersecurity Awareness"], skills: ["Teaching", "Design"], availability: ["Weekends"], eventsAttended: 11, impactScore: 590, bio: "Runs a digital literacy club at college.", commonEvents: 3 },
];

export type Opportunity = {
  id: string; title: string; csrId: string; city: string; date: string; expectedUsers: number;
  budget: number; services: string[]; status: "open" | "applied" | "accepted"; eventId?: string;
};
export const OPPORTUNITIES: Opportunity[] = [
  { id: "op-1", title: "CSR Digital Literacy Drive", csrId: "csr-1", city: "Mumbai", date: "2026-08-15", expectedUsers: 100, budget: 200000, services: ["Event Setup", "User Management", "Logistics", "On-ground Coordination"], status: "open", eventId: "ev-1" },
  { id: "op-2", title: "Northwind UPI Awareness Camp", csrId: "csr-2", city: "Mumbai", date: "2026-09-05", expectedUsers: 120, budget: 250000, services: ["Registration Desk", "Logistics", "Documentation"], status: "open", eventId: "ev-4" },
  { id: "op-3", title: "Verdant Health Screening Drive", csrId: "csr-3", city: "Pune", date: "2026-09-19", expectedUsers: 80, budget: 400000, services: ["Medical Partners", "Logistics", "Volunteer Ops"], status: "open", eventId: "ev-6" },
  { id: "op-4", title: "Solstice Green Weekend", csrId: "csr-4", city: "Bengaluru", date: "2026-09-12", expectedUsers: 150, budget: 300000, services: ["Site Recce", "Volunteer Ops", "Branding"], status: "applied", eventId: "ev-5" },
  { id: "op-5", title: "Meridian Community Sports Day", csrId: "csr-5", city: "Mumbai", date: "2026-10-03", expectedUsers: 300, budget: 350000, services: ["Production", "Logistics", "Media"], status: "accepted", eventId: "ev-9" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
export const byId = <T extends { id: string }>(arr: T[], id?: string) => arr.find((x) => x.id === id);
