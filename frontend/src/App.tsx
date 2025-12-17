import { useEffect } from 'react';
import { Header } from './components/Header';
import { OrderBook } from './components/OrderBook';
import { TradeForm } from './components/TradeForm';
import { useOrderNotifications } from './hooks/useOrderNotifications';
import './App.scss';

function App() {
  useOrderNotifications();

  useEffect(() => {
    //Request notification permission on mount
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="grid-layout">
          <div className="panel chart-panel">Chart (Coming Soon)</div>
          <div className="panel orderbook-panel">
            <OrderBook />
          </div>
          <div className="panel trade-panel">
            <TradeForm />
          </div>
          <div className="panel history-panel">History (Coming Soon)</div>
        </div>
      </main>
    </div>
  )
}

export default App
