# edgeofthearctic.is — the local hub

The **local / hospitality** site: Eyri Restaurant, the Hjalteyri guesthouse, and a
guide to North Iceland. Its job is to drive traffic (and Google reviews) to the
restaurant and rooms. Companion to the tours site (`edgeofthearctic.travel`), which
lives in `../site/`.

Same design system, same repo, **separate Cloudflare Worker + domain**.

## Pages
```
site-is/
├── index.html      Home — Eat / Stay / Explore, drives to restaurant + rooms
├── eat/            Eyri Restaurant — menu style, hours, Dineout booking,
│                   and a prominent "Leave a Google review" section
├── stay/           Guesthouse — rooms + a room-enquiry form (Web3Forms)
├── explore/        Local area guide (Goðafoss, Dettifoss, Ásbyrgi, Arctic Henge…)
└── contact/        Hours, phone, email, directions
```

## Deploy (once)
This is a second site in the same GitHub repo, so it needs its **own Cloudflare
project** pointing at the same repo:

1. Cloudflare → **Workers & Pages → Create → Connect to Git** → pick the same
   `edgeoftheartic/edge-of-the-arctic-website` repo.
2. **Deploy command:** `npx wrangler deploy -c wrangler-is.jsonc`
   (this is the only difference from the .travel project, which uses the default).
3. Add the custom domain **edgeofthearctic.is** to this Worker.

Every push to `main` then redeploys both sites automatically.

## Two things to finish
1. **Google review link (eat page):** the "Write a Google Review" button currently
   uses a Google Maps search fallback that works, but for a true one-click review
   dialog, replace it with the restaurant's short link — Google Business Profile →
   "Ask for reviews" → copy the `g.page/r/…` link, then paste it in
   `site-is/eat/index.html` (search for the `TODO` comment).
2. **Confirm the WhatsApp number** (+354 862 9697) is WhatsApp-enabled, and the
   restaurant phone (+354 888 9604).

## Notes
- The room-enquiry form uses the same Web3Forms key as .travel, so enquiries land
  in the same Gmail inbox (subject line marks them "Guesthouse enquiry").
- `eyrirestaurant.is` (the old Wix restaurant site) can be retired in favour of the
  richer `/eat/` page here, or kept and linked — your call.
