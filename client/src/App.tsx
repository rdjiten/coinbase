import { useEffect } from 'react';
import SubscribeControl from './components/SubscribeControl';
import PriceView from './components/PriceView';
import MatchView from './components/MatchView';
import { initSocket } from './services/wsClient';
import './App.css';
import SystemStatus from './components/SystemStatus';

function App() {
  useEffect(() => {
    initSocket();
  }, []);

  return (
    <div className="container">
      <h1>Real-Time Crypto Trading View</h1>
      <SubscribeControl />
      <div className="views-container">
        <PriceView />
        <MatchView />
        <SystemStatus/>
      </div>
    </div>
  );
}

export default App;
