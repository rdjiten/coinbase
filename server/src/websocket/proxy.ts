import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { connectToCoinbaseFeed } from "./coinbase";

type UserSession = {
  ws: WebSocket;
  subscribedProducts: Set<string>;
};

const userSessions = new Map<string, UserSession>();
let coinbaseWs: WebSocket | null = null;

// Global server-level subscription counter (reference counting)
const globalServerSubscriptionCounter = new Map<string, number>();

export function setupWebSocketProxy(server: WebSocketServer) {
  //  Connect to Coinbase WebSocket once
  coinbaseWs = connectToCoinbaseFeed((data: any) => {
    const { type, product_id } = data;

    if (!["l2update", "match"].includes(type)) return;

    //  Route messages only to subscribed clients
    for (const [, session] of userSessions) {
      if (session.subscribedProducts.has(product_id)) {
        if (session.ws.readyState === WebSocket.OPEN) {
          session.ws.send(JSON.stringify(data));
        }
      }
    }
  });

  // Handle client WebSocket connections
  server.on("connection", (clientWs) => {
    const userId = uuidv4();
    userSessions.set(userId, {
      ws: clientWs,
      subscribedProducts: new Set(),
    });

    console.log(`Client connected: ${userId}`);

    // Send initial server-wide status
    clientWs.send(
      JSON.stringify({
        type: "server_status",
        products: Array.from(globalServerSubscriptionCounter.keys()),
        channels: ["level2_batch", "matches"],
      })
    );

    clientWs.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        const { type, product_ids } = parsed;
        if (!coinbaseWs || !Array.isArray(product_ids)) return;

        const session = userSessions.get(userId);
        if (!session) return;

        if (type === "subscribe") {
          product_ids.forEach((p) => {
            // User-level subscription
            session.subscribedProducts.add(p);

            // Server-level counter
            const count = globalServerSubscriptionCounter.get(p) || 0;
            if (count === 0) {
              console.log(`[SERVER] Subscribing server to: ${p}`);
              coinbaseWs?.send(
                JSON.stringify({
                  type: "subscribe",
                  product_ids: [p],
                  channels: ["level2_batch", "matches"],
                })
              );
            }
            globalServerSubscriptionCounter.set(p, count + 1);
            broadcastServerStatus();
          });
        } else if (type === "unsubscribe") {
          product_ids.forEach((p) => {
            session.subscribedProducts.delete(p);

            const count = globalServerSubscriptionCounter.get(p) || 0;
            if (count > 0) {
              if (count === 1) {
                console.log(`[SERVER] Unsubscribing server from: ${p}`);
                coinbaseWs?.send(
                  JSON.stringify({
                    type: "unsubscribe",
                    product_ids: [p],
                    channels: ["level2_batch", "matches"],
                  })
                );
                globalServerSubscriptionCounter.delete(p);
              } else {
                globalServerSubscriptionCounter.set(p, count - 1);
              }
            }
            broadcastServerStatus();
          });
        }
      } catch (err) {
        console.error("Invalid message received from client", err);
      }
    });

    clientWs.on("close", () => {
      const session = userSessions.get(userId);
      if (!session) return;

      // When client disconnects, clean up subscriptions
      for (const product of session.subscribedProducts) {
        const count = globalServerSubscriptionCounter.get(product) || 0;
        if (count === 1) {
          console.log(`[SERVER] Unsubscribing server from: ${product}`);
          coinbaseWs?.send(
            JSON.stringify({
              type: "unsubscribe",
              product_ids: [product],
              channels: ["level2_batch", "matches"],
            })
          );
          globalServerSubscriptionCounter.delete(product);
        } else {
          globalServerSubscriptionCounter.set(product, count - 1);
        }
      }

      userSessions.delete(userId);
      console.log(`Client disconnected: ${userId}`);
      broadcastServerStatus();
    });
  });
}

// Broadcast server-wide subscription status to all clients
function broadcastServerStatus() {
  const status = {
    type: "server_status",
    products: Array.from(globalServerSubscriptionCounter.keys()),
    channels: ["level2_batch", "matches"],
  };

  for (const [, session] of userSessions) {
    if (session.ws.readyState === WebSocket.OPEN) {
      session.ws.send(JSON.stringify(status));
    }
  }
}
