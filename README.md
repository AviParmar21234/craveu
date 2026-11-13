# CraveU — website + mobile app prototype

Static site and clickable mobile prototype for **CraveU**, the takeout-only kitchen hall at the University of Miami (BTE 210 final project).

```
craveu/
├── index.html          Home
├── restaurants.html    What's Cooking (the 8 kitchen bays)
├── how-it-works.html   Pickup flow, pricing, group orders, FAQ
├── partners.html       For Restaurants: bay pricing + application form
├── about.html          Story + founders
├── contact.html        Contact info, form, map
├── css/site.css        Brand stylesheet (website)
├── js/site.js          Nav, reveal animations, open/closed badges, demo forms
├── assets/             Logo, app icon, favicon (from the brand kit)
└── app/                Mobile app prototype
    ├── index.html      Phone frame + explainer panel
    ├── app.css         App styles (same brand tokens)
    └── app.js          Screens, state, simulated order flow
```

No build step. Everything is plain HTML/CSS/JS, so it runs from any static host.

## Run locally

```bash
cd craveu && python3 -m http.server 8080
```

Then open http://localhost:8080 (website) and http://localhost:8080/app/ (app).

## Live links (for the report)

- Website: https://aviparmar21234.github.io/craveu/
- App prototype: https://aviparmar21234.github.io/craveu/app/
- Repo: https://github.com/AviParmar21234/craveu

Published 2026-11-13 from the `main` branch. To update: edit, then `git add . && git commit -m "..." && git push`; Pages rebuilds in about a minute.

## How it was published (GitHub Pages)

1. Create a new **public** repository on GitHub, e.g. `craveu`.
2. From this folder:
   ```bash
   cd craveu
   git init
   git add .
   git commit -m "CraveU website and app prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/craveu.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. After a minute the site is live at `https://<your-username>.github.io/craveu/`
   - Website link for the report: `https://<your-username>.github.io/craveu/`
   - App prototype link for the report: `https://<your-username>.github.io/craveu/app/`
5. Test both links in an incognito window before submitting.

## Brand

- Campus Green `#0B4D3A` · Crave Orange `#F47A1F` · Cream `#F3E7CF` · Ink `#111111`
- Alfa Slab One (wordmark, headlines) · Poppins (everything else)

## Design decisions to defend in the presentation

| Feature | Where | Business model block |
|---|---|---|
| CaneID sign-in | App: sign-in | Key partnership (UM), channels |
| Dining Dollars / Cane Express at checkout | App: checkout; site: home | UM partnership, customer segments (meal-plan students) |
| Pickup slots generated from class schedule | App: home, cart, profile | Value proposition ("fits the 20 minutes between classes") |
| Group order with separate payment | App: group, cart; site: home | Value proposition (group-order problem) |
| $0.99 service fee shown on every ticket | App: cart, checkout; site: how-it-works | Revenue stream #2 |
| "Local favorite" vs "National brand" tags | App: home; site: restaurants | Key partnerships (restaurant mix) |
| Live wait times per bay | App: home | Key activities (moving orders fast) |
| Single pickup counter, orders shelved by number | App: tracking, pickup | Key resources (pickup area), key activities |
| Crave Points, badges, org leaderboard, bay vote | App: rewards | Customer relationships (student rewards, student orgs) |
| For Restaurants page: flat rent, 0% cut, bay tiers | Site: partners | Revenue stream #1 (bay rent), customer segment #2 |
| Open "Bay 8" with application link | Site: restaurants; app: bay 8 | Filling bays drives profit (cost structure) |
