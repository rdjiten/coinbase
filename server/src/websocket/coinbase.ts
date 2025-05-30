import WebSocket from "ws";

const COINBASE_WS_URL =
  process.env.COINBASE_WS || "wss://ws-feed.exchange.coinbase.com";

export function connectToCoinbaseFeed(
  onMessage: (data: any) => void
): WebSocket {
  const ws = new WebSocket(COINBASE_WS_URL);

  ws.on("open", () => {
    console.log("[Coinbase] WebSocket connected");
  });

  ws.on("message", (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      onMessage(parsed);
    } catch (err) {
      console.error("[Coinbase] Failed to parse message", err);
    }
  });

  ws.on("close", () => {
    console.warn("[Coinbase] WebSocket closed");
    
  });

  ws.on("error", (err) => {
    console.error("[Coinbase] WebSocket error", err);
  });

  return ws;
}
