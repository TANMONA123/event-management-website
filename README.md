# Eventora – Responsive Event Management Website

K Explore – Web Designing task: **Design and Develop a Responsive Event Management Website**.

Eventora lets users explore upcoming events, search and filter them, view full event details and register through a validated form. It is built with plain **HTML5, CSS3 and JavaScript** (no frameworks or build step).

- **Live website:** `<add your Vercel / Netlify / GitHub Pages link here>`
- **GitHub repository:** `<add your repository link here>`

## Features

### Core requirements
- **Hero section** introducing the platform with call-to-action buttons
- **Upcoming & featured events** shown as cards (image, name, date, venue, short description)
- **Search** by name, venue, keyword or category
- **Category filters** (All, Technology, Music, Workshop, Business, Sports, Culture)
- **Event details view** with date, time, venue, price, capacity and long description
- **Registration form** collecting name, email, phone number and selected event
- **JavaScript validation** with live inline errors:
  - Name: required, min 3 characters, letters only
  - Email: required, valid format
  - Phone: required, valid 10-digit Indian mobile number (optional +91)
  - Event: must be selected
  - Duplicate registration (same email + event) is blocked
- **Confirmation message** with a booking ID after successful submission
- **Fully responsive** for mobile, tablet and desktop (hamburger menu, fluid grids, media queries)

### Bonus challenges implemented
- Dark / light mode (remembers choice and respects system preference)
- Live countdown timers (hero section for the next event and inside each event's details)
- Animations: scroll-reveal, card hover effects, animated stats counters, modal transitions
- Local Storage based registration management (view and cancel under **My Registrations**)

## Tech stack
- HTML5 (semantic tags, ARIA attributes)
- CSS3 (custom properties, Grid, Flexbox, media queries, animations)
- JavaScript (ES6+, DOM manipulation, Local Storage, IntersectionObserver)

## Project structure
```
event-management-website/
├── index.html    # Page structure and sections
├── style.css     # Styling, themes, responsive layout, animations
├── script.js     # Event data, search/filter, modal, validation, storage, countdown
└── README.md
```

## How it works
1. `script.js` holds an `EVENTS` array. Cards are generated from it, and search and category filters re-render the grid.
2. Clicking **View Details** or **Register** opens a modal built from the selected event.
3. On submit, each field is checked by a validator function. Errors appear inline; valid data is saved to `localStorage` and a confirmation is shown.
4. **My Registrations** reads from `localStorage`, so data persists after refresh. Users can cancel a registration.
5. A one-second interval updates all countdown timers.

## Run locally
No installation needed.
1. Clone the repository: `git clone <your-repo-link>`
2. Open `index.html` in a browser (or use the VS Code Live Server extension).

## Deployment
**GitHub Pages:** Repo → Settings → Pages → Source: `main` branch, `/ (root)` → Save.
**Netlify / Vercel:** Import the GitHub repo. No build command needed; the publish directory is the root.

## Customising events
Edit the `EVENTS` array at the top of `script.js` to add, remove or change events (name, category, date in ISO format, venue, image URL, description).

## Notes
- Event images load from `picsum.photos`; a gradient background shows if an image fails to load.
- Registration data is stored only in the user's browser (no backend).

## Author
`<Your Name>` – K Explore Web Designing
