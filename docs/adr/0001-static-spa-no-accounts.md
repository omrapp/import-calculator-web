---
status: accepted
---

# Static SPA with no accounts; one serverless function for exchange rates

The site is a static Vite SPA on Vercel with no backend, no database and no user accounts: History lives in the browser's localStorage, moves between devices only via JSON export/import or a share link that encodes a Calculation's inputs in the URL, and Contact Us is a mailto link. The single exception is a Vercel function that proxies and caches Bank of Israel exchange rates (~1h), because the browser can't call that API reliably and rates must not silently fall back to hardcoded values. We chose this to keep the tool public, free to run and free of personal data; the cost is that History is lost if the user clears browser data.

## Considered Options

- **Accounts + cloud sync (e.g. Supabase)**: rejected for v1. Adds auth, a database, privacy obligations and running cost for a tool whose core job (estimate a Landed Cost) needs none of it.
- **Contact form via email-sending function or Formspree**: rejected in favour of mailto; avoids a second function, an API key and spam handling.

## Consequences

- Any future feature needing server state (accounts, synced History, contact form) reopens this decision.
- Saved Calculations store inputs plus a frozen result, so old records stay stable when rates or VAT change.
