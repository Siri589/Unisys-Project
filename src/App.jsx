import './App.css';
import Hero from './components/custom/Hero';
import Header from './components/custom/Header';

function App() {
  return (
    <div className="app" style={{
      background: 'url("/images/background.jpg") no-repeat center center fixed',
      backgroundSize: '100% 100%',
      WebkitBackgroundSize: '100% 100%',
      MozBackgroundSize: '100% 100%',
      OBackgroundSize: '100% 100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0
    }}>
      <Header />
      <Hero />
    </div>
  );
}

export default App;
