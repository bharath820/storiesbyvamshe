# Stories by Vamshe

React app with:
- Public pages: Home, Gallery, Videos, VBlogs, About, Contact
- Admin panel: Categories, Gallery, Videos, Blogs, Homepage content
- Shared Firebase content flow with a browser-local demo fallback

## 1) Setup

1. Install dependencies
```bash
npm install
```
2. Copy env file and add optional contact credentials
```bash
cp .env.example .env
```
3. Start development
```bash
npm run dev
```

## 2) Firebase Setup

1. Create a Firebase project and enable Email/Password Authentication, Firestore, and Storage.
2. Copy `.env.example` to `.env` and fill every `VITE_FIREBASE_*` value.
3. Create the admin user in Firebase Authentication.
4. Deploy `firestore.rules` and `storage.rules` with the Firebase CLI.

When Firebase is configured, public pages listen for published content in real time and admin uploads are stored in Firebase Storage.

## 3) Admin Login

- URL: `/admin/login`
- Use the Firebase Authentication user created during setup.
- If Firebase is not configured, local demo credentials are `admin@stories.local` / `Admin@12345`.

This is temporary and intentionally hardcoded for local/static mode.

## 4) Demo Fallback

- Bundled demo content is used only when Firebase environment variables are missing.
- Demo changes persist in the current browser and are not mixed with Firebase data.

## 5) Media Behavior

- Gallery photos support multi-image drag and drop and publish immediately.
- Homepage images, blog covers, and video thumbnails use drag-and-drop uploads.
- Images are limited to 5MB and stored in Firebase Storage when configured.
- Videos:
  - Embed URL supported
  - Video file upload is disabled in static mode

## 6) Contact Email Variables (Optional)

Preferred (EmailJS):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Fallback:
- `VITE_CONTACT_RECEIVER_EMAIL`

If EmailJS keys are missing, the contact form opens the default mail client using `mailto`.

## 7) Route Map

- `/`
- `/gallery`
- `/videos`
- `/blogs`
- `/blogs/:slug`
- `/about`
- `/contact`
- `/admin/login`
- `/admin`
- `/admin/categories`
- `/admin/photos` (Gallery)
- `/admin/videos`
- `/admin/blogs`
- `/admin/homepage`
