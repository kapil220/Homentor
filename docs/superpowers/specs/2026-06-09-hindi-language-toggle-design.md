# Hindi Language Toggle — Design Spec
**Date:** 2026-06-09  
**Status:** Approved

## Overview

Add a Hindi language option to the Homentor frontend with a floating EN/हिं toggle button. Default language is English. User's choice is persisted in localStorage. Covers all pages: public marketing, mentor dashboard, parent/student dashboard, and auth pages.

## Architecture

Four new/modified pieces:

| File | Role |
|------|------|
| `src/context/LanguageContext.tsx` | React Context — holds `lang`, exposes `toggleLang()` and `t(key)` |
| `src/translations/index.ts` | Single source of truth for all EN + HI strings, namespaced |
| `src/components/LanguageToggle.tsx` | Floating pill button, fixed bottom-right, renders on every page |
| `src/main.tsx` | Wrap `<App />` in `<LanguageProvider>` |

## LanguageContext

```ts
type Lang = 'en' | 'hi'

interface LanguageContextValue {
  lang: Lang
  toggleLang: () => void
  t: (key: string) => string
}
```

- On mount: reads `localStorage.getItem('homentor_lang')`, defaults to `'en'`
- `toggleLang()`: flips `en ↔ hi`, writes back to localStorage
- `t(key)`: dot-notation lookup into `translations[lang]`, e.g. `t('nav.findTutors')`
- Falls back to the English string if a Hindi translation is missing (no broken UI during rollout)

## Translation File Structure

`src/translations/index.ts` — organized by namespace:

```
translations
├── en
│   ├── nav        (navbar links, buttons)
│   ├── hero       (homepage hero section)
│   ├── home       (all other homepage sections: howItWorks, features, comparison, faq, cta)
│   ├── mentors    (browse mentors page: filters, labels, cards)
│   ├── forMentors (for-mentors landing page)
│   ├── about      (about us page)
│   ├── contact    (contact page)
│   ├── auth       (login, signup, OTP screens)
│   ├── mentorDashboard  (bookings, schedule, leads, earnings, students)
│   └── parentDashboard  (classes, payments, profile)
└── hi
    └── (same structure, Hindi strings)
```

TypeScript type inference ensures `t('nav.findTutors')` is valid at compile time; unknown keys produce a type error.

## LanguageToggle Component

- **Position:** `fixed bottom-6 right-6 z-50`
- **Style:** Pill (`rounded-full`), two halves — `EN` and `हिं`
- **Active state:** Active language side gets `bg-homentor-blue text-white`; inactive side gets `text-gray-500`
- **Hover:** Subtle shadow lift
- **Placement:** Added once in `Layout.tsx` (public pages) and once in `DashboardLayout.tsx` (dashboard pages)

## Data Flow

```
App load
  └─ LanguageProvider reads localStorage('homentor_lang') → default 'en'
       └─ All consumers re-render with correct language

User clicks toggle
  └─ toggleLang() flips lang state
       └─ localStorage updated
            └─ All useLanguage() consumers re-render instantly (no page reload)
```

## Scope — Pages to Translate

| Page | Namespace(s) |
|------|-------------|
| Homepage (`/`) | nav, hero, home |
| Find Tutors (`/mentors`) | nav, mentors |
| For Mentors (`/for-mentors`) | nav, forMentors |
| About Us (`/about-us`) | nav, about |
| Contact (`/contact-us`) | nav, contact |
| Login (`/login`) | auth |
| Signup (`/signup`) | auth |
| Mentor Dashboard + sub-pages | nav, mentorDashboard |
| Parent/Student Dashboard + sub-pages | nav, parentDashboard |

## Error Handling

- Missing Hindi key: falls back to English string silently — no broken UI
- Invalid localStorage value: defaults to `'en'`

## What's NOT in scope

- Right-to-left layout (Hindi is LTR — no layout changes needed)
- Backend API responses (mentor names, descriptions stay as-is from DB)
- Admin panel (separate app)
- URL-based locale routing (toggle is UI-only state)
