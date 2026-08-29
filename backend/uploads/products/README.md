# Product image library

All Chronova product photos live here — not in the database.

## Layout

```text
uploads/products/
  {model-slug}/
    {model-slug}.avif
    {model-slug}-2.jpg
    {model-slug}-3.png
```

- **`{model-slug}`** = the product **slug** from admin (e.g. `tank-must`, `land-dweller-40`)
- New admin uploads are named `{slug}.ext`, then `{slug}-2.ext`, `{slug}-3.ext`, …
- The database only stores URLs like `/uploads/products/tank-must/tank-must.avif`

## Ways to add images

1. **Admin** — upload on Add/Edit product (uses the product slug as the folder)
2. **Manual** — create `uploads/products/{slug}/`, drop files in, then paste the URL in admin:
   `/uploads/products/{slug}/your-file.avif`

## Notes

- Do not put image binaries in SQLite
- Keep folder names lowercase kebab-case (same as product slug)
- Removing an image in admin deletes the file from this folder and updates the DB URLs
- Deleting a product removes its DB record and the entire `{model-slug}/` folder
- Deleting a product also removes its local upload files
