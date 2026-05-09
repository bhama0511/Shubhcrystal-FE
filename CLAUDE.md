# ShubhCrystals — Frontend

React + Vite e-commerce site for selling handcrafted crystal bracelets.

## Tech Stack

- **React 18** with React Router v6
- **Vite** (dev server port 3000, proxies `/api` → backend on 8081)
- Plain CSS (no Tailwind, no component library) — CSS files live alongside their component
- No TypeScript

## How to Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → dist/
```

Backend must be running on port 8081 for API calls to work.

## Folder Structure

```
src/
├── api/              # All fetch calls — one file per domain, no fetch() calls outside here
│   └── products.js   # fetchProducts(stone?), fetchProduct(id)
├── components/       # Shared UI, no business logic, no direct API calls
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── Footer.jsx
├── context/          # Global state only
│   └── CartContext.jsx  # useReducer cart — add/remove/updateQty/clear
├── hooks/            # Custom hooks — data fetching + state, keeps pages thin
├── pages/            # One file per route, delegates to components and hooks
│   ├── Home.jsx          → GET /api/products (first 3 as featured)
│   ├── Shop.jsx          → GET /api/products?stone=X (filter by stone)
│   ├── ProductDetail.jsx → GET /api/products/:id
│   └── Cart.jsx          → reads CartContext, no API calls yet
├── utils/            # Pure helpers (formatPrice, formatDate etc.)
└── index.css         # Global CSS variables and utility classes only
```

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero + featured 3 products |
| `/shop` | Full catalog with stone filter |
| `/product/:id` | Single product detail |
| `/cart` | Cart with qty controls and order summary |

## API Integration

All API calls go through `src/api/products.js`. The Vite proxy handles CORS in dev:

```js
// vite.config.js proxy
'/api' → 'http://localhost:8081'
```

In production, set `VITE_API_BASE` or configure the host's reverse proxy.

## State Management

Cart state lives in `CartContext` (useReducer). No external state library.
Products are fetched per-page with `useState` + `useEffect` — move to custom hooks in `src/hooks/` as pages grow.

## Key Conventions

- **Never call `fetch()` directly inside a component or page** — always go through `src/api/`
- **Components under ~120 lines** — split into smaller pieces when they grow
- **CSS file per component** — `Navbar.jsx` imports `Navbar.css`, scoped by class name prefix
- **No prop drilling beyond 2 levels** — lift to context instead
- Loading state: use `.status-msg` class (defined in `index.css`)
- Error state: use `.status-msg.error` class

## CSS Variables (index.css)

```css
--primary: #7b5ea7
--primary-dark: #5c3d8f
--accent: #e8c4d8
--bg: #fdf8ff
--text: #2d2d2d
--text-muted: #777
--shadow: 0 2px 16px rgba(123, 94, 167, 0.12)
--radius: 12px
```

## Current State (as of project start)

Built:
- [x] Navbar with cart badge
- [x] Home page (hero + featured + benefits section)
- [x] Shop page with stone filter (calls API)
- [x] Product detail page (calls API)
- [x] Cart with add/remove/qty/clear (local state)
- [x] Footer

Not yet built:
- [ ] Auth (login / register pages)
- [ ] Checkout flow
- [ ] Payment (Razorpay)
- [ ] Order history page
- [ ] Admin panel
- [ ] Image upload
- [ ] Mobile responsive polish
- [ ] React Error Boundary
- [ ] Custom hooks in `src/hooks/`

## 15-Day Build Plan

| Days | Feature |
|---|---|
| 1–2 | Image upload (Cloudinary) + useProducts hook |
| 3–4 | Auth — Spring Security JWT + login/register pages |
| 5–6 | Checkout flow — Order model + checkout page |
| 7–8 | Razorpay payment integration |
| 9–10 | Order history page |
| 11–12 | Admin panel (list orders, update status) |
| 13 | Mobile responsiveness + empty states |
| 14 | Input validation + error hardening |
| 15 | Deploy to Vercel |
