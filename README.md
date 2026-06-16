# Pulsebook

Pulsebook is a compact real-time trading UI reference implementation. It focuses on frontend architecture for data-heavy realtime interfaces: orderbook updates, positions, PnL, mock stream events, connection lifecycle, stale-data handling, and performance-conscious rendering.

The project is intentionally small in product scope. The goal is to keep the architecture decisions visible, the UI compact and readable, and the file boundaries clear enough to use as a public reference.

## Current Status

The repository baseline is in place:

- Next.js App Router with TypeScript
- Tailwind CSS v4-style PostCSS setup
- Lightweight `app/layout.tsx` and `app/page.tsx`
- Dedicated client boundary in `components/dashboard/pulsebook-dashboard.tsx`
- Initial global styling and project metadata

## Planned Focus Areas

- Orderbook updates with snapshots and deltas
- Positions and derived unrealized PnL
- Typed mock realtime events with sequence handling
- Connection lifecycle and stale-data behavior
- Render isolation with narrow selectors

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Repository Structure

```text
app/
components/
docs/
lib/
```

The implementation roadmap lives in [docs/implementation-roadmap.md](docs/implementation-roadmap.md).
