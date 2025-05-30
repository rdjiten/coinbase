import { useDispatch, useSelector } from 'react-redux';
import { addSubscription, removeSubscription } from '../store/slices/wsSlice';
import { sendMessage } from '../services/wsClient';
import type { RootState } from '../store';
import './SubscribeControl.css';

const products = ['BTC-USD', 'ETH-USD', 'XRP-USD', 'LTC-USD'] as const;

const SubscribeControl = () => {
  const dispatch = useDispatch();
  const { subscriptions } = useSelector((state: RootState) => state.ws);

  const toggle = (product: string) => {
    if (subscriptions.includes(product as any)) {
      sendMessage({
        type: 'unsubscribe',
        product_ids: [product],
      });
      dispatch(removeSubscription(product as any));
    } else {
      sendMessage({
        type: 'subscribe',
        product_ids: [product],
      });
      dispatch(addSubscription(product as any));
    }
  };

  return (
    <div className="subscribe-container">
      {products.map((p) => (
        <button
          key={p}
          className={`subscribe-btn ${subscriptions.includes(p as any) ? 'active' : ''}`}
          onClick={() => toggle(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default SubscribeControl;
