import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import BrowserWindow from './components/Browser/BrowserWindow';
import './App.css';
import './styles/themes.css';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BrowserWindow />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
