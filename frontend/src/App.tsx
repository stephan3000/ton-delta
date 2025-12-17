import { Header } from './components/Header';
import { OrderBook } from './components/OrderBook';
import { TradeForm } from './components/TradeForm';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="grid-layout">
          <div className="panel order-book-panel">
            <h2>Order Book</h2>
            <OrderBook />
          </div>
          <div className="panel chart-panel">
            <h2>Price</h2>
            <div className="placeholder">Chart (Coming Soon)</div>
          </div>
          <div className="panel trade-panel">
            <h2>Trade</h2>
            <TradeForm />
          </div>
          <div className="panel history-panel">
            <h2>History</h2>
            <div className="placeholder">No trades yet</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
