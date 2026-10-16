# TechSix Preschool & Daycare — Website (demo)

A modern, mobile-friendly website for TechSix Preschool & Daycare, Suncity Avenue 76, Sector 76, Gurugram. It includes an admin panel for school staff.

Built with **React 18 + Vite 5 + Tailwind CSS 4**. PDFs are generated with jsPDF. It has light and dark mode.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview
```

The admin panel is at **`/admin`**. The demo password is `techsix2026`, set in `src/data/site.js`.

## Pages

| Route | What it does |
|---|---|
| `/` | Hero with "Admissions Open 2026–27", highlights, programs, latest notices, upcoming events, gallery and testimonials |
| `/about` | School story, vision and mission, values, principal's message |
| `/programs` | Playgroup, Nursery, LKG, UKG and Daycare: age group, timings, what children learn |
| `/downloads` | Class-wise PDFs (books, worksheets, syllabus, holiday homework) with filters and search |
| `/notices` | Notice board with date, "New" badge (last 7 days), Important flag and a PDF download for every notice |
| `/results` | Parent enters a roll number or name plus date of birth to view and download the report card as a PDF |
| `/gallery` | Albums with a lightbox |
| `/events` | Month calendar and a list of upcoming holidays, PTMs, Annual Day and Sports Day |
| `/admissions` | Enquiry form with validation; saved for the admin, with an optional WhatsApp hand-off |
| `/contact` | Address, phone, email, WhatsApp, timings, Google Map |
| `/admin` | Staff panel: dashboard, enquiries (status, call, WhatsApp, CSV export), notices, downloads, results, events, gallery, reset demo |

Every page also has a floating WhatsApp button, a sticky header and a footer.

## Placeholder checklist: replace before launch

All text content is in **`src/data/site.js`**. Search it for `PLACEHOLDER`.

- [ ] **Address and phone.** These come from a public listing (Block A, Tower B2, Sector 76; +91 86986 90097; admin@techsix.in). Confirm them with the school.
- [ ] **Tagline, stats** (500+ families, 1:12 ratio…) and **timings**
- [ ] **Principal's name, photo and message** (`about.principal`)
- [ ] **About-page story** (`about.story`)
- [ ] **Testimonials.** These are sample parent reviews.
- [ ] **Social media links** (`school.social`, currently `#`)
- [ ] **Logo.** The "T6" badge is in `Logo()` in `src/components/ui.jsx` and `public/favicon.svg`.
- [ ] **Photos.** Every illustrated tile labelled "Placeholder photo" needs a real image. Gallery photos can be uploaded from Admin → Gallery. For page photos (About, Programs), replace `<PhotoPlaceholder>` with an `<img>`.
- [ ] **Events calendar dates.** Confirm them with the school's academic calendar.
- [ ] **Remove the demo hints** on `/results` and `/admin`. Search for `DEMO ONLY`.

## Going live (important)

This demo stores all data **in the browser**: localStorage for records, IndexedDB for uploaded PDFs and photos. That is enough for a sales demo, but it means:

- Uploads made on one device are **not visible to parents on other devices**.
- The admin password is checked in the browser, so it is **not secure**.

Before real launch, connect a backend. Every read and write goes through `src/lib/store.js` (`getAll`, `addItem`, `updateItem`, `removeItem`, `saveFile`, `getFile`), so only that file needs to change. Good low-cost options:

- **Supabase** (Postgres + Storage + Auth). Free tier, easy for this use case.
- **Firebase** (Firestore + Storage + Auth)

Also check results on the server, so a parent only gets a report back when the roll number and date of birth match.

## Deploy

Works on Vercel (`vercel.json`) and Netlify (`public/_redirects`). Deploy the `dist/` folder.
