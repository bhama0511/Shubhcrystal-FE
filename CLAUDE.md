# ShubhCrystals — Frontend

React + Vite e-commerce site for selling handcrafted crystal bracelets.

---

## ⚠️ MOBILE-FIRST MANDATE

**90% of users are on mobile.** Every feature built from this point forward must be designed and tested mobile-first.

### Rules — no exceptions

1. **Write mobile styles first.** Default CSS targets ≤480px. Add `@media (min-width: 768px)` for desktop enhancements, not the other way round.
2. **Minimum touch target: 44×44px** for every button, link, and interactive element.
3. **No horizontal scroll** on any page at 375px viewport width.
4. **Inputs must have `font-size: 16px` minimum** — enforced globally in `index.css`. Never go below; iOS Safari auto-zooms on smaller inputs.
5. **Test at 375px before marking any task done.** Use Chrome DevTools → iPhone SE preset.
6. **Sticky CTAs** — primary action buttons (Add to Cart, Checkout, Submit) must be fixed at the bottom of the screen on mobile, not buried below the fold.
7. **Swipeable filter bars** — use `overflow-x: auto; flex-wrap: nowrap` for pill/tab filters, not wrapping grids.
8. **Images** — always use `object-fit: cover` with explicit height. Never let images stretch the layout.
9. **No modals or dropdowns that break on mobile** — use full-screen overlays or bottom sheets instead.
10. **Admin panel is secondary** — admin is used by 1-2 people on desktop. Customer-facing pages are the priority.

### Established mobile patterns (already in place — follow them)

| Pattern | Where used | Reuse for |
|---|---|---|
| Hamburger drawer | `Navbar.jsx` | Any nav/filter panel |
| Sticky buy bar | `ProductDetail.css` | Checkout, any primary CTA |
| Horizontal scroll filter | `Shop.css` | Tags, categories, date filters |
| 2-column product grid | `index.css .grid-3` | Any card grid |
| Sidebar overlay drawer | `AdminLayout.jsx` | Any side panel |
| `authFetch` utility | `src/api/client.js` | Every authenticated API call |

---

## Tech Stack

- **React 18** with React Router v6
- **Vite** (dev server port 3000, proxies `/api` → backend on 8081)
- Plain CSS — mobile-first, no Tailwind, no component library
- **No TypeScript**

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
├── api/                  # All fetch calls — no fetch() calls outside this folder
│   ├── admin.js          # fetchStats, fetchAllUsers, fetchAllProducts, createProduct, updateProduct, deleteProduct
│   ├── auth.js           # login(email, pass), register(name, email, pass)
│   ├── client.js         # authFetch(url, options, token) — adds Authorization header
│   ├── orders.js         # placeOrder, fetchMyOrders, fetchAllOrders, updateOrderStatus
│   ├── products.js       # fetchProducts(stone?), fetchProduct(id)
│   └── upload.js         # uploadImage(file, token) → { url, publicId }
├── components/           # Shared UI only — no business logic, no direct API calls
│   ├── AdminRoute.jsx    # Redirects to / if not ADMIN
│   ├── Footer.jsx
│   ├── Navbar.jsx        # Hamburger menu on mobile (<768px), full nav on desktop
│   ├── ProductCard.jsx   # Shows imageUrl if present, emoji fallback
│   ├── ProtectedRoute.jsx # Redirects to /login if not authenticated
│   └── Spinner.jsx       # Centered loading spinner
├── context/              # Global state only
│   ├── AuthContext.jsx   # { auth, login, logout, isLoggedIn, isAdmin, token }
│   │                     # Persists to localStorage key 'sc_auth'
│   └── CartContext.jsx   # useReducer — add/remove/updateQty/clear
├── hooks/                # Data fetching hooks — keeps pages thin
│   ├── useProduct.js     # useProduct(id) → { product, loading, error }
│   └── useProducts.js    # useProducts() → { products, loading, error }
├── pages/
│   ├── admin/            # Admin panel — ADMIN role only
│   │   ├── AdminLayout.jsx    # Sidebar + Outlet; sidebar is a slide-in drawer on mobile
│   │   ├── Dashboard.jsx      # Stat cards (products, users) + quick action shortcuts
│   │   ├── Orders.jsx         # All orders table — customer, items, total, status dropdown
│   │   ├── ProductForm.jsx    # Add / edit product with Cloudinary image upload
│   │   ├── Products.jsx       # All products table — edit, hide/show, delete
│   │   └── Users.jsx          # All users table — id, name, email, role
│   ├── AuthForm.css      # Shared styles for Login + Register + Forgot/Reset password
│   ├── Cart.jsx          # Cart items + order summary; "Proceed to Checkout" → /checkout
│   ├── Checkout.jsx      # Address form + order summary; sticky place-order CTA on mobile
│   ├── ForgotPassword.jsx # Email form → POST /forgot-password; "check your inbox" success state
│   ├── Home.jsx          # Hero + featured 3 products + benefits
│   ├── Login.jsx          # Includes "Forgot password?" link + reset-success banner
│   ├── Orders.jsx        # User's order history — status badges, items, shipping
│   ├── ProductDetail.jsx # Full product info; sticky buy bar on mobile
│   ├── Register.jsx
│   ├── ResetPassword.jsx # Reads ?token= from URL, password + confirm form, → /login on success
│   └── Shop.jsx          # Full catalog; swipeable stone filter bar
└── index.css             # CSS variables + global utilities + mobile base styles
```

## Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Home | Public |
| `/shop` | Full catalog | Public |
| `/product/:id` | Product detail | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Request reset email | Public |
| `/reset-password?token=…` | Set new password from email link | Public |
| `/cart` | Cart | Login required |
| `/checkout` | Place order (address + summary) | Login required |
| `/orders` | My order history | Login required |
| `/admin` | Admin dashboard | ADMIN only |
| `/admin/products` | Products table | ADMIN only |
| `/admin/products/new` | Add product | ADMIN only |
| `/admin/products/:id/edit` | Edit product | ADMIN only |
| `/admin/orders` | All orders + status updates | ADMIN only |
| `/admin/users` | Users table | ADMIN only |

## API Integration

All API calls go through `src/api/`. The Vite proxy handles CORS in dev:

```js
// vite.config.js
'/api' → 'http://localhost:8081'
```

For authenticated calls, always use `authFetch` from `src/api/client.js`:
```js
import { authFetch } from './client'
authFetch('/api/some-endpoint', { method: 'POST', body: JSON.stringify(data) }, token)
```

Never call `fetch()` directly in a page or component.

## State Management

| State | Where | How |
|---|---|---|
| Cart | `CartContext` | `useReducer` — add/remove/qty/clear |
| Auth | `AuthContext` | `useState` + `localStorage` — token + user info |
| Products | `useProducts` hook | `useState` + `useEffect` — fetched fresh per mount |

## Key Conventions

- **Never call `fetch()` directly** in a component or page — always go through `src/api/`
- **Components under ~120 lines** — split when they grow
- **CSS file per component** — `Navbar.jsx` imports `Navbar.css`, class names prefixed by component
- **No prop drilling beyond 2 levels** — lift to context instead
- **Spinner for loading** — import `Spinner` from `components/Spinner`, not inline text
- **`.status-msg.error`** for error messages (defined in `index.css`)
- **Admin pages**: get `token` from `useAuth()`, pass to every API call

## CSS Variables (`index.css`)

```css
--primary:      #7b5ea7
--primary-dark: #5c3d8f
--accent:       #e8c4d8
--bg:           #fdf8ff
--text:         #2d2d2d
--text-muted:   #777
--shadow:       0 2px 16px rgba(123, 94, 167, 0.12)
--radius:       12px
```

## Current State

### Done

- [x] Navbar — desktop nav + mobile hamburger drawer with auth state
- [x] Home — hero, featured products (from API), benefits section
- [x] Shop — full catalog from API, swipeable stone filter (client-side)
- [x] Product detail — full info from API, sticky "Add to Cart" bar on mobile
- [x] Cart — add/remove/qty/clear, order summary, free shipping threshold
- [x] Footer — responsive (2-col tablet, 1-col mobile)
- [x] Login page + Register page
- [x] AuthContext — JWT stored in localStorage, role-aware
- [x] ProtectedRoute + AdminRoute
- [x] Cloudinary image upload via `POST /api/upload`
- [x] `useProducts` and `useProduct` custom hooks
- [x] `Spinner` component
- [x] `authFetch` utility (`src/api/client.js`)
- [x] Admin panel — sidebar layout with mobile drawer
- [x] Admin Dashboard — stat cards, quick action shortcuts
- [x] Admin Products — full table with edit / hide-show / delete
- [x] Admin ProductForm — add/edit with image upload, benefits textarea
- [x] Admin Users — user table with role badges
- [x] Mobile responsive — all pages tested at 375px
- [x] **Checkout page** (`/checkout`) — address form, COD note, sticky place-order CTA on mobile
- [x] **Orders page** (`/orders`) — order history with status badges, success banner after placement
- [x] **"My Orders" link** in Navbar (desktop nav + mobile drawer) when logged in
- [x] **Admin Orders** (`/admin/orders`) — all orders with inline status dropdown
- [x] **Empty states** for empty cart, empty checkout, and empty orders pages
- [x] **Forgot/Reset password flow** — `/forgot-password` (email form, "check inbox" state), `/reset-password?token=…` (password + confirm), reset-success banner on `/login`

### Not yet built

- [ ] **Razorpay payment** — order button, payment modal, success/fail handling (currently Cash on Delivery)
- [ ] **React Error Boundary** — catch runtime crashes, show fallback UI
- [ ] **Toast notifications** — replace `alert()` in admin with non-blocking toasts
- [ ] **Pagination** — product grid when catalog grows beyond 20 items
- [ ] **Deploy to Vercel**

## 15-Day Build Plan

| Days | Feature | Status |
|---|---|---|
| 1–2 | Cloudinary image upload + `useProducts`/`useProduct` hooks | ✅ Done |
| 3–4 | Spring Security JWT + RBAC + Login/Register + Auth routes | ✅ Done |
| + | Admin panel (Dashboard, Products CRUD, Users, ProductForm) | ✅ Done |
| + | Full mobile responsiveness (all pages) | ✅ Done |
| 5–6 | Checkout flow + Order model + my-orders + admin orders | ✅ Done |
| 7–8 | Razorpay payment integration | 🔲 (paused — Razorpay approval pending) |
| 7–8 (alt) | Forgot/Reset password pages + transactional email triggers | ✅ Done |
| 11 | React Error Boundary + toast notifications | 🔲 |
| 12 | Empty states polish + loading skeletons | 🔲 |
| 13 | Input validation hardening | 🔲 |
| 14 | Production config + security audit | 🔲 |
| 15 | Deploy FE → Vercel, BE → Railway/Render | 🔲 |
