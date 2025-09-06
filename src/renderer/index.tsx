import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// Fix the IPC method names
window.electron?.ipcRenderer.once('ipc-example', (arg) => {
  console.log(arg);
});

// Change sendMessage to send
window.electron?.ipcRenderer.send('ipc-example', ['ping']);

// Also add corresponding handler in main.ts if needed
