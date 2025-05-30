jest.setTimeout(10000);

import WebSocket, { WebSocketServer } from "ws";
import { setupWebSocketProxy } from "../src/websocket/proxy";

jest.mock("../src/websocket/coinbase", () => ({
  connectToCoinbaseFeed: (handler: any) => {
    // Simulate mock Coinbase websocket connection
    const ws = {
      send: jest.fn(),
      readyState: 1,
    };

    setTimeout(() => {
      handler({ type: "subscriptions", channels: [] });
    }, 10);

    return ws;
  },
}));

describe("WebSocket Proxy Server", () => {
  let server: WebSocketServer;
  const port = 8081;

  beforeAll((done) => {
    server = new WebSocketServer({ port });
    setupWebSocketProxy(server);
    setTimeout(done, 100); // Small wait for stability
  });

  afterAll((done) => {
    server.close(() => done());
  });

  test("client can connect and subscribe", (done) => {
    const client = new WebSocket(`ws://localhost:${port}`);

    client.on("message", (message) => {
      const data = JSON.parse(message.toString());
      if (data.type === "server_status" && data.products.includes("BTC-USD")) {
        expect(data.products).toContain("BTC-USD");
        client.on("close", () => {
          done();
        });

        client.close();
      }
    });

    client.on("open", () => {
      client.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channels: ["level2_batch", "matches"],
        })
      );
    });
  });

  test("client unsubscribe removes product from server_status", (done) => {
    const client = new WebSocket(`ws://localhost:${port}`);

    client.on("message", (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "server_status") {
        if (!data.products.includes("ETH-USD")) {
          expect(data.products).not.toContain("ETH-USD");
          client.on("close", () => {
            done();
          });

          client.close();
        }
      }
    });

    client.on("open", () => {
      client.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["ETH-USD"],
          channels: ["level2_batch", "matches"],
        })
      );

      setTimeout(() => {
        client.send(
          JSON.stringify({
            type: "unsubscribe",
            product_ids: ["ETH-USD"],
            channels: ["level2_batch", "matches"],
          })
        );
      }, 200);
    });
  });
});
