import { store } from '../store';
import {
  setConnected,
  updateSystemStatus,
  updatePrice,
  addMatch
} from '../store/slices/wsSlice';

let ws: WebSocket | null = null;
let reconnectTimer: any;

export const initSocket = () => {
  ws = new WebSocket(import.meta.env.VITE_WS_URL);

  ws.onopen = () => {
    console.log('[WS] Connected');
    clearTimeout(reconnectTimer);
    store.dispatch(setConnected(true));

    // On reconnect, re-subscribe to client subscriptions
    const currentSubscriptions = store.getState().ws.subscriptions;
    currentSubscriptions.forEach((product) => {
      sendMessage({
        type: 'subscribe',
        product_ids: [product],
      });
    });
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const product = data.product_id;

    if (data.type === 'server_status') {
      store.dispatch(updateSystemStatus(data));
    }

    if (data.type === 'match') {
      store.dispatch(
        addMatch({
          product,
          match: {
            product_id: product,
            side: data.side,
            price: data.price,
            size: data.size,
            time: data.time
          }
        })
      );
    }

    if (data.type === 'l2update') {
      store.dispatch(updatePrice({ product, changes: data.changes }));
    }
  };

  ws.onclose = () => {
    store.dispatch(setConnected(false));
    reconnectTimer = setTimeout(() => {
      console.log('Reconnecting...');
      initSocket();
    }, 3000);
  };

  ws.onerror = () => {
    ws?.close();
  };
};

export const sendMessage = (msg: any) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
};
