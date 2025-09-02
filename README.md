# MyCart

A mobile-first shopping list application built with **Vue 3**, **Pinia**, **Capacitor**, and **SQLite**.

- Manage multiple lists and products.
- Fully persistent storage on **Android** using SQLite.
- Designed for native mobile deployment.

---

## Features

- Create, update, and delete shopping lists.
- Add or remove products from lists.
- Store data in a **SQLite database** on Android.
- Reactive UI powered by **Vue 3 + Pinia**.

---

## Prerequisites

- Node.js >= 18
- npm or yarn
- Android Studio
- Capacitor CLI

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server (Web)

```bash
npm run dev
```

> SQLite functionality will only work on Android, web will skip database initialization.

### 3. Build for production

```bash
npm run build
```

### 4. Copy build to Capacitor

```bash
npx cap copy android
```

### 5. Open Android project

```bash
npx cap open android
```

---

## Running on Android

1. In Android Studio, select your device/emulator.
2. Click **Run → Run 'app'**.
3. The app will launch on your device/emulator with SQLite storage fully functional.

---

## Generating APK (Release)

1. In Android Studio, go to **Build → Generate Signed Bundle / APK…**
2. Choose **APK → Next**
3. Create a new **Key Store** or use an existing one.
4. Fill in alias, password, and key information.
5. Select **Build Type = release**
6. Click **Finish**
7. APK will be generated in:

```
android/app/release/app-release.apk
```

Optional: build via terminal

```bash
cd android
./gradlew assembleRelease
```

---

## Project Structure

```
src/
├─ components/       # Vue components
├─ stores/           # Pinia stores
├─ views/            # Vue pages
└─ main.ts           # App entry point

dist/                 # Production build
android/              # Capacitor Android project
```

---

## Notes

- SQLite is **only initialized on Android**.
- For Web, database-related actions are skipped.
- Make sure your device/emulator is running **Android API 29+** for full compatibility.

---

## License

MIT License
