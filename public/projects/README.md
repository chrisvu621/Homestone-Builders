# Project photos

Put **real photos of completed Homestone Builders projects** in these folders.
Do not add stock photos or AI-generated images here — everything in these
folders is presented on the site as Homestone's own work.

| Folder           | Shown on                                        |
| ---------------- | ----------------------------------------------- |
| `kitchens/`      | Gallery (Kitchens), Kitchen Remodeling page, homepage |
| `bathrooms/`     | Gallery (Bathrooms), Bathroom Remodeling page, homepage |
| `shower-doors/`  | Shower Doors page (and gallery, once it has photos) |
| `adus/`, `new-homes/`, `windows-doors/` | Gallery, once they have photos |

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Next.js resizes and
  compresses them automatically; originals up to ~4000px wide are fine.
- Photos are shown in filename order. Name them `kitchen-01.jpg`,
  `kitchen-02.jpg`, … to control the order.
- Strip GPS/location metadata from phone photos before uploading if you do
  not want customers' addresses embedded in the files.
- After adding photos, rebuild/redeploy (pages are generated at build time).

## Optional: `photos.json`

Copy `photos.example.json` to `photos.json` to set descriptive alt text,
choose the homepage hero photo, hide a photo without deleting it, or show a
photo on another service page too (`"also": ["shower-doors"]`). Keys are
`<folder>/<filename>`.
