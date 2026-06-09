# Hindi Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating EN/हिं toggle to the Homentor frontend that switches all UI text between English and Hindi, persisted in localStorage.

**Architecture:** A `LanguageContext` provides `lang` state and a `t(key)` helper globally via `LanguageProvider` in `main.tsx`. All strings live in a single `src/translations/index.ts` file namespaced by page/section. A floating `LanguageToggle` pill button in the bottom-right corner is mounted once in `Layout.tsx` and `DashboardLayout.tsx`.

**Tech Stack:** React Context API, TypeScript, Tailwind CSS (no new dependencies)

---

## File Map

| Action | File |
|--------|------|
| Create | `src/context/LanguageContext.tsx` |
| Create | `src/translations/index.ts` |
| Create | `src/components/LanguageToggle.tsx` |
| Modify | `src/main.tsx` |
| Modify | `src/components/Layout.tsx` |
| Modify | `src/components/DashboardLayout.tsx` |
| Modify | `src/components/Navbar.tsx` |
| Modify | `src/components/HeroSection.tsx` |
| Modify | `src/components/sections/HowItWorksSection.tsx` |
| Modify | `src/components/sections/FeaturesSection.tsx` |
| Modify | `src/components/sections/ComparisonSection.tsx` |
| Modify | `src/components/sections/FinalCTASection.tsx` |
| Modify | `src/components/sections/FeaturedMentorsSection.tsx` |
| Modify | `src/components/FAQSection.tsx` |
| Modify | `src/pages/Index.tsx` |
| Modify | `src/pages/Mentors.tsx` |
| Modify | `src/pages/ForMentors.tsx` |
| Modify | `src/pages/AboutUs.tsx` |
| Modify | `src/pages/ContactUs.tsx` |
| Modify | `src/pages/Login.tsx` |
| Modify | `src/pages/Signup.tsx` |
| Modify | `src/pages/MentorDashboard.tsx` |
| Modify | `src/pages/MentorBookingsPage.tsx` |
| Modify | `src/pages/MentorSchedule.tsx` |
| Modify | `src/pages/MentorLeads.tsx` |
| Modify | `src/pages/MentorEarnings.tsx` |
| Modify | `src/pages/MentorStudents.tsx` |
| Modify | `src/pages/StudentDashboard.tsx` |
| Modify | `src/pages/ParentBookingsPage.tsx` |
| Modify | `src/pages/StudentClasses.tsx` |
| Modify | `src/pages/StudentPayments.tsx` |
| Modify | `src/pages/StudentProfile.tsx` |

---

## Task 1: Language infrastructure — Context + Translations + main.tsx

**Files:**
- Create: `src/context/LanguageContext.tsx`
- Create: `src/translations/index.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create `src/translations/index.ts`**

```ts
export const translations = {
  en: {
    nav: {
      findTutors: "Find Tutors",
      forMentors: "For Mentors",
      about: "About",
      contact: "Contact",
      login: "Log in",
      joinAsMentor: "Join as Mentor",
      freeDemo: "Free demo",
      home: "Home",
      parentDashboard: "Parent Dashboard",
      mentorDashboard: "Mentor Dashboard",
      browseTutors: "Browse All",
      mathematics: "Mathematics",
      physics: "Physics",
      english: "English",
      onlineTutoring: "Online Tutoring",
    },
    hero: {
      badge: "Now booking demos for this week",
      headline1: "Your child",
      headline2: "deserves a",
      headlineAccent: "mentor",
      headline3: "not just a",
      headline4: "teacher.",
      subtext: "Get matched with verified, hand-picked home tutors who craft a plan around your child's pace, exam dates and weak topics.",
      subtextHighlight: "Free demo · 100% refund on the first session.",
      findMentor: "Find a Mentor",
      howItWorks: "How it works",
      trustedBy: "Trusted by parents across India",
      verified: "100% Verified",
      refund: "100% Refund",
      activeKids: "Active Kids",
    },
    home: {
      howItWorksLabel: "How it works",
      howItWorksHeading: "Three steps from \"we need a tutor\" to your child's first class",
      step1Title: "Tell us about your child",
      step1Body: "Share your child's class, subject and what you're hoping to achieve. Takes 60 seconds.",
      step2Title: "Get matched with a verified mentor",
      step2Body: "We hand-pick mentors based on your area, budget and goals. You see profiles and ratings before you decide.",
      step3Title: "Start with a free demo",
      step3Body: "Book a free demo class first. If it's not the right fit, we refund your first session — no questions asked.",
      bookFreeDemo: "Book a Free Demo",
      featuredMentorsLabel: "Our Mentors",
      featuredMentorsHeading: "Meet hand-picked mentors",
      featuredMentorsSubheading: "Every mentor is background-verified and rated by parents.",
      viewAllMentors: "View all mentors",
      faqTitle: "Frequently asked questions",
      ctaHeading: "Ready to find the right mentor?",
      ctaSubheading: "Join thousands of parents who trust Homentor.",
      ctaButton: "Book a Free Demo",
    },
    mentors: {
      pageTitle: "Find a Mentor",
      searchPlaceholder: "Search by name, subject, city…",
      filterSubject: "Subject",
      filterClass: "Class",
      filterMode: "Mode",
      filterState: "State",
      filterCity: "City",
      filterArea: "Area",
      filterBudget: "Monthly Budget",
      modeOnline: "Online",
      modeOffline: "Home Tuition",
      modeBoth: "Both",
      allSubjects: "All Subjects",
      allClasses: "All Classes",
      allStates: "All States",
      allCities: "All Cities",
      allAreas: "All Areas",
      resetFilters: "Reset Filters",
      noMentorsFound: "No mentors found",
      tryAdjusting: "Try adjusting your filters",
      perMonth: "/month",
      bookDemo: "Book Free Demo",
      viewProfile: "View Profile",
      goldMentor: "Gold Mentor",
      onlineBadge: "Online",
      homeTuition: "Home Tuition",
      loading: "Loading mentors…",
    },
    forMentors: {
      pageTitle: "Teach with Homentor",
      subtitle: "Join 100+ verified mentors earning from home",
      applyNow: "Apply Now",
    },
    about: {
      pageTitle: "About Homentor",
      subtitle: "Our mission is to connect every child with the right mentor",
    },
    contact: {
      pageTitle: "Contact Us",
      subtitle: "We'd love to hear from you",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
    },
    auth: {
      loginTitle: "Log in",
      signupTitle: "Sign up",
      phone: "Mobile Number",
      password: "Password",
      mentor: "Mentor",
      parent: "Parent / Student",
      loginBtn: "Log In",
      signupBtn: "Sign Up",
      invalidPhone: "Enter a valid 10-digit mobile number",
      invalidPassword: "Password must be at least 4 characters",
      loginTab: "Login",
      signupTab: "Sign Up",
    },
    mentorDashboard: {
      overview: "Overview",
      schedule: "Schedule",
      myStudents: "My Students",
      leads: "Leads",
      bookings: "Bookings",
      earnings: "Earnings",
      profile: "Profile",
      logout: "Logout",
      welcome: "Welcome back",
      noBookings: "No bookings yet",
      noLeads: "No leads yet",
      noStudents: "No students yet",
      scheduleClass: "Schedule Class",
      pendingSchedule: "Awaiting Schedule",
      scheduled: "Scheduled",
      completed: "Completed",
      totalEarnings: "Total Earnings",
      thisMonth: "This Month",
    },
    parentDashboard: {
      overview: "Overview",
      myClasses: "My Classes",
      bookings: "Bookings",
      payments: "Payments",
      profile: "Profile",
      logout: "Logout",
      welcome: "Welcome back",
      noClasses: "No classes yet",
      noBookings: "No bookings yet",
      noPayments: "No payment history",
      bookDemo: "Book a Demo",
    },
  },
  hi: {
    nav: {
      findTutors: "ट्यूटर खोजें",
      forMentors: "मेंटर के लिए",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      login: "लॉग इन",
      joinAsMentor: "मेंटर बनें",
      freeDemo: "मुफ्त डेमो",
      home: "होम",
      parentDashboard: "अभिभावक डैशबोर्ड",
      mentorDashboard: "मेंटर डैशबोर्ड",
      browseTutors: "सभी देखें",
      mathematics: "गणित",
      physics: "भौतिक विज्ञान",
      english: "अंग्रेज़ी",
      onlineTutoring: "ऑनलाइन ट्यूशन",
    },
    hero: {
      badge: "इस सप्ताह डेमो बुकिंग चालू है",
      headline1: "आपके बच्चे को",
      headline2: "चाहिए एक",
      headlineAccent: "मेंटर",
      headline3: "न सिर्फ एक",
      headline4: "शिक्षक।",
      subtext: "सत्यापित, चुने हुए होम ट्यूटर से मिलें जो आपके बच्चे की गति, परीक्षा तारीखों और कमजोर विषयों के आधार पर योजना बनाते हैं।",
      subtextHighlight: "मुफ्त डेमो · पहले सत्र पर 100% रिफंड।",
      findMentor: "मेंटर खोजें",
      howItWorks: "यह कैसे काम करता है",
      trustedBy: "भारत भर के अभिभावकों का विश्वास",
      verified: "100% सत्यापित",
      refund: "100% रिफंड",
      activeKids: "सक्रिय बच्चे",
    },
    home: {
      howItWorksLabel: "यह कैसे काम करता है",
      howItWorksHeading: "\"ट्यूटर चाहिए\" से बच्चे की पहली क्लास तक — तीन आसान चरण",
      step1Title: "अपने बच्चे के बारे में बताएं",
      step1Body: "बच्चे की कक्षा, विषय और लक्ष्य साझा करें। 60 सेकंड लगते हैं।",
      step2Title: "सत्यापित मेंटर से मिलान पाएं",
      step2Body: "हम आपके क्षेत्र, बजट और लक्ष्य के अनुसार मेंटर चुनते हैं। तय करने से पहले प्रोफाइल और रेटिंग देखें।",
      step3Title: "मुफ्त डेमो से शुरुआत करें",
      step3Body: "पहले मुफ्त डेमो क्लास लें। सही न लगे तो पहले सत्र का पूरा रिफंड — बिना सवाल।",
      bookFreeDemo: "मुफ्त डेमो बुक करें",
      featuredMentorsLabel: "हमारे मेंटर",
      featuredMentorsHeading: "चुने हुए मेंटर से मिलें",
      featuredMentorsSubheading: "हर मेंटर पृष्ठभूमि-सत्यापित और अभिभावकों द्वारा रेटेड है।",
      viewAllMentors: "सभी मेंटर देखें",
      faqTitle: "अक्सर पूछे जाने वाले सवाल",
      ctaHeading: "सही मेंटर खोजने के लिए तैयार हैं?",
      ctaSubheading: "हजारों अभिभावकों से जुड़ें जो Homentor पर भरोसा करते हैं।",
      ctaButton: "मुफ्त डेमो बुक करें",
    },
    mentors: {
      pageTitle: "मेंटर खोजें",
      searchPlaceholder: "नाम, विषय, शहर से खोजें…",
      filterSubject: "विषय",
      filterClass: "कक्षा",
      filterMode: "मोड",
      filterState: "राज्य",
      filterCity: "शहर",
      filterArea: "क्षेत्र",
      filterBudget: "मासिक बजट",
      modeOnline: "ऑनलाइन",
      modeOffline: "होम ट्यूशन",
      modeBoth: "दोनों",
      allSubjects: "सभी विषय",
      allClasses: "सभी कक्षाएं",
      allStates: "सभी राज्य",
      allCities: "सभी शहर",
      allAreas: "सभी क्षेत्र",
      resetFilters: "फिल्टर रीसेट करें",
      noMentorsFound: "कोई मेंटर नहीं मिला",
      tryAdjusting: "फिल्टर बदलकर देखें",
      perMonth: "/माह",
      bookDemo: "मुफ्त डेमो बुक करें",
      viewProfile: "प्रोफाइल देखें",
      goldMentor: "गोल्ड मेंटर",
      onlineBadge: "ऑनलाइन",
      homeTuition: "होम ट्यूशन",
      loading: "मेंटर लोड हो रहे हैं…",
    },
    forMentors: {
      pageTitle: "Homentor के साथ पढ़ाएं",
      subtitle: "100+ सत्यापित मेंटर से जुड़ें जो घर से कमाई कर रहे हैं",
      applyNow: "अभी आवेदन करें",
    },
    about: {
      pageTitle: "Homentor के बारे में",
      subtitle: "हमारा मिशन है हर बच्चे को सही मेंटर से जोड़ना",
    },
    contact: {
      pageTitle: "संपर्क करें",
      subtitle: "हम आपकी बात सुनना चाहते हैं",
      name: "नाम",
      email: "ईमेल",
      message: "संदेश",
      send: "संदेश भेजें",
    },
    auth: {
      loginTitle: "लॉग इन",
      signupTitle: "साइन अप",
      phone: "मोबाइल नंबर",
      password: "पासवर्ड",
      mentor: "मेंटर",
      parent: "अभिभावक / छात्र",
      loginBtn: "लॉग इन करें",
      signupBtn: "साइन अप करें",
      invalidPhone: "10 अंकों का वैध मोबाइल नंबर दर्ज करें",
      invalidPassword: "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए",
      loginTab: "लॉग इन",
      signupTab: "साइन अप",
    },
    mentorDashboard: {
      overview: "अवलोकन",
      schedule: "शेड्यूल",
      myStudents: "मेरे छात्र",
      leads: "लीड्स",
      bookings: "बुकिंग",
      earnings: "कमाई",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      welcome: "वापस स्वागत है",
      noBookings: "अभी कोई बुकिंग नहीं",
      noLeads: "अभी कोई लीड नहीं",
      noStudents: "अभी कोई छात्र नहीं",
      scheduleClass: "क्लास शेड्यूल करें",
      pendingSchedule: "शेड्यूल का इंतजार",
      scheduled: "शेड्यूल किया",
      completed: "पूर्ण",
      totalEarnings: "कुल कमाई",
      thisMonth: "इस महीने",
    },
    parentDashboard: {
      overview: "अवलोकन",
      myClasses: "मेरी क्लासें",
      bookings: "बुकिंग",
      payments: "भुगतान",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      welcome: "वापस स्वागत है",
      noClasses: "अभी कोई क्लास नहीं",
      noBookings: "अभी कोई बुकिंग नहीं",
      noPayments: "कोई भुगतान इतिहास नहीं",
      bookDemo: "डेमो बुक करें",
    },
  },
} as const;

export type Lang = 'en' | 'hi';
```

- [ ] **Step 2: Create `src/context/LanguageContext.tsx`**

```tsx
import React, { createContext, useContext, useState } from 'react';
import { translations, Lang } from '@/translations';

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('homentor_lang');
    return stored === 'hi' ? 'hi' : 'en';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next: Lang = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('homentor_lang', next);
      return next;
    });
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[lang];
    for (const k of keys) result = result?.[k];
    if (typeof result === 'string') return result;
    // fallback to English
    let fallback: any = translations['en'];
    for (const k of keys) fallback = fallback?.[k];
    return typeof fallback === 'string' ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
```

- [ ] **Step 3: Modify `src/main.tsx` — wrap App in LanguageProvider**

Replace the entire file with:
```tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext';

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
```

- [ ] **Step 4: Verify the app still starts**

```bash
cd homentor-frontend && npm run dev
```
Expected: Vite dev server starts on port 3000 with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add homentor-frontend/src/translations/index.ts \
        homentor-frontend/src/context/LanguageContext.tsx \
        homentor-frontend/src/main.tsx
git commit -m "feat: add LanguageContext and full EN/HI translations"
```

---

## Task 2: LanguageToggle component + mount in Layout and DashboardLayout

**Files:**
- Create: `src/components/LanguageToggle.tsx`
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/DashboardLayout.tsx`

- [ ] **Step 1: Create `src/components/LanguageToggle.tsx`**

```tsx
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      aria-label="Switch language"
      className="fixed bottom-6 right-6 z-50 flex items-center rounded-full border border-slate-200 bg-white shadow-lg overflow-hidden text-sm font-semibold hover:shadow-xl transition-shadow"
    >
      <span
        className={`px-3 py-2 transition-colors ${
          lang === 'en' ? 'bg-homentor-blue text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </span>
      <span
        className={`px-3 py-2 transition-colors ${
          lang === 'hi' ? 'bg-homentor-blue text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        हिं
      </span>
    </button>
  );
};

export default LanguageToggle;
```

- [ ] **Step 2: Modify `src/components/Layout.tsx` — add LanguageToggle**

Add import at the top:
```tsx
import LanguageToggle from './LanguageToggle';
```

Change the return JSX — add `<LanguageToggle />` just before the closing `</div>`:
```tsx
  return (
    <div className="flex flex-col min-h-screen overflow-hidden ">
      <Navbar />
      <main className={`flex-grow ${fullWidth ? '' : 'pt-4 pb-12'}`} >
        {children}
      </main>
      <Footer />
      <LanguageToggle />
    </div>
  );
```

- [ ] **Step 3: Modify `src/components/DashboardLayout.tsx` — add LanguageToggle**

Add import near the top with other imports:
```tsx
import LanguageToggle from './LanguageToggle';
```

In the return JSX, find the outermost wrapping div and add `<LanguageToggle />` as its last child. It wraps at approximately:
```tsx
return (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    {/* ... sidebar and content ... */}
    <LanguageToggle />
  </div>
);
```

- [ ] **Step 4: Open browser at http://localhost:3000 and verify the toggle pill appears in the bottom-right corner. Click it — it should flip between EN and HI visually. Refresh the page — it should remember the last choice.**

- [ ] **Step 5: Commit**

```bash
git add homentor-frontend/src/components/LanguageToggle.tsx \
        homentor-frontend/src/components/Layout.tsx \
        homentor-frontend/src/components/DashboardLayout.tsx
git commit -m "feat: add floating EN/HI language toggle button"
```

---

## Task 3: Translate Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Add `useLanguage` import to Navbar**

Add at the top of the imports:
```tsx
import { useLanguage } from '@/context/LanguageContext';
```

- [ ] **Step 2: Call the hook inside `Navbar` component**

Add as the first line inside `const Navbar = () => {`:
```tsx
const { t } = useLanguage();
```

- [ ] **Step 3: Replace hardcoded nav strings in the desktop nav**

| Old string | Replace with |
|---|---|
| `Find Tutors` | `{t('nav.findTutors')}` |
| `Browse All` | `{t('nav.browseTutors')}` |
| `Mathematics` | `{t('nav.mathematics')}` |
| `Physics` | `{t('nav.physics')}` |
| `English` | `{t('nav.english')}` |
| `Online Tutoring` | `{t('nav.onlineTutoring')}` |
| `For Mentors` | `{t('nav.forMentors')}` |
| `About` | `{t('nav.about')}` |
| `Contact` | `{t('nav.contact')}` |
| `Log in` | `{t('nav.login')}` |
| `Join as Mentor` | `{t('nav.joinAsMentor')}` |
| `Free demo` | `{t('nav.freeDemo')}` |
| `Parent Dashboard` (both occurrences) | `{t('nav.parentDashboard')}` |
| `Mentor Dashboard` (both occurrences) | `{t('nav.mentorDashboard')}` |

Also replace in the mobile nav — same keys, same pattern. The `Home` link in the mobile menu: `{t('nav.home')}`.

- [ ] **Step 4: Verify in browser — switch to Hindi and check the navbar switches all text correctly.**

- [ ] **Step 5: Commit**

```bash
git add homentor-frontend/src/components/Navbar.tsx
git commit -m "feat(i18n): translate Navbar"
```

---

## Task 4: Translate Homepage — HeroSection + all sections + Index.tsx

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/sections/HowItWorksSection.tsx`
- Modify: `src/components/sections/FeaturedMentorsSection.tsx`
- Modify: `src/components/sections/FinalCTASection.tsx`
- Modify: `src/components/FAQSection.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 1: Translate `HeroSection.tsx`**

Add import:
```tsx
import { useLanguage } from '@/context/LanguageContext';
```

Add hook call as first line inside `const HeroSection = () => {`:
```tsx
const { t } = useLanguage();
```

Replace hardcoded strings:

```tsx
// Badge text
<span>{t('hero.badge')}</span>

// Headline — keep Word component wrappers, replace inner text
<Word delay={0.05}>{t('hero.headline1')}</Word>{" "}
<Word delay={0.1}>{t('hero.headline2')}</Word>{" "}
<span className="relative inline-block">
  <motion.span ...>{t('hero.headlineAccent')}</motion.span>
  ...
</span>
<br />
<Word delay={0.25}>{t('hero.headline3')}</Word>{" "}
<Word delay={0.3} className="text-white/70">{t('hero.headline4')}</Word>

// Subtext paragraph — replace content, keep spans:
{t('hero.subtext')}{" "}
<span className="text-white font-semibold">{t('hero.subtextHighlight')}</span>

// Buttons
<MagneticButton ...>{t('hero.findMentor')}<ArrowRight .../></MagneticButton>
<button ...>{t('hero.howItWorks')}</button>
```

Trust strip badges (if present in HeroSection — replace inline strings like "100% Verified", "100% Refund", "Active Kids"):
```tsx
{t('hero.verified')}
{t('hero.refund')}
{t('hero.activeKids')}
```

- [ ] **Step 2: Translate `HowItWorksSection.tsx`**

Add import and hook:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();
```

Move the `steps` array inside the component (it currently sits outside and can't access `t`):
```tsx
const HowItWorksSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      icon: ClipboardList,
      title: t('home.step1Title'),
      body: t('home.step1Body'),
    },
    {
      icon: UserCheck,
      title: t('home.step2Title'),
      body: t('home.step2Body'),
    },
    {
      icon: GraduationCap,
      title: t('home.step3Title'),
      body: t('home.step3Body'),
    },
  ];

  return (
    <section ...>
      ...
      <p ...>{t('home.howItWorksLabel')}</p>
      <h2 ...>{t('home.howItWorksHeading')}</h2>
      ...
      <button ...>{t('home.bookFreeDemo')}</button>
    </section>
  );
};
```

- [ ] **Step 3: Translate `FeaturedMentorsSection.tsx`**

Add `useLanguage` and replace section label, heading, subheading, and "View all mentors" button:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

// Replace:
<p ...>{t('home.featuredMentorsLabel')}</p>
<h2 ...>{t('home.featuredMentorsHeading')}</h2>
<p ...>{t('home.featuredMentorsSubheading')}</p>
<button/Link ...>{t('home.viewAllMentors')}</button>
```

- [ ] **Step 4: Translate `FinalCTASection.tsx`**

Add `useLanguage` and replace the CTA heading, subheading, and button:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

// Replace:
<h2 ...>{t('home.ctaHeading')}</h2>
<p ...>{t('home.ctaSubheading')}</p>
<button/Link ...>{t('home.ctaButton')}</button>
```

- [ ] **Step 5: Translate `FAQSection.tsx`**

The FAQ section title and the FAQ items themselves. Add `useLanguage` and replace the section heading:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

<h2 ...>{t('home.faqTitle')}</h2>
```

Note: FAQ question/answer text is content, not UI chrome — leave them in English for now (they can be added to translations later when a full content pass is done).

- [ ] **Step 6: Translate `Index.tsx` marquee strings**

The marquee arrays are static strings at the top of `Index.tsx`. Move them inside the component so they can use `t()`, or since they are marketing copy and not UI chrome, leave them in English for now. Add `useLanguage` only if you want to translate them, otherwise skip.

- [ ] **Step 7: Open browser, switch to Hindi, scroll through the homepage. Verify all translated sections show Hindi text.**

- [ ] **Step 8: Commit**

```bash
git add homentor-frontend/src/components/HeroSection.tsx \
        homentor-frontend/src/components/sections/HowItWorksSection.tsx \
        homentor-frontend/src/components/sections/FeaturedMentorsSection.tsx \
        homentor-frontend/src/components/sections/FinalCTASection.tsx \
        homentor-frontend/src/components/FAQSection.tsx \
        homentor-frontend/src/pages/Index.tsx
git commit -m "feat(i18n): translate homepage sections"
```

---

## Task 5: Translate Mentors page

**Files:**
- Modify: `src/pages/Mentors.tsx`

- [ ] **Step 1: Add `useLanguage` to Mentors.tsx**

```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component (it's a large component ~959 lines):
const { t } = useLanguage();
```

- [ ] **Step 2: Replace page title and search bar**

Find the page heading and search input placeholder:
```tsx
<h1 ...>{t('mentors.pageTitle')}</h1>
<input placeholder={t('mentors.searchPlaceholder')} ... />
```

- [ ] **Step 3: Replace filter labels and select options**

Find each filter label and dropdown. Replace:
```tsx
// Filter section headings
{t('mentors.filterSubject')}
{t('mentors.filterClass')}
{t('mentors.filterMode')}
{t('mentors.filterState')}
{t('mentors.filterCity')}
{t('mentors.filterArea')}
{t('mentors.filterBudget')}

// Select "All X" options
{t('mentors.allSubjects')}
{t('mentors.allClasses')}
{t('mentors.allStates')}
{t('mentors.allCities')}
{t('mentors.allAreas')}

// Mode options
{t('mentors.modeOnline')}
{t('mentors.modeOffline')}
{t('mentors.modeBoth')}

// Reset button
{t('mentors.resetFilters')}
```

- [ ] **Step 4: Replace mentor card strings**

```tsx
// Per-month label on price
{t('mentors.perMonth')}

// CTA buttons
{t('mentors.bookDemo')}
{t('mentors.viewProfile')}

// Badges
{t('mentors.goldMentor')}
{t('mentors.onlineBadge')}
{t('mentors.homeTuition')}
```

- [ ] **Step 5: Replace empty state and loading text**

```tsx
// No results
{t('mentors.noMentorsFound')}
{t('mentors.tryAdjusting')}

// Loading state
{t('mentors.loading')}
```

- [ ] **Step 6: Verify in browser — switch to Hindi, visit /mentors, check filters and cards show Hindi labels. Verify filter functionality still works (filter logic uses internal values, not display strings).**

- [ ] **Step 7: Commit**

```bash
git add homentor-frontend/src/pages/Mentors.tsx
git commit -m "feat(i18n): translate Mentors page"
```

---

## Task 6: Translate ForMentors, AboutUs, ContactUs pages

**Files:**
- Modify: `src/pages/ForMentors.tsx`
- Modify: `src/pages/AboutUs.tsx`
- Modify: `src/pages/ContactUs.tsx`

- [ ] **Step 1: Translate `ForMentors.tsx`**

Add `useLanguage` import and hook. Replace the page title, subtitle, and apply CTA button:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

<h1 ...>{t('forMentors.pageTitle')}</h1>
<p ...>{t('forMentors.subtitle')}</p>
<button/Link ...>{t('forMentors.applyNow')}</button>
```

- [ ] **Step 2: Translate `AboutUs.tsx`**

Add `useLanguage` import and hook. Replace the page heading and subtitle:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

<h1 ...>{t('about.pageTitle')}</h1>
<p ...>{t('about.subtitle')}</p>
```

- [ ] **Step 3: Translate `ContactUs.tsx`**

Add `useLanguage` import and hook. Replace the heading, subtitle, and form field labels/button:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside component:
const { t } = useLanguage();

<h1 ...>{t('contact.pageTitle')}</h1>
<p ...>{t('contact.subtitle')}</p>
<Label ...>{t('contact.name')}</Label>
<Label ...>{t('contact.email')}</Label>
<Label ...>{t('contact.message')}</Label>
<Button ...>{t('contact.send')}</Button>
```

- [ ] **Step 4: Verify all three pages in browser in both languages.**

- [ ] **Step 5: Commit**

```bash
git add homentor-frontend/src/pages/ForMentors.tsx \
        homentor-frontend/src/pages/AboutUs.tsx \
        homentor-frontend/src/pages/ContactUs.tsx
git commit -m "feat(i18n): translate ForMentors, About, Contact pages"
```

---

## Task 7: Translate Auth pages (Login + Signup)

**Files:**
- Modify: `src/pages/Login.tsx`
- Modify: `src/pages/Signup.tsx`

- [ ] **Step 1: Translate `Login.tsx`**

Add import and hook:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside Login component:
const { t } = useLanguage();
```

Replace UI strings (keep all logic untouched — only display text changes):
```tsx
// Tab labels
<TabsTrigger value="mentor">{t('auth.mentor')}</TabsTrigger>
<TabsTrigger value="student">{t('auth.parent')}</TabsTrigger>

// Tab header "Login" / "Sign Up"
// The login tab and signup tab titles:
// Find the CardTitle for each mode and replace:
<CardTitle>{mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}</CardTitle>

// Field labels
<Label>{t('auth.phone')}</Label>
<Label>{t('auth.password')}</Label>

// Submit button
<Button ...>{mode === 'login' ? t('auth.loginBtn') : t('auth.signupBtn')}</Button>

// Error messages — replace the two hardcoded setErrorMsg strings:
setErrorMsg(t('auth.invalidPhone'));
setErrorMsg(t('auth.invalidPassword'));
```

- [ ] **Step 2: Translate `Signup.tsx`**

Apply the same pattern — add `useLanguage`, replace heading, field labels, button text, and error messages using the same `auth.*` keys.

- [ ] **Step 3: Verify login page in both languages. Submit with bad input — confirm the error messages appear in the selected language.**

- [ ] **Step 4: Commit**

```bash
git add homentor-frontend/src/pages/Login.tsx \
        homentor-frontend/src/pages/Signup.tsx
git commit -m "feat(i18n): translate auth pages"
```

---

## Task 8: Translate Mentor Dashboard pages

**Files:**
- Modify: `src/components/DashboardLayout.tsx` (nav labels)
- Modify: `src/pages/MentorDashboard.tsx`
- Modify: `src/pages/MentorBookingsPage.tsx`
- Modify: `src/pages/MentorSchedule.tsx`
- Modify: `src/pages/MentorLeads.tsx`
- Modify: `src/pages/MentorEarnings.tsx`
- Modify: `src/pages/MentorStudents.tsx`

- [ ] **Step 1: Translate DashboardLayout nav labels**

Add import and hook to `DashboardLayout.tsx`:
```tsx
import { useLanguage } from '@/context/LanguageContext';
// inside DashboardLayoutProps component:
const { t } = useLanguage();
```

Change `navForRole` to return translation keys instead of raw labels. Replace the function:
```tsx
const navForRole = (role: Role) => {
  if (role === "mentor") {
    return [
      { id: "overview",  labelKey: "mentorDashboard.overview",   path: "/dashboard/mentor",           icon: LayoutDashboard },
      { id: "schedule",  labelKey: "mentorDashboard.schedule",   path: "/dashboard/mentor/schedule",  icon: CalendarDays },
      { id: "students",  labelKey: "mentorDashboard.myStudents", path: "/dashboard/mentor/students",  icon: Users },
      { id: "leads",     labelKey: "mentorDashboard.leads",      path: "/dashboard/mentor/leads",     icon: Inbox },
      { id: "bookings",  labelKey: "mentorDashboard.bookings",   path: "/mentor/bookings",            icon: BookOpen },
      { id: "earnings",  labelKey: "mentorDashboard.earnings",   path: "/dashboard/mentor/earnings",  icon: Wallet },
      { id: "profile",   labelKey: "mentorDashboard.profile",    path: "/dashboard/mentor/profile",   icon: UserIcon },
    ];
  }
  return [
    { id: "overview",  labelKey: "parentDashboard.overview",  path: "/dashboard/student",          icon: LayoutDashboard },
    { id: "classes",   labelKey: "parentDashboard.myClasses", path: "/dashboard/student/classes",  icon: BookOpen },
    { id: "bookings",  labelKey: "parentDashboard.bookings",  path: "/parent/bookings",            icon: CalendarDays },
    { id: "payments",  labelKey: "parentDashboard.payments",  path: "/dashboard/student/payments", icon: Receipt },
    { id: "profile",   labelKey: "parentDashboard.profile",   path: "/dashboard/student/profile",  icon: UserIcon },
  ];
};
```

Update the render of nav items — change `item.label` to `t(item.labelKey)` and the Leads badge check from `item.label === "Leads"` to `item.id === "leads"`:
```tsx
// In the nav Link render:
{!collapsed && (
  <span className="flex-1 flex items-center justify-between">
    {t(item.labelKey)}
    {item.id === "leads" && unseenLeadCount > 0 && (
      <span ...>{unseenLeadCount > 99 ? "99+" : unseenLeadCount}</span>
    )}
  </span>
)}
// tooltip when collapsed:
title={collapsed ? t(item.labelKey) : undefined}
```

Also update the Logout button label:
```tsx
// Find the logout button and replace "Logout" / "Log out" text:
{!collapsed && <span>{t(role === "mentor" ? "mentorDashboard.logout" : "parentDashboard.logout")}</span>}
```

- [ ] **Step 2: Translate `MentorDashboard.tsx`**

Add `useLanguage` and replace UI labels — welcome greeting, section headings, empty states. Example:
```tsx
import { useLanguage } from '@/context/LanguageContext';
const { t } = useLanguage();

// Welcome heading if present:
<h1 ...>{t('mentorDashboard.welcome')}</h1>

// Empty state messages:
<p>{t('mentorDashboard.noBookings')}</p>
<p>{t('mentorDashboard.noStudents')}</p>

// Stat labels:
<span>{t('mentorDashboard.totalEarnings')}</span>
<span>{t('mentorDashboard.thisMonth')}</span>
```

- [ ] **Step 3: Translate `MentorBookingsPage.tsx`**

Add `useLanguage` and replace:
```tsx
const { t } = useLanguage();

// Status labels
{t('mentorDashboard.pendingSchedule')}
{t('mentorDashboard.scheduled')}
{t('mentorDashboard.completed')}

// Empty state
{t('mentorDashboard.noBookings')}

// Schedule button text
{t('mentorDashboard.scheduleClass')}
```

- [ ] **Step 4: Translate `MentorSchedule.tsx`, `MentorLeads.tsx`, `MentorEarnings.tsx`, `MentorStudents.tsx`**

Apply the same pattern to each file — add `useLanguage`, call `const { t } = useLanguage()`, and replace any visible UI label strings with `t('mentorDashboard.*')` keys. Any string not yet in the translations file should be added to both `en` and `hi` sections in `src/translations/index.ts`.

- [ ] **Step 5: Verify mentor dashboard in both languages — switch language, navigate through all mentor pages, confirm labels switch.**

- [ ] **Step 6: Commit**

```bash
git add homentor-frontend/src/components/DashboardLayout.tsx \
        homentor-frontend/src/pages/MentorDashboard.tsx \
        homentor-frontend/src/pages/MentorBookingsPage.tsx \
        homentor-frontend/src/pages/MentorSchedule.tsx \
        homentor-frontend/src/pages/MentorLeads.tsx \
        homentor-frontend/src/pages/MentorEarnings.tsx \
        homentor-frontend/src/pages/MentorStudents.tsx
git commit -m "feat(i18n): translate mentor dashboard"
```

---

## Task 9: Translate Parent/Student Dashboard pages

**Files:**
- Modify: `src/pages/StudentDashboard.tsx`
- Modify: `src/pages/ParentBookingsPage.tsx`
- Modify: `src/pages/StudentClasses.tsx`
- Modify: `src/pages/StudentPayments.tsx`
- Modify: `src/pages/StudentProfile.tsx`

- [ ] **Step 1: Translate `StudentDashboard.tsx`**

Add `useLanguage` and replace welcome greeting, section headings, stat labels, empty states, and any action buttons:
```tsx
import { useLanguage } from '@/context/LanguageContext';
const { t } = useLanguage();

<h1 ...>{t('parentDashboard.welcome')}</h1>
<p ...>{t('parentDashboard.noClasses')}</p>
<Link/button ...>{t('parentDashboard.bookDemo')}</Link>
```

- [ ] **Step 2: Translate `ParentBookingsPage.tsx`**

```tsx
const { t } = useLanguage();
{t('parentDashboard.noBookings')}
// Booking status strings — use same mentorDashboard keys or add new ones:
{t('mentorDashboard.scheduled')}
{t('mentorDashboard.completed')}
```

- [ ] **Step 3: Translate `StudentClasses.tsx`**

```tsx
const { t } = useLanguage();
{t('parentDashboard.myClasses')}
{t('parentDashboard.noClasses')}
```

- [ ] **Step 4: Translate `StudentPayments.tsx`**

```tsx
const { t } = useLanguage();
{t('parentDashboard.payments')}
{t('parentDashboard.noPayments')}
```

- [ ] **Step 5: Translate `StudentProfile.tsx`**

```tsx
const { t } = useLanguage();
{t('parentDashboard.profile')}
```

- [ ] **Step 6: Verify parent dashboard in both languages — all pages should switch text on toggle.**

- [ ] **Step 7: Final smoke test**
  - Start on homepage in English, verify all text is English
  - Click the toggle → all text switches to Hindi instantly, no page reload
  - Navigate through Mentors, ForMentors, About, Contact pages → Hindi throughout
  - Log in as mentor → dashboard shows Hindi nav and labels
  - Refresh page → Hindi is remembered
  - Click toggle again → back to English, refresh → English remembered

- [ ] **Step 8: Commit**

```bash
git add homentor-frontend/src/pages/StudentDashboard.tsx \
        homentor-frontend/src/pages/ParentBookingsPage.tsx \
        homentor-frontend/src/pages/StudentClasses.tsx \
        homentor-frontend/src/pages/StudentPayments.tsx \
        homentor-frontend/src/pages/StudentProfile.tsx
git commit -m "feat(i18n): translate parent/student dashboard"
```
