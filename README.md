# UNIVERCE — REMAINING WORK
Version: 2.0
Last Updated: July 2026
Status: Core blueprint (v1.0) is functionally complete. This doc covers the next feature batch only.

---

## ✅ ALREADY DONE (from v1.0 blueprint — not repeating here)
Auth/signup with institutional email + username checks, profile edit/avatar upload,
post creation (photo/video + category + location), home feed with likes/comments/category
filters, realtime messaging, screenshot protection (global + per-chat, both platforms),
competition/leaderboard system, skeleton loading on Home.

Deferred intentionally (not in this batch): content moderation via Edge Functions,
email verification gate enforcement, Search screen, invite-code gating, analytics logging.

---

## THIS BATCH

### 1. Follow / Follow-Back Gated Messaging
**Goal:** Instagram-style — you can only DM someone if you follow each other, OR if the
target user has their DM privacy set to allow it. Otherwise a follow request goes out first.

**New table: `follows`**
- `follower_id` (UUID, FK → profiles.id)
- `following_id` (UUID, FK → profiles.id)
- `status` (enum: `pending`, `accepted`)
- `created_at` (timestamp)
- Composite PK on (`follower_id`, `following_id`)

**New column on `profiles`:**
- `message_privacy` (enum: `everyone`, `followers_only`, `mutuals_only`, default `mutuals_only`)
  — lets a user choose who can message them, toggled from Settings.

**Logic:**
- Sending a follow → insert row with `status = pending`.
- If the other person already sent you one (mutual follow-back) → both rows flip to `accepted`, OR simpler: on accept, insert the reverse row directly as `accepted`.
- Can DM if: `message_privacy = everyone`, OR (`followers_only` and I follow them, accepted), OR (`mutuals_only` and both directions are `accepted`).
- MessagesScreen / ChatScreen must check this before allowing message send — currently `ChatScreen.js` has zero follow-check, any two `user_id`s can message freely via `handleSend`. This needs a guard before the insert, plus UI: show "Follow" / "Requested" / "Message" states depending on relationship.
- RLS: `messages` INSERT policy needs a companion check (either in RLS itself or enforced via an Edge Function later) — for now, client-side gate is enough per your existing pattern (RLS enforcement is deferred like verification).

**Needs:** a Follow button somewhere (profile view screen — not yet in the uploaded files, may already exist in components not shared), a pending-requests inbox UI.

---

### 2. Fix Screenshot Protection Hierarchy Bug
**Bugs identified in `ChatScreen.js`:**

- **Bug A:** When User A turns Global Protection ON, User A themself should still be blocked from screenshotting *their own view of the chat* per the spec's intent (protection is about that chat being unscreenshottable, not about "not this specific person"). Currently `checkProtection()` only checks `otherProfile.screenshot_protection_global` (i.e. checks the *other* user's global flag) — so if **User B** is chatting with **User A** and User A has global ON, User B is blocked, but if User A is viewing the same chat, `otherProfile` in that render is User B, and User B's global flag is what gets checked — meaning User A (who turned protection on) is *not* blocked by their own setting unless User B also enabled it. That's actually correct per your spec ("Global protection on User A blocks everyone else") — but you're reporting the reverse is happening (A can screenshot when B hasn't enabled anything). That means the bug is that **the global check is being evaluated with the wrong user's ID** somewhere, or the per-chat fallback is masking it. Needs a live test with logging on `otherProfile?.screenshot_protection_global` to confirm which side is being read.
- **Bug B:** No UI exists anywhere in `ChatScreen.js` to toggle **per-chat** protection when global is OFF — the state (`perChatBlock`) and the update function (`togglePerChatProtection`) already exist in the code, but there's no button/switch in the render tree that calls it. It's dead code right now. Needs a toggle in the chat header (e.g. tap the lock icon to open a small menu, or a switch in a chat-specific settings sheet).

**Fix scope:** re-verify the ID being passed into the global-protection query is always the *other* participant regardless of who's viewing, wire up the missing per-chat toggle UI, and add a visual indicator so each user can see the current protection state clearly (not just the lock icon when active).

---

### 3. Comments Bottom Sheet — Swipe to Close Broken
`CommentsSheet.js` wasn't included in the shared files, so exact cause can't be diagnosed yet.
**Needs:** the actual `CommentsSheet.js` source. Common causes for swipe-to-dismiss failing in a
bottom sheet: gesture handler not wrapping the drag handle, `panResponder`/`Animated` values not
resetting on reopen, or the sheet using a plain `Modal` without a pan gesture at all (in which case
swipe was never implemented, only tap-outside-to-close). Once the file's available this is a quick fix.

---

### 4. Skeleton Loading — Extend Coverage
Already have `Skeleton.js` with `SkeletonBlock` and `PostCardSkeleton`, already wired into Home.
**Needs new skeleton variants + wiring into loading states for:**
- Search screen (once built)
- Messages screen (`MessagesScreen.js` — currently just a spinner (`ActivityIndicator`) during `loadConversations`; swap for a `ConversationRowSkeleton` list)
- Competition screen (`CompetitionScreen.js` — currently a centered spinner; needs `LeaderboardRowSkeleton` for the three lists)
- Profile screen (`ProfileScreen.js` — currently renders nothing but the title while loading; needs a `ProfileHeaderSkeleton`)

Same shimmer pattern as `PostCardSkeleton`, just different block shapes per layout.

---

### 5. Settings Screen + Move Screenshot Protection There
- Add a settings (gear) icon to `ProfileScreen.js` header, next to or replacing the edit-profile icon position.
- New `SettingsScreen.js` (needs a new stack entry in `ProfileStack.js`).
- Move the "Screenshot Protection" `settingRow` block (global toggle + label) out of `ProfileScreen.js` into `SettingsScreen.js`.
- Settings screen is also the natural home for the new `message_privacy` control from item #1, and Logout could move here too depending on preference (currently on ProfileScreen).

---

### 6. New Posts Not Appearing in Feed After Upload
In `CreatePostScreen.js`, after a successful insert, it just calls `navigation.goBack()` —
it never tells `HomeScreen` to refetch. `HomeScreen.js` reloads via `useFocusEffect` when the
screen regains focus, which *should* fire when navigating back... so the likely causes are:
- `CreatePostScreen` might not actually be inside the same navigator stack as `HomeScreen`'s focus boundary (e.g. it's presented modally outside the tab navigator, so going back doesn't re-focus Home the way `useFocusEffect` expects).
- Or activeCategory filter: if the new post's category doesn't match the currently active filter chip, it won't show — worth checking if that's actually the "bug" (post exists but filtered out).
- Possible race: `getPublicUrl` for a `upsert: false` bucket write on a brand-new file path should be immediate, so this is likely not a timing issue.
**Needs:** a quick check of where `CreatePostScreen` sits in the navigation tree (`navigation.getParent()?.navigate('CreatePost')` in `HomeScreen.js` suggests it's a sibling/modal outside the tab navigator — that's the prime suspect).

---

## OPEN QUESTIONS BEFORE BUILDING
- Files needed but not yet shared: `CommentsSheet.js`, `PostCard.js`, root navigator (`App.js`) to see how `CreatePostScreen` is mounted relative to `MainTabs`.
- Follow feature: do you want follow requests to show as a notification/badge, or just a pending list the recipient checks manually?
- `message_privacy` default — `mutuals_only` assumed here as the safest match to "just like Insta," confirm before I lock it in.