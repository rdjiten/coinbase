# Crypto Real-Time WebSocket Proxy (Server)

This is a Node.js WebSocket proxy server that:

* Manages all user WebSocket connections.
* Aggregates real-time market data from Coinbase.
* Controls global subscription management to Coinbase feed.
* Broadcasts relevant data to each connected client.

---

## Tech Stack

* Node.js (18+)
* TypeScript
* WebSocket (`ws`)
* Coinbase Pro WebSocket API

---

## Environment Variables

Create a `.env` file with:

```env
PORT=8080
COINBASE_WS=wss://ws-feed.exchange.coinbase.com
```

---

## Development

Install dependencies:

```bash
npm install
```

Run the WebSocket server in development mode:

```bash
npm run dev
```

Build the production server:

```bash
npm run build
```

Run the built production server:

```bash
npm run start
```

---

## Testing

The server includes full integration tests for WebSocket behavior:

```bash
npm run test
```

Tests include:

* End-to-end subscribe/unsubscribe tests
* Fully mocked Coinbase feed
* Per-user session testing
* Global reference counter verification

---

## Key Features

* Proxy WebSocket server between client and Coinbase.
* Centralized subscription management.
* Global reference-counting logic for efficient exchange feeds.
* Fully isolated per-user subscriptions.
* High latency architecture principles followed.

---

## System Flow

1. Client sends subscribe/unsubscribe requests.
2. Server manages local and global subscriptions.
3. Server connects to Coinbase feed.
4. Server distributes real-time market data to subscribed clients.
5. Client UI updates in real-time.
