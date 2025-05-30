import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import './SystemStatus.css';

const SystemStatus = () => {
  const systemStatus = useSelector((state: RootState) => state.ws.systemStatus);

  return (
    <div className="system-status-container">
      <h2>System Status (Server Subscriptions)</h2>
      {systemStatus.length === 0 ? (
        <p>No active server subscriptions</p>
      ) : (
        <ul className="system-status-list">
          {systemStatus.map((status, idx) => (
            <li key={idx}>{status}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SystemStatus;
