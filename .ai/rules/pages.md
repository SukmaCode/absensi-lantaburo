---
paths:
  - resources/js/pages/welcome.tsx
---

# Pages

## Landing page = `welcome` (light-only, brand tokens)
The public landing page lives at resources/js/pages/welcome.tsx (route `home`, no layout in app.tsx). It is intentionally light-only per docs/DESIGN.md — do not add dark: variants. Use brand tokens --color-brand/-dark/-soft/-bg/-text/-muted/-warm (defined in resources/css/app.css) and Plus Jakarta Sans font utilities. Data (SchoolProfile, upcoming Event) comes from LandingController. Photography is imported from resources/images via relative paths.
