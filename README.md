# Job Application Tracker

A React + Vite job application tracker built for CS 571. The app uses React Bootstrap for the UI, React Router for navigation, and now supports Firebase Authentication + Firestore for cloud-backed application data.

## Current Features

- Dashboard page with live tracker stats
- Applications page with add, edit, delete, bookmark, filter, search, and sort
- Resources page with job-search and interview-prep links
- Google sign-in through Firebase Authentication
- Firestore-backed application storage per signed-in user
- Local-storage fallback when Firebase env vars are not configured

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Fill in the `VITE_FIREBASE_*` values from your Firebase project.
4. Run `npm run dev`.

If Firebase is not configured, the tracker still works locally using browser storage.

note - top bar includes name kind of like a watermark
