# Ads board — "إعلانك علينا وإعلانا عليك" / "عنا الإعلانات" (2026-10-05)

Owner's idea: users register, submit their shop/project/page ad for free and in return share adawati.space on their page (they paste the post link as proof); owner approves / requests changes / rejects; approved ads appear in a public listing with likes; each ad has a detail page linking to the advertiser's pages.

- Pages: `jo/ads/` (listing, search + category filter, sorted by likes), `jo/ads/submit/` (sign-in gated form + "إعلاناتي" with status/admin note/edit), `jo/ads/view/?id=` (detail, like toggle, share), `jo/ads/admin/` (noindex review panel). Shared `jo/ads/ads.js` + `ads.css`. Pages were generated from one template script (scratchpad); edit the HTML directly now.
- Firestore: `ads/{id}` {title, category[shop|project|service|page|other], city, description, links[1-4], shareProof, ownerName, ownerUid, status[pending|changes|approved|rejected], adminNote, likeCount, createdAt, updatedAt}; `ads/{id}/likes/{uid}`; `admins/{uid}` (created by hand in the console — owner's doc exists). Rules copy: `docs/firestore.rules` (published via console by the owner; Claude is not permitted to click Publish).
- Advertiser links use `rel="nofollow sponsored ugc noopener"` (avoid Google link-scheme penalty).
- Claude cannot create accounts/sign in on production, so the end-to-end submit→approve flow is tested by the owner.
- Phase 2 (not built yet): ratings, comments, report button.
