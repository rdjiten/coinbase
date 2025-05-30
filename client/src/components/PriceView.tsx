import { useSelector } from 'react-redux';
import './PriceView.css';
import type { RootState } from '../store';

const PriceView = () => {
  const prices = useSelector((state: RootState) => state.ws.prices);
  const subscriptions = useSelector((state: RootState) => state.ws.subscriptions);
  const maxRows = 15;

  return (
    <div className="order-book-container">
      <h2>Order Book</h2>
      {subscriptions.map((product) => {
        const data = prices[product];
        const bids = data?.bids || {};
        const asks = data?.asks || {};
        const bidsArr = Object.entries(bids).map(([price, size]) => ({ price, size }));
        const asksArr = Object.entries(asks).map(([price, size]) => ({ price, size }));
        bidsArr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        asksArr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        return (
          <div key={product} className="order-book">
            <h3>{product}</h3>
            <div className="order-book-table">
              <div className="order-book-column">
                <div className="column-header bid-header">Bids</div>
                {[...Array(maxRows)].map((_, idx) => {
                  const bid = bidsArr[idx];
                  return (
                    <div className={`order-row ${idx % 2 === 0 ? 'even' : ''}`} key={idx}>
                      {bid ? (
                        <>
                          <span className="price bid-price">{parseFloat(bid.price).toFixed(2)}</span>
                          <span className="size">{parseFloat(bid.size).toFixed(4)}</span>
                        </>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="order-book-column">
                <div className="column-header ask-header">Asks</div>
                {[...Array(maxRows)].map((_, idx) => {
                  const ask = asksArr[idx];
                  return (
                    <div className={`order-row ${idx % 2 === 0 ? 'even' : ''}`} key={idx}>
                      {ask ? (
                        <>
                          <span className="price ask-price">{parseFloat(ask.price).toFixed(2)}</span>
                          <span className="size">{parseFloat(ask.size).toFixed(4)}</span>
                        </>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceView;
