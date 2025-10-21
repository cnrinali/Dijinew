# Upload API

`POST /api/upload` handles single image uploads. The route is public today (no authentication middleware), so you may want to secure it behind a proxy or add `protect` once the frontend wiring is complete.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/upload` | Accepts a single file under the `image` field and stores it in `server/uploads/`. |

## Request Requirements

- Content-Type must be `multipart/form-data`.
- Field name: `image`.
- Maximum size: 10 MB (enforced by Multer).
- Accepted MIME types: any `image/*`.

## Response

On success (`200`):
```json
{
  "message": "Dosya başarıyla yüklendi",
  "filePath": "/uploads/image-1709999999999-123456789.png"
}
```

The server statically serves the `uploads/` directory, so clients can construct the full URL by prefixing the API origin (e.g., `https://api.dijinew.com/uploads/...`).

Errors are returned with status `400` for unsupported file types, missing files, or Multer validation failures.
