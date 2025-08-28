import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import BrowserWindow from './components/Browser/BrowserWindow';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BrowserWindow />} />
      </Routes>
    </Router>
  );
}
