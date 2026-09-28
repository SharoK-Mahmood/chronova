# Chronova Mobile

Expo (React Native) storefront for iOS and Android, powered by the same Chronova API as the website.

## Prerequisites

1. Backend running (`cd backend && npm run dev`) on port **3001**
2. PostgreSQL up (`docker compose up -d` from the repo root)
3. [Expo Go](https://expo.dev/go) on your phone, **or** Android Studio / Xcode simulators

## Setup

```bash
cd mobile
cp .env.example .env
npm install
```

### API URL (important)

Edit `mobile/.env`:

| Where you run the app | `EXPO_PUBLIC_API_URL` |
|-----------------------|------------------------|
| Physical phone (same Wi‑Fi) | `http://YOUR_LAN_IP:3001/api` |
| Android emulator | `http://10.0.2.2:3001/api` |
| iOS simulator | `http://localhost:3001/api` |

Find your LAN IP on Windows with `ipconfig` (IPv4 Address).

Restart Expo after changing `.env`.

## Run

```bash
npm start
```

Then press `a` for Android, `i` for iOS (macOS), or scan the QR code with Expo Go.

From the repo root:

```bash
npm run dev:mobile
```

## What's included (v1)

- Home + product catalog (search / men / women filters)
- Product detail, add to bag, wishlist
- Local cart & wishlist (same storage keys/shapes as the web app)
- Sign in / register (JWT via SecureStore)
- USD / IQD display currency

## Not yet

- Full checkout / order placement UI
- Google Sign-In
- Admin

## Notes

- Product images load from `http://<api-host>:3001/uploads/...`
- iOS device builds need a Mac (or EAS Build). Expo Go works on both platforms without a Mac.
