import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import type { RootState } from '../store';
import './MatchView.css';

const MatchView = () => {
  const matches = useSelector((state: RootState) => state.ws.matches);
  const subscriptions = useSelector((state: RootState) => state.ws.subscriptions);

  return (
    <div className="match-view">
      <h2>Match View (Live Trades)</h2>
      {subscriptions.map((product) => {
        const tradeList = matches[product] || [];
        return (
          <div key={product} className="trade-section">
            <h3>{product}</h3>
            <table className="trade-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Side</th>
                </tr>
              </thead>
              <tbody>
                {tradeList.map((match, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'even-row' : ''}>
                    <td>{dayjs(match.time).format('HH:mm:ss')}</td>
                    <td>{parseFloat(match.size).toFixed(4)}</td>
                    <td style={{ color: match.side === 'buy' ? 'green' : 'red' }}>
                      {parseFloat(match.price).toFixed(4)}
                    </td>
                    <td>{match.side}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default MatchView;
