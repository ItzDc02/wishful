# Wishful App – Change Log

## Summary
- **Removed** `PostWishPanel` from the Home page UI (file retained to satisfy "do not delete").
- **Redesigned** `NewWish.tsx` into a standalone, polished form view. It is intended to open in a **new window/tab** from Home.
- **Enabled wish fulfillment**: Added a `FulfillWishButton` component and hook it into `WishDetails.tsx`. It triggers Razorpay checkout (test keys) and marks the wish as fulfilled on success.
- **Razorpay integration**: Client now calls `/api/payments/create-order`. Keys are read from `.env` (server) and `VITE_RAZORPAY_KEY_ID` (client). Fallback test key placeholder is included.
- **No files deleted**; no external libraries added.
- **All modifications documented below with file-level details.**

## File-by-file Details

### Client
- `client/src/pages/Home.tsx`
  - Removed import and rendering of `PostWishPanel`.
  - Inserted a "Post a Wish" button that opens `/new` in a new tab: `window.open('/new', '_blank', 'noopener')`.
- `client/src/pages/NewWish.tsx`
  - Rewrote UI with Tailwind utilities: card layout, better inputs, validation hints.
  - Added upload state indicators and placeholders.
  - Kept the Cloudinary upload flow, now using `VITE_CLOUDINARY_*` env vars.
- `client/src/components/FulfillWishButton.tsx` **(new)**
  - Handles payment + fulfill flow:
    1. POST `/payments/create-order` to server.
    2. Loads Razorpay Checkout script if not already loaded.
    3. On successful payment, POST `/wishes/:id/fulfill`.
- `client/src/pages/WishDetails.tsx`
  - Imports and renders `<FulfillWishButton />` when wish is not fulfilled.
  - Displays success state after fulfillment.

### Server
- No structural changes. Existing `/api/wishes/:id/fulfill` and Razorpay order route reused.
- Ensure `.env` contains `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test mode keys).

### Documentation
- `CHANGES.md` (this file): Full list of edits.
- No files were deleted.

## Env Vars (examples)
```
# server/.env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx

# client/.env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_CLOUDINARY_CLOUD=your_cloud_name
VITE_CLOUDINARY_PRESET=unsigned_preset
```
