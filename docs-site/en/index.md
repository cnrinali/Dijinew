# Dijinew API Documentation

This documentation set covers every public and protected endpoint that ships with the Dijinew platform. Use it as the single place to learn what each API does, which roles can call it, and the payloads it expects.

- **Production base URL:** `https://api.dijinew.com`
- **Local development base URL:** `http://localhost:5001`
- **Authentication:** Unless noted as public, requests must send an `Authorization: Bearer <JWT>` header issued by `POST /api/auth/login` or `POST /api/auth/register`.

## Contents

- [Authentication](api/authentication.md)
- [User Profile & Bank Accounts](api/users.md)
- [Cards (Private & Public)](api/cards.md)
- [Admin Console APIs](api/admin.md)
- [Corporate Workspace APIs](api/corporate.md)
- [Analytics & Tracking](api/analytics.md)
- [Activity Feed](api/activities.md)
- [Wizard Token APIs](api/wizard.md)
- [Simple Wizard APIs](api/simple-wizard.md)
- [Uploads](api/upload.md)
- [System Monitoring](api/system.md)

Each page documents:

1. Endpoint summary tables for quick scanning.
2. Detailed request/response contracts, including validation rules enforced by the current implementation.
3. Behavioural notes and edge cases pulled straight from the Express/MSSQL code.

> Tip: When testing protected routes manually, first call `POST /api/auth/login`, then reuse the returned token in Postman or curl with the `Authorization` header.
