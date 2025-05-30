# Crypto Real-Time Order Book (Client)

This is the frontend React application that allows users to:

* Subscribe and unsubscribe to real-time crypto trading pairs.
* View live order books and trades for each subscribed product.
* Monitor backend WebSocket system status.

---

## Tech Stack

* React (18+)
* TypeScript
* Redux Toolkit
* WebSocket (frontend)
* Vite

---

## Environment Variables

You must configure the backend WebSocket URL via:

```env
VITE_WS_URL=ws://localhost:8080
```

---

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

---

## Testing

Run frontend tests:

```bash
npm run test
```

---

## Features

* Fully real-time WebSocket updates.
* Server-managed subscriptions.
* Automatic reconnect & resubscribe.
* Per-user isolated data updates.
* Professional high-frequency trading data standards.
