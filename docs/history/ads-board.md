# Ads board — "إعلانك علينا وإعلانا عليك" / "عنا الإعلانات" (2026-10-05)

Owner's idea: users register, submit their shop/project/page ad for free and in return share adawati.space on their page (they paste the post link as proof); owner approves / requests changes / rejects; approved ads appear in a public listing with likes; each ad has a detail page linking to the advertiser's pages.

- Pages: `jo/ads/` (listing, search + category filter, sorted by likes), `jo/ads/submit/` (sign-in gated form + "إعلاناتي" with status/admin note/edit), `jo/ads/view/?id=` (detail, like toggle, share), `jo/ads/admin/` (noindex review panel). Shared `jo/ads/ads.js` + `ads.css`. Pages were generated from one template script (scratchpad); edit the HTML directly now.
- Firestore: `ads/{id}` {title, category[shop|project|service|page|other], city, description, links[1-4], shareProof, ownerName, ownerUid, status[pending|changes|approved|rejected], adminNote, likeCount, createdAt, updatedAt}; `ads/{id}/likes/{uid}`; `admins/{uid}` (created by hand in the console — owner's doc exists). Rules copy: `docs/firestore.rules` (published via console by the owner; Claude is not permitted to click Publish).
- Advertiser links use `rel="nofollow sponsored ugc noopener"` (avoid Google link-scheme penalty).
- Claude cannot create accounts/sign in on production, so the end-to-end submit→approve flow is tested by the owner.
- Expiry (added same day): admin picks a duration on approve (7/14/30/60/90 days or none) → `expiresAt`; "⏱️ تعديل المدة" extends it. Expired ads are hidden client-side (listing filter, view page message) — data stays until admin deletes. Admin also gets a delete button on the view page.
- Proof + contact (2026-10-05): proof = post link OR story screenshot (client-compressed JPEG data-URL ≤600KB in `adProofs/{adId}`, readable by owner/admin only — Firebase Storage needs the paid plan); required Instagram follow of @adawati2027 (checkbox + `igHandle` the admin verifies by hand); optional `phone` shown on the ad page as a tel: link.
- Phase 2 (not built yet): ratings, comments, report button.
