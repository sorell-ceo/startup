PROJECT BLUEPRINT: CAMPUS CONNECT (Social App for Verified College Students)
Version: 1.0
Last Updated: July 2026
Pilot Size: Exactly 1000 users
Core Philosophy: Backend is Supabase. Frontend is React Native (Expo Go). No custom backend servers.

1. PROJECT VISION
A private social media ecosystem exclusively for verified college students. Users can share reels/photos about clubs, hostel life, events, and academics. The app features real-time direct messaging (no end-to-end encryption for moderation purposes), a strict verification gate (institutional email), and a dual-layer screenshot protection system.

2. DEFINITIVE TECH STACK
Layer	Technology
Frontend Framework	React Native (Expo Go / Expo Managed Workflow)
Backend-as-a-Service (BaaS)	Supabase (Free Tier – sufficient for 1000 users)
Database	Supabase PostgreSQL (Acts as the central "Filing Cabinet")
Authentication	Supabase Auth (Handles sign-up, login, email verification)
File Storage	Supabase Storage (Stores profile pictures and Reels/Video content)
Real-time Features	Supabase Realtime (WebSockets for instant messaging and live feed updates)
Custom Logic / Moderation	Supabase Edge Functions (Serverless TypeScript functions for profanity/toxicity detection)
3. DATABASE SCHEMA (The "Filing Cabinet")
We design these tables inside the Supabase SQL Editor / Table Editor.

A. profiles table (Extends the built-in auth.users)

id (UUID, Primary Key) -> Links directly to auth.users.id.

full_name (text)

college_email (text, unique) -> The verified institutional email (e.g., .edu).

college_name (text)

graduation_year (integer)

bio (text)

avatar_url (text, nullable) -> Stores the public Supabase Storage path for the profile picture.

is_verified (boolean, default: false) -> CRITICAL: Gates all app access.

screenshot_protection_global (boolean, default: false) -> If true, blocks EVERYONE from screenshotting this user's chats.

created_at (timestamp)

B. posts table (For Reels, Photos, Event uploads)

id (UUID, Primary Key)

user_id (UUID, Foreign Key -> profiles.id)

media_urls (text array) -> Supports carousels or single reels.

caption (text)

category (enum: 'club', 'event', 'hostel', 'study', 'campus')

location_tag (text, e.g., "Library 2nd Floor")

created_at (timestamp)

C. comments table

id (UUID, Primary Key)

post_id (UUID, Foreign Key -> posts.id)

user_id (UUID, Foreign Key -> profiles.id)

content (text)

flagged (boolean, default: false) -> Marked by the detection system if hate speech/profanity is found retrospectively.

created_at (timestamp)

D. likes table (Junction table)

post_id (UUID, Foreign Key -> posts.id)

user_id (UUID, Foreign Key -> profiles.id)

(Composite Primary Key of post_id + user_id to prevent duplicate likes)

E. messages table (Direct Chats - No End-to-End Encryption)

id (UUID, Primary Key)

sender_id (UUID, Foreign Key -> profiles.id)

receiver_id (UUID, Foreign Key -> profiles.id)

content (text)

is_read (boolean, default: false)

reported_count (integer, default: 0)

created_at (timestamp)

Note: No conversation ID table needed for 1k users. Queries simply filter by sender/receiver combination.

F. chat_privacy_settings table (For Per-Profile Screenshot Protection)

id (UUID, Primary Key)

user_id (UUID, Foreign Key -> profiles.id) -> The "Protector".

target_user_id (UUID, Foreign Key -> profiles.id) -> The specific person restricted from taking screenshots.

block_screenshots (boolean, default: false)

updated_at (timestamp)

G. reports table (Moderation Queue)

id (UUID, Primary Key)

reporter_id (UUID, Foreign Key -> profiles.id)

target_type (enum: 'post', 'comment', 'message')

target_id (UUID) -> The ID of the offending post/comment/message.

reason (text)

status (enum: 'pending', 'dismissed', 'action_taken')

created_at (timestamp)

H. screenshot_attempts table (Logging for iOS deterrence)

id (UUID, Primary Key)

protector_user_id (UUID, Foreign Key -> profiles.id) -> Who enabled the protection.

violator_user_id (UUID, Foreign Key -> profiles.id) -> Who took the screenshot.

detected_at (timestamp)

4. AUTHENTICATION & VERIFICATION FLOW (The "Gatekeeper")
Sign-Up: User enters their institutional email and password in the React Native app. App calls supabase.auth.signUp().

Email Confirmation: Supabase Auth automatically sends a verification link to that institutional email.

The Click: User clicks the link in their email.

Auto-Verification: Supabase triggers a Database Webhook (or PostgreSQL Trigger) that sets is_verified = TRUE in the profiles table for that user.

The Block (RLS Policy):

If is_verified is FALSE, the user is restricted by Row Level Security (RLS).

They can ONLY see the "Verify Your Email" screen. They cannot view the feed, upload posts, send messages, or see other profiles.

5. STORAGE STRATEGY (Profile Pictures & Reels)
Bucket Name 1: avatars

Path: public/avatars/{user_id}.jpg (Overwrites old ones).

Optimization: Use Supabase Image Transformation (e.g., ?width=100&height=100) to generate thumbnails on the fly without storing multiple versions.

Bucket Name 2: reels

Path: public/reels/{post_id}/{timestamp}.mp4.

Pilot limit warning (1GB free storage): We force video compression in the Expo app using expo-image-manipulator before upload to keep files under 5MB.

6. THE "REELS" & FILTERS LOGIC
Important Distinction:

The visual filters (color grading, contrast, saturation) are 100% Frontend.

The React Native app applies filters locally using libraries (e.g., react-native-image-filter or vision-camera) before uploading.

The Supabase backend only receives and stores the final, processed video/image. The backend has no role in rendering filters.

7. MESSAGING & WEBSOCKETS (Realtime)
Technology: Supabase Realtime (WebSockets built into the PostgreSQL database).

Subscription Logic: When a user opens a chat, the React Native app subscribes to the messages table, filtering specifically for sender_id = myID OR receiver_id = myID.

Sending: User types message -> App performs an INSERT into the messages table.

Receiving: Because the other user is subscribed, Supabase Realtime broadcasts the new row to their device instantly. No manual refresh or polling required.

Security (RLS): Policies ensure a user can only subscribe to messages where they are either the sender OR the receiver.

8. CONTENT DETECTION SYSTEM (Profanity & "Daresjein")
Flow A: "Before Upload" (Prevention) - Done via Edge Functions

User types a caption/comment and taps "Post".

The App sends the text to a Supabase Edge Function.

The Edge Function runs a toxicity/profanity detection filter.

If flagged (Offensive): Edge Function returns an "Error: Blocked" response to the App. The text is never inserted into the Database.

If clean: Edge Function successfully performs the INSERT into the posts or comments table on behalf of the user.

Flow B: "After Upload" (Retrospective Check)

A scheduled cron job (or daily Edge Function run) scans existing posts and comments for outdated flagged words. If found, it sets the flagged column to TRUE so admins can review it later.

9. SCREENSHOT PROTECTION (Global vs. Per-Profile Logic)
The Absolute Rule (Hierarchy):

Rule 1 (Global): If profiles.screenshot_protection_global = TRUE for User A -> EVERYONE is blocked from taking screenshots of User A's chat.

Rule 2 (Per-Profile): If Global is FALSE, the app checks chat_privacy_settings. If block_screenshots = TRUE for the specific target_user_id -> ONLY that specific person is blocked.

The Logic the App runs when User B opens chat with User A:

text
If (UserA.global_protection == true) {
   Block screenshots for User B immediately.
} Else if (chat_privacy_settings.exists(userA, userB) == true) {
   Block screenshots ONLY for User B.
} Else {
   Allow screenshots.
}
Platform Enforcement:

Android: Use expo-screen-capture to set the native FLAG_SECURE. This physically prevents the OS from capturing the screen.

iOS: Apple does NOT allow blocking hardware screenshots.

Solution: The app uses expo-screen-capture to detect the screenshot event.

Action: The app instantly blurs the chat content, logs the attempt to screenshot_attempts, and sends a push notification to User A saying "User B attempted a screenshot!"

Realtime Update: If User A toggles Global ON/OFF, Supabase Realtime broadcasts this change to all active chat windows instantly. The chat screen applies or removes the block without the user restarting the app.

10. AUTHORIZATION (Row Level Security - RLS)
Instead of writing middleware, we write RLS policies directly in the Supabase Dashboard (simple SQL snippets that act as bouncers for every request).

Policy (Profiles): SELECT allowed only if auth.uid() = user_id OR is_verified = true.

Policy (Posts): INSERT allowed only if auth.uid() = user_id AND the user's profile has is_verified = true.

Policy (Messages): SELECT/INSERT allowed only if auth.uid() equals either sender_id or receiver_id.

Policy (Chat Privacy): UPDATE allowed only if auth.uid() = user_id (Only the protector can change their own settings).

11. THE REPORTING & MODERATION WORKFLOW
User sees offensive content -> Clicks "Report".

App inserts a row into the reports table (status: 'pending').

Admin (you) checks the Supabase Dashboard or an internal "Admin Panel" screen in the app.

Admin sees the exact offending content (because no E2E encryption means the text is readable).

Admin clicks "Take Action" -> App updates reports.status to 'action_taken' and triggers a Database function that deletes the specific row from messages or comments.

Because Realtime is active, the deletion instantly removes the message from the other user's phone.

12. THE "1000 USERS" PILOT STRATEGY
Invite-Only Access: Hardcode a 6-digit "Invite Code" into the Expo app for the first batch, or manually whitelist the 1000 emails in the Supabase Auth panel.

Analytics: Since Supabase Free Tier doesn't have deep analytics, we add a simple user_activities log table to track screen views (e.g., "User X opened Feed at 2 PM") just to gauge engagement.

Scalability Check: The free tier offers 500MB Database and 1GB Storage. 1000 users posting compressed reels (under 5MB) will stay within this limit comfortably.

13. DEVELOPMENT WORKFLOW (How to Build Simultaneously)
Phase	Task	Supabase Action	React Native (Expo) Action
Week 1	Setup Core	Create Tables & RLS Policies in Dashboard. Install @supabase/supabase-js SDK.	Create AuthContext to handle Login/Signup. Test if is_verified blocks the feed.
Week 2	Profile & Uploads	Create avatars and reels Storage Buckets. Set public permissions.	Build Profile screen. Connect file picker to upload images/videos to Supabase Storage.
Week 3	Feed & Reels	Write query logic to fetch posts with order by created_at desc. Add category filters.	Build the scrolling Feed UI. Connect Supabase queries to the FlatList.
Week 4	Messaging	Enable Realtime on the messages table. Write Edge Function for profanity detection.	Build Chat UI. Subscribe to Realtime channel. Connect the "Send" button to the Edge Function.
Week 5	Privacy & SS Protection	Add chat_privacy_settings table. Write RLS policies for it.	Integrate expo-screen-capture. Implement Global vs Per-Profile logic in the Chat screen.
Week 6	Moderation	Add reports table. Write deletion function.	Build Admin Report panel view. Connect "Report" button to insert into reports.

14. Loading Screen, those Gray kind of things which make the app feel like data is loading... for Content for main screen, comments, likes, messages especially.



THE END OF README
