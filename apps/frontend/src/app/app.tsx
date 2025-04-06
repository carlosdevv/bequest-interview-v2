import { useEffect } from 'react';
import { Clauses } from '../components/clauses';
import { ClausesProvider } from '../context/ClausesContext';
import { DocumentEditor } from './DocumentEditor';

export function App() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      div[style*="z-index: 999999999"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ClausesProvider>
      <div className="flex h-screen bg-[#1a2841]">
        <div className="flex-1">
          <DocumentEditor />
        </div>
        <div className="w-80 p-4">
          <Clauses />
        </div>
      </div>
    </ClausesProvider>
  );
}

export default App;
