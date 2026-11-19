# Daily social schedule (cron, Muscat time = machine local time)

Cron jobs live only in the open Claude session (7-day expiry) — re-create with CronCreate if the session was restarted. Chrome extension must be connected. Methods: `social-posting.md` (stories/FB page), `social-groups-campaign.md` + memory `fb_groups_campaign_status.md` (group recipe). Log each run in `comment.md` (one short block) and `memory/daily_social_state.md` (pool + rotation). Close the browser tab after each run.

| Time | Job |
|---|---|
| 07:00 + 19:00 | 5 group POSTS (personal profile "Adawati Adawati", NOT the Page - owner 2026-11-14) in groups where posts publish without approval |
| 11:00 | Page story (new image each day, link button "Learn more", utm_medium=story) |
| 13:00 | Page feed post (new image/text each day) |
| 15:00 | Quiz challenge: 10 comments (profile "Adawati Adawati") on posts in 10 groups: result + "كم جبت؟" |
| 17:00 | New-game promo: Page post+story AND personal-profile post+story (owner 2026-11-16, daily; direct game link, utm medium page/story/profile) |
| all | APP CTA (owner 2026-11-16): Page posts+stories end with "حمّل تطبيق أدواتي من Google Play" + Play link (referrer utm); group posts/comments mention the app name only (no 2nd link). Installs: 13 on 2026-11-16 |
| 23:00 | App promo: Page post + story promoting the Play Store app (utm_medium=app-promo)|

Rules
- Pick a different tool/quiz each day (check `daily_social_state.md` for the last ones used). Page must exist under `jo/`; utm: `?utm_source=fb&utm_medium=<story|page|groups|comment>&utm_campaign=<group-id or date>-<n>`.
- No-approval pool: a group qualifies when the post gets NO "submitted to group admins" toast and no "Pending admin approval" banner. Pool is saved in `no-approval-groups.md` (read it first, update it each run); each run also tests 2-3 new joined groups to grow it. If the pool has <5, post to what exists, then search more via `search/groups/?q=` + "My groups" toggle (separate JS call), and test with one post.
- Never post the same tool in the same group twice in 7 days; max 1 post per group per run.
- Comments: verify via reload + `/Pending admin approval/` test; comment on an existing recent post (not own). Skip groups with no comment box.
- Stop and report if FB shows a restriction/"Action blocked"/checkpoint — don't retry.
- Posts: shift+Return for newlines (plain Return submits). Wait ~4 s for link preview before Post.
- Story image: `tools/social-templates/story_cook.html` is the template (copy + edit title/sub), render headless Chrome 1080×1920, copy PNG into the session scratchpad dir (file_upload only reads session folders), upload via `input[type=file]` on `facebook.com/stories/create`.

## Verify posting is allowed — EVERY run (owner rule 2026-11-09)
Before and after every group post/comment:
1. **Before:** the group page has a "Write something" box for the Page (else skip) and no onboarding/rules dialog blocking it; open `/groups/<id>/about` (or the Rules section) and skip the group if rules ban links/ads/promotion/self-promotion.
2. **After posting:** wait for the modal to close, then reload the group page and check `/Pending admin approval|submitted to group admins/` in body text AND that the post is visible in the feed (`document.body.innerText` contains the first line of the post). Held, missing, or removed = group NOT allowed: drop it from the pool in `daily_social_state.md` (note date/reason) and don't count it toward the 5.
3. If fewer than 5 verified posts result, search for replacement groups (joined only) and test them until 5 are verified live or candidates run out; report the shortfall.
4. The report lists per group: verified-live / held / skipped (no box / rules ban links).

## Restoring the jobs
Cron jobs are session-only (gone on /clear, exit, or after 7 days). Run `/start-social-jobs` (`.claude/commands/start-social-jobs.md`) to re-create them from `tools/social-templates/cron-jobs.json` (cron set to :40 to offset the scheduler's up-to-15-min jitter). Keep the session open and idle.

## Instagram + X (owner 2026-11-19)
- Accounts open and logged in in the owner's Chrome. IG: link in bio, feed posts/reels only (no web stories). X: handle @adawati20270, ≤280 chars, ONE Play link with `referrer=utm_source%3Dx%26utm_medium%3Dsocial%26utm_campaign%3D<topic>`.
- Daily: reuse the 13:00 / 17:00 promo (same video/image + short Arabic text with install line) on both.
- X: navigate via twitter.com (x.com blocked); composer → `find` file input → `file_upload` → Post. IG: Create → Post → file input → upload → OK → Next ×3 → caption → Share (~30 s).
- Done 2026-11-19: IG profile + first Reel; X profile + first post (marble video).
