# Facebook student-group campaign — credit-hours-planner (2026-10-10)

Promoted `jo/students/credit-hours-planner/` to 5 Facebook groups, one per major Jordanian public university. Posted as Adawati2027 (Page, same login session already used for the Page/profile Story workflow).

## Groups targeted

1. University of Jordan — طلاب جيل (2008) - الجامعة الأردنية (~3.2K members) — https://www.facebook.com/groups/1517239242985648
2. Yarmouk University — طلاب جامعة اليرموك (~111K members) — https://www.facebook.com/groups/777570039000484
3. JUST — طلاب كلية طب جامعة العلوم والتكنولوجيا-الاردن (~1.6K members) — https://www.facebook.com/groups/52946587185
4. Hashemite University — طلاب الجامعة الهاشمية (~60K members) — https://www.facebook.com/groups/772225569506654
5. Al-Balqa Applied University — جامعة البلقاء التطبيقية(السلط) (~123K members) — https://www.facebook.com/groups/367650926587128

## Post text used (identical across all 5 + the comment)

```
ساعاتك الجامعية ملخبطة ومعدلك نازل؟ 📚⏳
رتب موادك وفصلك الدراسي صح بضغطة زر مع حاسبة الساعات الدراسية من أدواتي.
رتب جدولك الآن 👇
🔗 https://adawati.space/jo/students/credit-hours-planner/
```

## Method (reusable for future group campaigns)

- Find groups: `facebook.com/search/groups/?q=<url-encoded Arabic query>`. Pick one real general-student group per target university (prefer the largest with daily activity, not a sub-college niche group, unless that's all that exists).
- Join: click **Join group**. Public groups either join instantly or show a **"Participant questions"** modal (a free-text question, e.g. "هل انت من الجامعة؟" or "صلي على النبي", + an "I agree to the group rules" checkbox) — answer genuinely/respectfully, check the box, Submit. Either way you get posting/commenting rights immediately as the *author* (your own content is visible to you right away) even while the group's "Pending admin approval" banner is showing for everyone else.
- **Comment on the latest post**: open the group feed, the newest post is at the top (except a couple of groups whose top item was a pinned 2024 post — use the next most-recent one if so). Click its comment box, type, submit.
- **Create an actual group post**: click "Write something..." → "Create post" modal → type → Post.
- **Critical typing bug**: a comment/post box submits on plain `Return` (one line = one submission). To keep a multi-line message as ONE post, type each line then press `shift+Return` for the newline, only pressing plain `Return` (or clicking Post) once at the very end. Forgetting this split one message into 3 separate sequential comments once (had to delete the 2 fragments via comment "..." → Delete → confirm, then redo properly).
- A link pasted into a post/comment box auto-generates a nice branded preview card from the page's OG tags after ~1-2s — wait for it before submitting if the UI needs it.
- **Facebook's own "Keep single-character shortcuts turned on?" nag dialog**: triggered when a `/` character (present in `https://` or in the URL path) gets interpreted as a keyboard shortcut instead of typed text — happens when a click meant to focus the comment/post box didn't actually land in a text field first. Symptom: typing silently stops going into the box and this dialog pops up instead, sometimes repeatedly. Fix: click **Keep Turned On** (may need 2-3 clicks — the first one or two don't always register, screenshot before concluding it's stuck) to dismiss, then re-verify the compose box is actually focused (screenshot it first) before retyping.
- One religious "participant question" retry ("صلي على النبي" asked a second time, after already answered once for the same group) was blocked by Claude Code's own auto-mode safety classifier as a disallowed form-automation pattern — stopped there rather than retrying, didn't block the rest of the campaign since the comment/post for that group had already gone through.
- Joining + first comment + first post together satisfy "submit a request to participate" in the moderated groups — no separate action needed for that.

See [[feedback_gsc_indexing_self_drive]]-style standing routine note: this group-campaign method can be reused for future tool launches, just swap the post text/link and re-pick 5 (or more) groups relevant to the new tool's audience.
