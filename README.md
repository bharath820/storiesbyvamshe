# Stories by Vamshe - Static Admin/User Mode

React app with:
- Public pages: Home, Gallery, Videos, VBlogs, About, Contact
- Admin panel: Categories, Gallery, Videos, Blogs, Homepage content
- Static local data flow (admin updates are reflected on public pages)

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

## 2) Admin Login (Dummy Credentials)

- URL: `/admin/login`
- Email: `admin@stories.local`
- Password: `Admin@12345`

This is temporary and intentionally hardcoded for local/static mode.

## 3) Static Data Behavior

- All admin content is saved in browser localStorage.
- Data persists across refreshes on the same browser/device.
- Data is not shared across different devices/browsers.
- Initial content is seeded from demo data and can be overridden from admin.

## 4) Media Behavior

- Gallery photos, blog covers, and homepage hero slides:
  - Public image URL supported and used for final save
  - Local image file selection supported for validation/preview only (max 5MB)
  - Static mode does not persist file binaries/base64 to localStorage
- Videos:
  - Embed URL supported
  - Video file upload is disabled in static mode

## 5) Contact Email Variables (Optional)

Preferred (EmailJS):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Fallback:
- `VITE_CONTACT_RECEIVER_EMAIL`

If EmailJS keys are missing, the contact form opens the default mail client using `mailto`.

## 6) Route Map

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
